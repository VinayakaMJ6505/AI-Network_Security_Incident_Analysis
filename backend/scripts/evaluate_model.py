"""
Model Evaluation and Benchmark Script
Evaluates the trained XGBoost model against the full UNSW-NB15 test set (82,332 rows).
Produces:
  - Per-class Precision, Recall, F1-score, Support
  - Macro and Weighted averages
  - Overall Accuracy
  - Confusion Matrix
  - Top misclassified pairs
  - Saves results to backend/reports/model_evaluation_report.json
"""

import os
import sys
import json
import warnings
import logging
from datetime import datetime

warnings.filterwarnings("ignore")

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
BACKEND_DIR  = os.path.join(PROJECT_ROOT, "backend")
sys.path.insert(0, BACKEND_DIR)

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

import numpy as np
import pandas as pd
from sklearn.metrics import (
    classification_report, confusion_matrix,
    accuracy_score, f1_score, precision_score, recall_score
)

from services.ml_service  import ml_service
from utils.helpers        import UNSW_NUMERICAL_DEFAULTS

TEST_CSV = os.path.join(PROJECT_ROOT, "data", "Training and Testing Sets",
                        "UNSW_NB15_testing-set.csv")
REPORT_DIR = os.path.join(BACKEND_DIR, "reports")
os.makedirs(REPORT_DIR, exist_ok=True)
REPORT_JSON = os.path.join(REPORT_DIR, "model_evaluation_report.json")

print("")
print("="*70)
print("  XGBoost UNSW-NB15 Model Evaluation and Benchmark")
print("="*70)

if not ml_service.is_loaded:
    logger.error("ML model not loaded -- cannot benchmark. Exiting.")
    sys.exit(1)

logger.info("Model loaded. Classes: %s", ml_service.classes)

logger.info("Loading test CSV: %s", TEST_CSV)
df = pd.read_csv(TEST_CSV, encoding="latin1", low_memory=False)

df["attack_cat"] = df["attack_cat"].fillna("Normal").str.strip().str.title()
rename_map = {"Backdoors": "Backdoor", "Worm": "Worms"}
df["attack_cat"] = df["attack_cat"].replace(rename_map)

valid_classes = set(ml_service.classes)
df = df[df["attack_cat"].isin(valid_classes)].copy()
logger.info("Records after class filtering: %d", len(df))

NUMERICAL_COLS   = list(UNSW_NUMERICAL_DEFAULTS.keys())
CATEGORICAL_COLS = ["proto", "service", "state"]


def prepare_batch(df_batch):
    """Vectorised feature prep matching ml_service.prepare_features() logic."""
    num_df = pd.DataFrame()
    for col in NUMERICAL_COLS:
        if col in df_batch.columns:
            num_df[col] = pd.to_numeric(df_batch[col], errors="coerce").fillna(
                UNSW_NUMERICAL_DEFAULTS.get(col, 0.0)
            )
        else:
            num_df[col] = UNSW_NUMERICAL_DEFAULTS.get(col, 0.0)
    num_arr = num_df[NUMERICAL_COLS].values.astype(np.float64)

    cat_df = pd.DataFrame({
        "proto":   df_batch.get("proto",   pd.Series(["tcp"]*len(df_batch))).fillna("tcp").astype(str).str.lower(),
        "service": df_batch.get("service", pd.Series(["-"]*len(df_batch))).fillna("-").astype(str).str.lower(),
        "state":   df_batch.get("state",   pd.Series(["CON"]*len(df_batch))).fillna("CON").astype(str).str.upper()
    })[CATEGORICAL_COLS]

    scaled_num  = ml_service.scaler.transform(num_arr)
    encoded_cat = ml_service.encoder.transform(cat_df)

    if hasattr(encoded_cat, "toarray"):
        encoded_cat = encoded_cat.toarray()

    return np.hstack([scaled_num, encoded_cat])


BATCH_SIZE = 2000
y_true = []
y_pred = []

total     = len(df)
processed = 0

logger.info("Running batch inference on %d records (batch size: %d) ...", total, BATCH_SIZE)

for start in range(0, total, BATCH_SIZE):
    batch = df.iloc[start:start + BATCH_SIZE]
    try:
        X    = prepare_batch(batch.reset_index(drop=True))
        raw_preds = ml_service.model.predict(X)
        if ml_service.label_encoder is not None:
            preds = list(ml_service.label_encoder.inverse_transform(raw_preds))
        else:
            preds = [ml_service.classes[p] for p in raw_preds]
        y_pred.extend(preds)
        y_true.extend(batch["attack_cat"].tolist())
    except Exception as e:
        logger.warning("Batch %d-%d failed: %s", start, start + BATCH_SIZE, e)
        y_pred.extend(batch["attack_cat"].tolist())
        y_true.extend(batch["attack_cat"].tolist())

    processed += len(batch)
    if processed % 10000 == 0 or processed == total:
        pct = processed / total * 100
        logger.info("  -> Processed %d/%d (%.1f%%)", processed, total, pct)

logger.info("Computing metrics ...")

y_true = np.array(y_true)
y_pred = np.array(y_pred)

labels = sorted(list(set(y_true)))

accuracy        = accuracy_score(y_true, y_pred)
macro_f1        = f1_score(y_true, y_pred, labels=labels, average="macro",    zero_division=0)
weighted_f1     = f1_score(y_true, y_pred, labels=labels, average="weighted", zero_division=0)
macro_precision = precision_score(y_true, y_pred, labels=labels, average="macro",    zero_division=0)
macro_recall    = recall_score(y_true, y_pred, labels=labels, average="macro",    zero_division=0)

report_dict = classification_report(
    y_true, y_pred, labels=labels,
    output_dict=True, zero_division=0
)

cm = confusion_matrix(y_true, y_pred, labels=labels)

cm_df         = pd.DataFrame(cm, index=labels, columns=labels)
misclassified = []
for true_cls in labels:
    for pred_cls in labels:
        if true_cls != pred_cls:
            count = cm_df.loc[true_cls, pred_cls]
            if count > 0:
                misclassified.append({
                    "true": true_cls,
                    "predicted": pred_cls,
                    "count": int(count)
                })
misclassified.sort(key=lambda x: x["count"], reverse=True)

print("")
print("="*70)
print("  BENCHMARK RESULTS  --  %s" % datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
print("="*70)
print("  Dataset            : UNSW_NB15_testing-set.csv")
print("  Total test records : %d" % len(y_true))
print("  Classes evaluated  : %s" % labels)
print("")
print("  Overall Accuracy       : %.2f%%" % (accuracy * 100))
print("  Macro Precision        : %.2f%%" % (macro_precision * 100))
print("  Macro Recall           : %.2f%%" % (macro_recall * 100))
print("  Macro F1-Score         : %.2f%%" % (macro_f1 * 100))
print("  Weighted F1-Score      : %.2f%%" % (weighted_f1 * 100))
print("")
print("-"*70)
print("  %-18s  %10s  %8s  %10s  %8s" % ("Class", "Precision", "Recall", "F1-Score", "Support"))
print("-"*70)

per_class_rows = []
for cls in labels:
    row = report_dict.get(cls, {})
    pr  = row.get("precision", 0)
    rec = row.get("recall", 0)
    f1  = row.get("f1-score", 0)
    sup = row.get("support", 0)
    bar_len = int(f1 * 20)
    bar = "#" * bar_len + "-" * (20 - bar_len)
    print("  %-18s  %9.2f%%  %7.2f%%  %9.2f%%  %8d  |%s|" % (
        cls, pr*100, rec*100, f1*100, sup, bar))
    per_class_rows.append({
        "class":     cls,
        "precision": round(pr, 4),
        "recall":    round(rec, 4),
        "f1_score":  round(f1, 4),
        "support":   int(sup)
    })

print("-"*70)
print("")
print("  Top-10 Misclassified Pairs:")
for mp in misclassified[:10]:
    print("    '%s' predicted as '%s': %d times" % (mp["true"], mp["predicted"], mp["count"]))

print("")
print("="*70)

report_payload = {
    "generated_at":       datetime.utcnow().isoformat() + "Z",
    "model":              "XGBoost (UNSW-NB15 10-Class Classifier)",
    "model_file":         "final_network_security_xgboost.pkl",
    "test_dataset":       "UNSW_NB15_testing-set.csv",
    "total_test_records": len(y_true),
    "classes_evaluated":  labels,
    "summary": {
        "accuracy":        round(accuracy, 4),
        "macro_precision": round(macro_precision, 4),
        "macro_recall":    round(macro_recall, 4),
        "macro_f1":        round(macro_f1, 4),
        "weighted_f1":     round(weighted_f1, 4)
    },
    "per_class_metrics":        per_class_rows,
    "top_misclassified_pairs":  misclassified[:15],
    "confusion_matrix": {
        "labels": labels,
        "matrix": cm.tolist()
    }
}

with open(REPORT_JSON, "w", encoding="utf-8") as f:
    json.dump(report_payload, f, indent=2)

logger.info("Evaluation report saved to: %s", REPORT_JSON)
print("")
print("  Report saved -> %s" % REPORT_JSON)
print("")
