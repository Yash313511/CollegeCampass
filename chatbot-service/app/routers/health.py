"""
Health check router.
"""

from fastapi import APIRouter
from app.models.responses import HealthResponse
from app.config import settings

router = APIRouter()


@router.get("/health", response_model=HealthResponse, tags=["Health"])
async def health_check():
    """Service health check endpoint."""
    return HealthResponse(
        status="ok",
        version="1.0.0",
        llm_configured=settings.llm_configured,
    )
