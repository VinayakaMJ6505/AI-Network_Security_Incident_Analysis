"""
Main FastAPI Application Entrypoint.
AI-Powered Network Security Incident Analysis System Backend.
"""
import os
import sys
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Ensure backend directory is in python sys.path
backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("network_security_backend")

from routes import (
    analyze_router,
    log_upload_router,
    incidents_router,
    dashboard_router,
    explain_router
)
from services import ml_service, db_service

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing AI-Powered Network Security Incident Analysis Backend...")
    logger.info(f"ML Model loaded: {ml_service.is_loaded} (Classes: {len(ml_service.classes)})")
    logger.info(f"Database status: {'MongoDB connected' if db_service.is_connected else 'In-memory / JSON cache mode'}")
    yield
    logger.info("Shutting down backend services.")

app = FastAPI(
    title="AI-Powered Network Security Incident Analysis System API",
    description=(
        "Backend API for detecting, classifying, analyzing, and explaining network security "
        "incidents using Machine Learning, NLP Log Analysis, Risk Assessment, and Generative AI."
    ),
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middleware for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins including localhost:3000
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API Routers under /api
app.include_router(analyze_router, prefix="/api")
app.include_router(log_upload_router, prefix="/api")
app.include_router(incidents_router, prefix="/api")
app.include_router(dashboard_router, prefix="/api")
app.include_router(explain_router, prefix="/api")

@app.get("/", tags=["Health"])
async def root():
    return {
        "system": "AI-Powered Network Security Incident Analysis System",
        "status": "online",
        "documentation": "/docs",
        "version": "1.0.0"
    }

@app.get("/api/health", tags=["Health"])
async def health_check():
    return {
        "status": "healthy",
        "ml_model_loaded": ml_service.is_loaded,
        "classes_supported": ml_service.classes,
        "database_connected": db_service.is_connected,
        "storage_mode": "MongoDB" if db_service.is_connected else "Local In-Memory Cache"
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "127.0.0.1")
    logger.info(f"Starting server at http://{host}:{port}")
    uvicorn.run("main:app", host=host, port=port, reload=True)
