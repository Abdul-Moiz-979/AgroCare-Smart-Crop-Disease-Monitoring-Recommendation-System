"""
AgroCare Backend — Configuration
Model paths, disease labels, and treatment recommendations.
Corn-only disease detection with image validation.
"""

import os

# ── Paths ──────────────────────────────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_DIR = os.path.join(BASE_DIR, "models")

CORN_DISEASE_MODEL_PATH = os.path.join(MODEL_DIR, "Corn_Disease_Master_Expert.h5")
CORN_VALIDATOR_MODEL_PATH = os.path.join(MODEL_DIR, "Corn_VS_Invalid.h5")

# ── Image Settings ─────────────────────────────────────────────────────
IMAGE_SIZE = (224, 224)

# ── Validator Labels ───────────────────────────────────────────────────
# The validator model classifies images as either a valid corn image or invalid
VALIDATOR_LABELS = ["Corn", "Invalid"]

# ── Disease Labels ─────────────────────────────────────────────────────
CORN_DISEASE_LABELS = ["Common Rust", "Gray Leaf Spot", "Healthy", "Northern Leaf Blight"]

# ── Treatment Recommendations ──────────────────────────────────────────
TREATMENTS = {
    "Common Rust": (
        "Apply fungicides containing mancozeb or pyraclostrobin at early infection. "
        "Plant resistant hybrids. Rotate crops and remove crop debris."
    ),
    "Gray Leaf Spot": (
        "Use fungicides like azoxystrobin or propiconazole. "
        "Practice crop rotation with non-host crops. Improve air circulation by adjusting plant spacing."
    ),
    "Northern Leaf Blight": (
        "Apply foliar fungicides such as propiconazole or mancozeb. "
        "Use resistant varieties and practice crop rotation."
    ),
    "Healthy": (
        "No disease detected. Continue regular crop monitoring, balanced fertilization, "
        "and good agricultural practices to maintain plant health."
    ),
}
