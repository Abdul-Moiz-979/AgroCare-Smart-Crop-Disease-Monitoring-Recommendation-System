"""
AgroCare Backend — User Profile Router
PUT /api/users/profile → update current user's profile
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app import models, schemas
from app.auth import get_current_user

router = APIRouter(prefix="/api/users", tags=["Users"])


@router.put("/profile", response_model=schemas.UserResponse)
def update_profile(
    data: schemas.UserUpdate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update the authenticated user's profile fields."""
    if data.name is not None:
        current_user.name = data.name
    if data.location is not None:
        current_user.location = data.location
    if data.farm_size is not None:
        current_user.farm_size = data.farm_size

    db.commit()
    db.refresh(current_user)
    return current_user
