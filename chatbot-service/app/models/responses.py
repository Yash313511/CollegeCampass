"""
Pydantic response models for the chatbot API.
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime, timezone


class CollegeCard(BaseModel):
    """A college recommendation card to display in the chat UI."""
    id: str
    name: str
    slug: str
    city: str = ""
    state: str = ""
    type: str = ""
    rating: float = 0
    feesMin: int = 0
    feesMax: int = 0
    avgPackage: Optional[float] = None
    placementRate: Optional[int] = None
    accreditation: Optional[str] = None
    matchReason: Optional[str] = None
    matchScore: Optional[int] = None
    streams: list[str] = Field(default_factory=list)


class SourceCitation(BaseModel):
    """A source citation for a factual claim in the response."""
    title: str
    source_type: str = "database"  # database | document | website
    url: Optional[str] = None
    detail: Optional[str] = None
    academic_year: Optional[str] = None


class ComparisonItem(BaseModel):
    """A single attribute row in a comparison table."""
    attribute: str
    values: list[str] = Field(default_factory=list)


class ComparisonTable(BaseModel):
    """Structured comparison data between colleges."""
    college_names: list[str] = Field(default_factory=list)
    rows: list[ComparisonItem] = Field(default_factory=list)


class ChatResponse(BaseModel):
    """Main chat response returned to the Next.js proxy."""
    answer: str = Field(..., description="The main text response")
    intent: str = Field(default="general", description="Detected intent category")

    # Rich content
    college_cards: list[CollegeCard] = Field(
        default_factory=list,
        description="College recommendation cards to display"
    )
    comparison: Optional[ComparisonTable] = Field(
        default=None,
        description="Structured comparison table"
    )
    sources: list[SourceCitation] = Field(
        default_factory=list,
        description="Source citations for factual claims"
    )
    follow_up_questions: list[str] = Field(
        default_factory=list,
        description="Suggested follow-up questions"
    )

    # Metadata
    confidence: str = Field(
        default="medium",
        description="Confidence level: high, medium, low"
    )
    data_freshness: Optional[str] = Field(
        default=None,
        description="Academic year or date of the source data"
    )
    disclaimer: Optional[str] = Field(
        default=None,
        description="Important caveats about the response"
    )

    # Error information
    error: Optional[str] = Field(
        default=None,
        description="Error message if something went wrong"
    )


class HealthResponse(BaseModel):
    """Health check response."""
    status: str = "ok"
    version: str = "1.0.0"
    llm_configured: bool = False
    timestamp: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
