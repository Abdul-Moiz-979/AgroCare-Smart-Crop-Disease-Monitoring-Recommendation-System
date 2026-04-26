"""
AgroCare Backend — Health Router
GET /api/health → server and model status
"""

from fastapi import APIRouter

from app.schemas import HealthResponse
from app.services.model_service import get_models_status

router = APIRouter(prefix="/api", tags=["Health"])


@router.get("/health", response_model=HealthResponse)
async def health_check():
    """Return server status and loaded models."""
    return HealthResponse(
        status="healthy",
        models_loaded=get_models_status(),
    )
