"""
AgroCare Backend — FastAPI Application Entry Point
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import threading

from app.database import engine, Base
from app.routers import prediction, health, auth, users, predictions, translate
from app.services.model_service import load_models


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Create DB tables and start ML model loading in the background."""
    # Create all database tables (if they don't exist yet)
    Base.metadata.create_all(bind=engine)
    print("[OK] Database tables created/verified")

    # Load ML models in background thread
    def _bg_load():
        status = load_models()
        print(f"Background model load status: {status}")
    thread = threading.Thread(target=_bg_load, daemon=True)
    thread.start()
    print("Server started — models loading in background...")
    yield


app = FastAPI(
    title="AgroCare API",
    description="Smart Crop Disease Monitoring & Recommendation System",
    version="1.0.0",
    lifespan=lifespan,
)

# ── CORS ───────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ────────────────────────────────────────────────────────────
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(predictions.router)
app.include_router(prediction.router)
app.include_router(health.router)
app.include_router(translate.router)


@app.get("/")
async def root():
    return {
        "message": "Welcome to AgroCare API",
        "docs": "/docs",
        "health": "/api/health",
    }
