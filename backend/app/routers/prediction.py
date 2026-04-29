"""
AgroCare Backend — Prediction Router
POST /api/predict  → validate corn image + detect disease
"""

from fastapi import APIRouter, UploadFile, File, HTTPException

from app.schemas import PredictionResponse
from app.services.model_service import (
    preprocess_image,
    validate_corn_image,
    predict_disease,
    get_treatment,
)

router = APIRouter(prefix="/api", tags=["Prediction"])


@router.post("/predict", response_model=PredictionResponse)
async def predict(image: UploadFile = File(...)):
    """Upload a corn leaf image → validate → detect disease."""
    try:
        raw = await image.read()
        validator_img, disease_img = preprocess_image(raw)

        # Step 1: Validate that the image is a valid corn leaf
        is_valid_corn = validate_corn_image(validator_img)
        if not is_valid_corn:
            return PredictionResponse(
                success=False,
                crop="Corn",
                disease="Invalid Image",
                confidence=0.0,
                treatment="Please upload a clear image of a corn leaf. The system could not identify a corn leaf in the current photo.",
            )

        # Step 2: Run disease detection
        disease, confidence = predict_disease(disease_img)
        treatment = get_treatment(disease)

        return PredictionResponse(
            success=True,
            crop="Corn",
            disease=disease,
            confidence=confidence,
            treatment=treatment,
        )
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc))
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))
