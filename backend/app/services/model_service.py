"""
AgroCare Backend — Model Service
Load TensorFlow models and run predictions.
Corn-only disease detection with image validation.
"""

import threading
import numpy as np
from PIL import Image
from io import BytesIO
import tensorflow as tf
from tensorflow.keras.models import load_model  # type: ignore

from app.config import (
    CORN_DISEASE_MODEL_PATH,
    CORN_VALIDATOR_MODEL_PATH,
    IMAGE_SIZE,
    CORN_DISEASE_LABELS,
    TREATMENTS,
)


# ── Compatibility shim ─────────────────────────────────────────────────
# Models saved with newer Keras may include `quantization_config` in layer
# configs.  Older TF/Keras versions don't recognise that kwarg, so we
# provide a thin wrapper that silently drops it during deserialization.
class _CompatDense(tf.keras.layers.Dense):
    def __init__(self, *args, **kwargs):
        kwargs.pop("quantization_config", None)
        super().__init__(*args, **kwargs)


_CUSTOM_OBJECTS = {"Dense": _CompatDense}

# ── Global model references (loaded lazily on first use) ──────────────
_models: dict = {}
_model_lock = threading.Lock()

_MODEL_PATHS = {
    "corn_disease": CORN_DISEASE_MODEL_PATH,
    "corn_validator": CORN_VALIDATOR_MODEL_PATH,
}


def _ensure_model(name: str):
    """Load a single model if not already loaded (thread-safe)."""
    if name in _models:
        return
    with _model_lock:
        if name in _models:  # double-check after acquiring lock
            return
        path = _MODEL_PATHS.get(name)
        if path is None:
            raise RuntimeError(f"Unknown model: {name}")
        print(f"Loading model '{name}' from {path} ...")
        _models[name] = load_model(path, custom_objects=_CUSTOM_OBJECTS, compile=False)
        print(f"Model '{name}' loaded successfully.")


def load_models() -> dict:
    """Pre-load all models (optional — called at startup for pre-warming)."""
    global _models
    status = {}
    for name, path in _MODEL_PATHS.items():
        try:
            _ensure_model(name)
            status[name] = "loaded"
        except Exception as exc:
            status[name] = f"error: {exc}"
    return status


def get_models_status() -> dict:
    """Return which models are currently loaded."""
    return {name: "loaded" for name in _models}


def preprocess_image(raw_bytes: bytes) -> np.ndarray:
    """Read raw bytes → PIL Image → 224×224 numpy array."""
    image = Image.open(BytesIO(raw_bytes)).convert("RGB")
    image = image.resize(IMAGE_SIZE)
    arr = np.array(image, dtype="float32")
    return np.expand_dims(arr, axis=0)


def validate_corn_image(image: np.ndarray) -> bool:
    """
    Validate whether the uploaded image is a valid corn leaf image.
    Returns True if the image is valid corn, False otherwise.

    The validator model uses sigmoid activation with a single output:
      - value < 0.5  → class 0 (Corn / valid)
      - value >= 0.5 → class 1 (Invalid)
    Note: We divide by 255 here because this model expects [0, 1] range.
    """
    _ensure_model("corn_validator")
    model = _models["corn_validator"]
    preds = model.predict(image / 255.0, verbose=0)
    raw_value = float(preds[0][0])
    # Sigmoid: value < 0.5 means class 0 (Corn), value >= 0.5 means class 1 (Invalid)
    is_corn = raw_value < 0.5
    label = "Corn" if is_corn else "Invalid"
    confidence = (1 - raw_value) if is_corn else raw_value
    print(f"Validator result: {label} (raw={raw_value:.4f}, confidence={confidence*100:.1f}%)")
    return is_corn


def predict_disease(image: np.ndarray) -> tuple[str, float]:
    """Run the corn disease model. Returns (disease_name, confidence)."""
    _ensure_model("corn_disease")
    model = _models["corn_disease"]
    preds = model.predict(image, verbose=0)
    # Debug: print all class probabilities
    print(f"Disease model raw predictions: {preds[0]}")
    for i, label in enumerate(CORN_DISEASE_LABELS):
        print(f"  Index {i}: {label} = {preds[0][i]:.4f}")
    idx = int(np.argmax(preds[0]))
    confidence = float(preds[0][idx])
    print(f"Disease prediction: {CORN_DISEASE_LABELS[idx]} ({confidence*100:.1f}%)")
    return CORN_DISEASE_LABELS[idx], round(confidence * 100, 2)


def get_treatment(disease: str) -> str:
    """Return treatment recommendation for the given disease."""
    return TREATMENTS.get(disease, "No treatment information available.")
