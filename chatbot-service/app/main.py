"""
CollegeCompass AI Chatbot Service.
FastAPI application entrypoint.
"""

import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from app.config import settings
from app.middleware.auth import ServiceAuthMiddleware
from app.middleware.rate_limit import limiter
from app.routers import health, chat

# Configure logging
logging.basicConfig(
    level=getattr(logging, settings.log_level.upper(), logging.INFO),
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("collegecompass-chatbot")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan management."""
    logger.info("Starting CollegeCompass Chatbot Service...")
    logger.info(f"LLM Provider: {settings.llm_provider} (Configured: {settings.llm_configured})")
    logger.info(f"Model: {settings.llm_model}")
    yield
    logger.info("Shutting down CollegeCompass Chatbot Service...")


app = FastAPI(
    title="CollegeCompass AI Chatbot Service",
    description="Intelligent college discovery, counselling, and recommendation backend for CollegeCompass.",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# Set limiter state
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS Middleware
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://college-campass.vercel.app",
    "*",  # Adjust in production
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Service Authentication Middleware (protects /api/*)
app.add_middleware(ServiceAuthMiddleware)

# Include Routers
app.include_router(health.router)
app.include_router(chat.router)


@app.get("/", tags=["Root"])
async def root():
    """Service status and quick info."""
    return {
        "service": "CollegeCompass AI Chatbot",
        "version": "1.0.0",
        "status": "healthy",
        "docs": "/docs",
        "health": "/health",
    }
