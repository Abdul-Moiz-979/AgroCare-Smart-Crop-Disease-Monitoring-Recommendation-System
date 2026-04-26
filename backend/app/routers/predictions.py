"""
AgroCare Backend — Predictions History Router
GET    /api/predictions/       → list user's predictions
POST   /api/predictions/       → save a new prediction
DELETE /api/predictions/{id}   → delete one prediction
DELETE /api/predictions/       → clear all predictions
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app import models, schemas
from app.auth import get_current_user

router = APIRouter(prefix="/api/predictions", tags=["Predictions History"])


@router.get("/", response_model=List[schemas.PredictionRecord])
def get_predictions(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get all predictions for the authenticated user, newest first."""
    return (
        db.query(models.Prediction)
        .filter(models.Prediction.user_id == current_user.id)
        .order_by(models.Prediction.created_at.desc())
        .all()
    )


@router.post("/", response_model=schemas.PredictionRecord, status_code=201)
def save_prediction(
    prediction: schemas.PredictionCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Save a new prediction record for the authenticated user."""
    record = models.Prediction(
        user_id=current_user.id,
        crop=prediction.crop,
        disease=prediction.disease,
        confidence=prediction.confidence,
        severity=prediction.severity,
        treatment=prediction.treatment,
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


@router.delete("/{prediction_id}")
def delete_prediction(
    prediction_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete a single prediction record belonging to the authenticated user."""
    record = (
        db.query(models.Prediction)
        .filter(
            models.Prediction.id == prediction_id,
            models.Prediction.user_id == current_user.id,
        )
        .first()
    )
    if not record:
        raise HTTPException(status_code=404, detail="Prediction not found")

    db.delete(record)
    db.commit()
    return {"success": True, "message": "Prediction deleted"}


@router.delete("/")
def clear_all_predictions(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete all prediction records for the authenticated user."""
    db.query(models.Prediction).filter(
        models.Prediction.user_id == current_user.id
    ).delete()
    db.commit()
    return {"success": True, "message": "All predictions cleared"}
