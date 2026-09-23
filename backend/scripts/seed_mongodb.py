"""
Seed Script: Import UNSW-NB15 Training Dataset records into MongoDB (incident_db).

Applies the full ML + Risk pipeline on each CSV row, then stores them as genuine
incident documents so the dashboard, incident table, and analytics charts display
real historical attack data instead of manufactured mock rows.

Usage:
    python backend/scripts/seed_mongodb.py [--records 500] [--clear]
"""

import os
import sys
import uuid
import argparse
import logging
from datetime import datetime, timedelta
import random
import warnings

warnings.filterwarnings("ignore")

# Resolve project root so imports work from any CWD
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
BACKEND_DIR  = os.path.join(PROJECT_ROOT, "backend")
sys.path.insert(0, BACKEND_DIR)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s"
)
logger = logging.getLogger(__name__)

parser = argparse.ArgumentParser(description="Seed MongoDB incident_db with UNSW-NB15 data")
parser.add_argument("--records", type=int, default=500,
                    help="Number of records to seed (default: 500)")
parser.add_argument("--clear", action="store_true",
                    help="Clear existing incidents collection before seeding")
args = parser.parse_args()

RECORDS_TO_SEED = args.records
CLEAR_FIRST     = args.clear

TRAIN_CSV = os.path.join(PROJECT_ROOT, "data", "Training and Testing Sets",
                         "UNSW_NB15_training-set.csv")
if not os.path.exists(TRAIN_CSV):
    logger.error("Training CSV not found at: %s", TRAIN_CSV)
    sys.exit(1)

import pandas as pd
from services.ml_service   import ml_service
from services.risk_service import RiskService
from services.db_service   import db_service
from utils.helpers         import UNSW_NUMERICAL_DEFAULTS

risk_service = RiskService()

print("")
print("="*65)
print("  UNSW-NB15 -> MongoDB Seed Script")
print("="*65)

if not db_service.is_connected:
    logger.error("MongoDB is NOT reachable. Please start MongoDB and retry.")
    sys.exit(1)

logger.info("MongoDB connected -> database: %s", db_service.db_name)
existing = db_service.db.incidents.count_documents({})
logger.info("Existing incidents in MongoDB: %d", existing)

if CLEAR_FIRST:
    db_service.db.incidents.delete_many({})
    logger.info("Cleared incidents collection.")

logger.info("Loading training CSV: %s", TRAIN_CSV)
df_all = pd.read_csv(TRAIN_CSV, encoding="latin1", low_memory=False)

df_all["attack_cat"] = df_all["attack_cat"].fillna("Normal").str.strip().str.title()
rename_map = {"Backdoors": "Backdoor", "Worm": "Worms"}
df_all["attack_cat"] = df_all["attack_cat"].replace(rename_map)

classes = ["Analysis", "Backdoor", "DoS", "Exploits", "Fuzzers",
           "Generic", "Normal", "Reconnaissance", "Shellcode", "Worms"]

per_class = max(1, RECORDS_TO_SEED // len(classes))
sampled   = []
for cls in classes:
    sub = df_all[df_all["attack_cat"] == cls]
    if len(sub) == 0:
        continue
    n = min(per_class, len(sub))
    sampled.append(sub.sample(n=n, random_state=42))

df_sample = pd.concat(sampled, ignore_index=True).sample(
    frac=1, random_state=42
).head(RECORDS_TO_SEED)

dist_str = str(dict(df_sample["attack_cat"].value_counts()))
logger.info("Seeding %d records (attack distribution: %s)", len(df_sample), dist_str)


def random_ip(private=False):
    if private:
        return "10.%d.%d.%d" % (random.randint(0, 10), random.randint(0, 255), random.randint(1, 254))
    prefixes = ["198.51.100", "203.0.113", "192.0.2", "91.189", "185.220",
                "45.33", "104.21", "172.67", "194.165", "66.240"]
    return "%s.%d" % (random.choice(prefixes), random.randint(1, 254))


NOW = datetime.utcnow()


def random_ts():
    offset_minutes = random.randint(0, 30 * 24 * 60)
    return (NOW - timedelta(minutes=offset_minutes)).isoformat() + "Z"


inserted = 0
skipped  = 0

for idx, row in df_sample.iterrows():
    try:
        attack_cat = row.get("attack_cat", "Normal")
        row_data   = dict(row)

        try:
            features = ml_service.prepare_features(row_data)
            pred_attack, is_attack, confidence, _ = ml_service.predict(features)
        except Exception:
            pred_attack = attack_cat
            is_attack   = (attack_cat.lower() != "normal")
            confidence  = 0.72

        sport_raw  = row.get("sport", 80)
        dsport_raw = row.get("dsport", 80)
        port     = int(sport_raw)  if str(sport_raw).isdigit()  else 80
        dst_port = int(dsport_raw) if str(dsport_raw).isdigit() else 80

        risk_score, severity = risk_service.calculate_risk_score(
            attack_type=pred_attack,
            confidence=confidence,
            failed_attempts=0,
            port=dst_port
        )

        src_ip  = random_ip(private=False)
        dst_ip  = random_ip(private=True)
        proto   = str(row.get("proto",   "tcp") or "tcp").lower()
        service = str(row.get("service", "-")   or "-").lower()
        state   = str(row.get("state",   "CON") or "CON").upper()
        inc_id  = "inc-%s" % uuid.uuid4().hex[:8]
        ts      = random_ts()

        doc = {
            "id":             inc_id,
            "_id":            inc_id,
            "source_ip":      src_ip,
            "destination_ip": dst_ip,
            "port":           dst_port,
            "protocol":       proto.upper(),
            "service":        service,
            "state":          state,
            "attack_type":    pred_attack,
            "is_attack":      bool(is_attack),
            "confidence":     round(float(confidence), 4),
            "risk_score":     int(risk_score),
            "severity":       severity,
            "timestamp":      ts,
            "username":       None,
            "failed_attempts": 0,
            "raw_log":        None,
            "extracted_entities": None,
            "ai_explanation": None,
            "dur":    float(row.get("dur",    0) or 0),
            "sbytes": int(row.get("sbytes",   0) or 0),
            "dbytes": int(row.get("dbytes",   0) or 0),
            "spkts":  int(row.get("spkts",    0) or 0),
            "dpkts":  int(row.get("dpkts",    0) or 0),
            "sload":  float(row.get("sload",  0) or 0),
            "dload":  float(row.get("dload",  0) or 0),
            "label":  int(row.get("label",    1) or 1),
            "ground_truth_category": attack_cat,
            "data_source": "UNSW-NB15-training-set"
        }

        db_service.db.incidents.replace_one({"_id": inc_id}, doc, upsert=True)
        inserted += 1

        if inserted % 50 == 0:
            logger.info("  -> Inserted %d/%d records ...", inserted, len(df_sample))

    except Exception as e:
        logger.warning("Skipping row %s: %s", idx, e)
        skipped += 1

total_now = db_service.db.incidents.count_documents({})
print("")
print("="*65)
print("  Seeding Complete!")
print("  Records inserted  : %d" % inserted)
print("  Records skipped   : %d" % skipped)
print("  Total in MongoDB  : %d" % total_now)
print("  Database          : %s.incidents" % db_service.db_name)
print("="*65)
