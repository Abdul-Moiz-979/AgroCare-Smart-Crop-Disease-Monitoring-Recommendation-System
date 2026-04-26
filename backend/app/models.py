"""
AgroCare Backend — SQLAlchemy Database Models
Defines PostgreSQL tables for users and their crop disease predictions.
"""

from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class User(Base):
    """Users table — stores account information and farm details."""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    location = Column(String(255), default="")
    farm_size = Column(String(100), default="")
    primary_crops = Column(ARRAY(String), default=["Corn"])
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationship: one user has many predictions
    predictions = relationship(
        "Prediction",
        back_populates="user",
        cascade="all, delete-orphan",
        order_by="Prediction.created_at.desc()",
    )


class Prediction(Base):
    """Predictions table — stores all crop disease detection results per user."""
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    crop = Column(String(100), nullable=False)
    disease = Column(String(255), nullable=False)
    confidence = Column(Float, default=0.0)
    severity = Column(String(50), default="Medium")
    treatment = Column(Text, default="")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationship back to user
    user = relationship("User", back_populates="predictions")
