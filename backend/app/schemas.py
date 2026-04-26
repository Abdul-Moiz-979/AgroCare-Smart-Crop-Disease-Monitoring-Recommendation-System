"""
AgroCare Backend — Pydantic Response Schemas
"""

from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


# ─── Auth ────────────────────────────────────────────────────────

class UserSignup(BaseModel):
    name: str
    email: str
    password: str
    location: Optional[str] = ""
    farm_size: Optional[str] = ""


class UserLogin(BaseModel):
    email: str
    password: str


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    location: str
    farm_size: str
    primary_crops: List[str]
    created_at: datetime

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class UserUpdate(BaseModel):
    name: Optional[str] = None
    location: Optional[str] = None
    farm_size: Optional[str] = None


# ─── Predictions ─────────────────────────────────────────────────

class PredictionResponse(BaseModel):
    success: bool
    crop: str
    disease: str
    confidence: float
    treatment: str


class PredictionCreate(BaseModel):
    crop: str
    disease: str
    confidence: float = 0.0
    severity: str = "Medium"
    treatment: str = ""


class PredictionRecord(BaseModel):
    id: int
    crop: str
    disease: str
    confidence: float
    severity: str
    treatment: str
    created_at: datetime

    class Config:
        from_attributes = True


# ─── Health ──────────────────────────────────────────────────────

class HealthResponse(BaseModel):
    status: str
    models_loaded: dict
