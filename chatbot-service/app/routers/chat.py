"""
Chat router for the CollegeCompass AI Assistant.
Provides endpoints for chat processing, recommendation scoring, and comparison.
"""

import logging
from typing import Optional
from fastapi import APIRouter, HTTPException
from app.models.requests import ChatRequest, CollegeContext
from app.models.responses import (
    ChatResponse, CollegeCard, ComparisonTable,
)
from app.services.chat_engine import process_chat, _build_comparison_table
from app.services.recommendation import rank_colleges

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1", tags=["Chat"])


@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """
    Main chat endpoint.
    Orchestrates intent classification, context enrichment,
    scoring/ranking, and LLM-based response generation.
    """
    try:
        response = await process_chat(request)
        return response
    except Exception as e:
        logger.exception(f"Error processing chat request: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Chat processing failed: {str(e)}"
        )


@router.post("/recommendations", response_model=list[CollegeCard])
async def recommendations_endpoint(
    colleges: list[CollegeContext],
    stream: Optional[str] = None,
    state: Optional[str] = None,
    city: Optional[str] = None,
    budget: Optional[int] = None,
    limit: int = 10,
):
    """
    Direct college recommendation scoring endpoint.
    Filters and ranks colleges with explainable match reasons.
    """
    try:
        return rank_colleges(
            colleges,
            preferred_stream=stream,
            preferred_state=state,
            preferred_city=city,
            max_budget=budget,
            limit=limit,
        )
    except Exception as e:
        logger.exception(f"Error ranking colleges: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/compare", response_model=ComparisonTable)
async def compare_endpoint(colleges: list[CollegeContext]):
    """
    Builds a structured comparison table for 2-3 colleges.
    """
    if not colleges:
        raise HTTPException(status_code=400, detail="At least one college required")
    try:
        return _build_comparison_table(colleges)
    except Exception as e:
        logger.exception(f"Error comparing colleges: {e}")
        raise HTTPException(status_code=500, detail=str(e))
