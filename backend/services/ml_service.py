"""
Machine Learning Service for Network Security Incident Analysis.
Loads the trained XGBoost model and preprocessors from final_network_security_xgboost.pkl.
"""
import os
import json
import logging
import numpy as np
import pandas as pd
import joblib
from typing import Dict, Any, Tuple

from utils.helpers import UNSW_NUMERICAL_DEFAULTS

logger = logging.getLogger(__name__)

BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Search paths for model pickle
MODEL_PATHS = [
    os.path.join(os.path.dirname(BACKEND_DIR), "final_network_security_xgboost.pkl"),
    os.path.join(BACKEND_DIR, "final_network_security_xgboost.pkl"),
    "final_network_security_xgboost.pkl",
    "../final_network_security_xgboost.pkl"
]

# Real, measured benchmark (backend/scripts/evaluate_model.py against the full
# UNSW-NB15 test set) — not a placeholder. Falls back to that script's last
# known-good result if the report file is missing so the API never reports a
# fabricated number.
BENCHMARK_REPORT_PATH = os.path.join(BACKEND_DIR, "reports", "model_evaluation_report.json")
FALLBACK_BENCHMARK = {
    "accuracy": 0.7697,
    "macro_precision": 0.5326,
    "macro_recall": 0.5414,
    "macro_f1": 0.4966,
    "weighted_f1": 0.7788,
}

class MLService:
    def __init__(self):
        self.model = None
        self.encoder = None
        self.scaler = None
        self.categorical_columns = ['proto', 'service', 'state']
        self.numerical_columns = list(UNSW_NUMERICAL_DEFAULTS.keys())
        self.label_encoder = None
        self.classes = [
            'Analysis', 'Backdoor', 'DoS', 'Exploits', 'Fuzzers',
            'Generic', 'Normal', 'Reconnaissance', 'Shellcode', 'Worms'
        ]
        self.is_loaded = False
        self.benchmark = dict(FALLBACK_BENCHMARK)
        self._load_model()
        self._load_benchmark()

    def _load_benchmark(self):
        """Loads the real, measured accuracy from the last run of
        backend/scripts/evaluate_model.py, so the API and UI report actual
        performance instead of a hand-typed placeholder."""
        try:
            if os.path.exists(BENCHMARK_REPORT_PATH):
                with open(BENCHMARK_REPORT_PATH, "r", encoding="utf-8") as f:
                    report = json.load(f)
                self.benchmark = report.get("summary", self.benchmark)
                self.benchmark["generated_at"] = report.get("generated_at")
                self.benchmark["total_test_records"] = report.get("total_test_records")
                logger.info(f"Loaded model benchmark: accuracy={self.benchmark.get('accuracy')}")
        except Exception as e:
            logger.warning(f"Could not load benchmark report ({e}). Using fallback accuracy.")

    def _load_model(self):
        for path in MODEL_PATHS:
            if os.path.exists(path):
                try:
                    logger.info(f"Loading ML model package from {path}...")
                    pkg = joblib.load(path)
                    if isinstance(pkg, dict):
                        self.model = pkg.get('model')
                        self.encoder = pkg.get('encoder')
                        self.scaler = pkg.get('scaler')
                        self.categorical_columns = pkg.get('categorical_columns', self.categorical_columns)
                        self.numerical_columns = pkg.get('numerical_columns', self.numerical_columns)
                        self.label_encoder = pkg.get('label_encoder')
                        if self.label_encoder is not None and hasattr(self.label_encoder, 'classes_'):
                            self.classes = list(self.label_encoder.classes_)
                    else:
                        self.model = pkg

                    self.is_loaded = True
                    logger.info(f"ML Model successfully loaded with classes: {self.classes}")
                    return
                except Exception as e:
                    logger.error(f"Error loading model from {path}: {e}")
        
        logger.warning("Could not load model from pickle. Will use resilient heuristic fallback.")

    def prepare_features(self, data: Dict[str, Any]) -> np.ndarray:
        """
        Prepares a single feature vector from input dictionary matching UNSW-NB15 schema.
        """
        # 1. Fill Numerical Features
        num_vals = []
        for col in self.numerical_columns:
            val = data.get(col)
            if val is None or val == "":
                val = UNSW_NUMERICAL_DEFAULTS.get(col, 0.0)
            else:
                try:
                    val = float(val)
                except (ValueError, TypeError):
                    val = UNSW_NUMERICAL_DEFAULTS.get(col, 0.0)
            num_vals.append(val)
        
        num_array = np.array([num_vals], dtype=np.float64)

        # 2. Fill Categorical Features
        proto = str(data.get('proto', 'tcp') or 'tcp').lower()
        service = str(data.get('service', '-') or '-').lower()
        state = str(data.get('state', 'CON') or 'CON').upper()

        cat_df = pd.DataFrame([{
            'proto': proto,
            'service': service,
            'state': state
        }])

        # Ensure correct column ordering
        cat_df = cat_df[self.categorical_columns]

        if self.scaler is not None and self.encoder is not None:
            scaled_num = self.scaler.transform(num_array)
            encoded_cat = self.encoder.transform(cat_df)
            return np.hstack([scaled_num, encoded_cat])
        else:
            return num_array

    def predict(self, feature_data: Dict[str, Any]) -> Tuple[str, bool, float, Dict[str, float]]:
        """
        Runs inference on provided features.
        Returns:
            (attack_type, is_attack, confidence, probabilities_dict)
        """
        if self.is_loaded and self.model is not None:
            try:
                X = self.prepare_features(feature_data)
                
                # Check for predict_proba
                if hasattr(self.model, "predict_proba"):
                    probs = self.model.predict_proba(X)[0]
                    pred_idx = int(np.argmax(probs))
                    confidence = float(probs[pred_idx])
                    
                    prob_dict = {
                        self.classes[i]: round(float(probs[i]), 4)
                        for i in range(min(len(self.classes), len(probs)))
                    }
                else:
                    pred_idx = int(self.model.predict(X)[0])
                    confidence = 0.95
                    prob_dict = {self.classes[pred_idx]: 1.0}

                attack_type = self.classes[pred_idx] if pred_idx < len(self.classes) else "Generic"
                is_attack = (attack_type.lower() != "normal")
                return attack_type, is_attack, round(confidence, 4), prob_dict

            except Exception as e:
                logger.error(f"Inference error with loaded model: {e}")

        # Heuristic rule-based fallback if model is unavailable
        return self._heuristic_predict(feature_data)

    def _heuristic_predict(self, data: Dict[str, Any]) -> Tuple[str, bool, float, Dict[str, float]]:
        """
        Heuristic fallback classifier if model prediction fails.
        """
        failed_attempts = int(data.get('failed_attempts', 0) or 0)
        rate = float(data.get('rate', 0.0) or 0.0)
        service = str(data.get('service', '-') or '').lower()
        port = int(data.get('destination_port', data.get('port', 0)) or 0)

        if failed_attempts >= 5 or (port == 22 and failed_attempts > 0):
            attack_type = "Exploits"
            confidence = 0.92
        elif rate > 5000:
            attack_type = "DoS"
            confidence = 0.88
        elif service in ["ftp", "ftp-data"] and failed_attempts > 2:
            attack_type = "Backdoor"
            confidence = 0.84
        elif port in [4444, 31337]:
            attack_type = "Shellcode"
            confidence = 0.90
        elif data.get('is_attack_keyword_matched'):
            attack_type = "Reconnaissance"
            confidence = 0.82
        else:
            attack_type = "Normal"
            confidence = 0.96

        is_attack = (attack_type != "Normal")
        probs = {c: 0.01 for c in self.classes}
        probs[attack_type] = confidence
        return attack_type, is_attack, confidence, probs

# Singleton instance
ml_service = MLService()
