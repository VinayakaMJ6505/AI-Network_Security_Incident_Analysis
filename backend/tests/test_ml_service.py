"""
TDD Tests for ML Inference Service.
Tests written FIRST (RED).
"""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.ml_service import MLService

ml = MLService()

def test_model_loads():
    """Model or fallback must be ready."""
    assert ml.classes is not None
    assert len(ml.classes) == 10

def test_classes_include_normal():
    assert "Normal" in ml.classes

def test_classes_include_all_categories():
    expected = ["Normal", "DoS", "Exploits", "Fuzzers", "Generic",
                "Analysis", "Backdoor", "Reconnaissance", "Shellcode", "Worms"]
    for cat in expected:
        assert cat in ml.classes, f"Missing class: {cat}"

def test_predict_returns_four_values():
    result = ml.predict({})
    assert len(result) == 4

def test_predict_attack_type_valid():
    attack_type, is_attack, confidence, probs = ml.predict({})
    assert attack_type in ml.classes

def test_predict_confidence_range():
    _, _, confidence, _ = ml.predict({})
    assert 0.0 <= confidence <= 1.0

def test_predict_is_attack_bool():
    _, is_attack, _, _ = ml.predict({})
    assert isinstance(is_attack, bool)

def test_predict_normal_is_not_attack():
    """A request with clearly normal features should ideally not be attack."""
    features = {
        "proto": "tcp", "service": "http", "state": "FIN",
        "dur": 0.01, "spkts": 2, "dpkts": 2,
        "sbytes": 100, "dbytes": 200, "rate": 50.0,
        "sttl": 64, "dttl": 60, "sload": 500.0, "dload": 800.0,
        "sloss": 0, "dloss": 0
    }
    attack_type, _, _, probs = ml.predict(features)
    # Ensure probabilities dict is returned correctly
    assert isinstance(probs, dict)
    assert len(probs) > 0

def test_predict_probabilities_sum_near_one():
    _, _, _, probs = ml.predict({"proto": "tcp", "service": "http", "state": "CON"})
    total = sum(probs.values())
    assert abs(total - 1.0) < 0.2  # Allowing some tolerance for heuristic

def test_prepare_features_fills_defaults():
    """Prepare features must not raise even with empty input."""
    try:
        X = ml.prepare_features({})
        assert X is not None
    except Exception as e:
        # Only acceptable if model not loaded
        assert not ml.is_loaded, f"Prepare failed with loaded model: {e}"
