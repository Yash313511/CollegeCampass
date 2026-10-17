"""
Pydantic request models for the chatbot API.
"""

from pydantic import BaseModel, Field
from typing import Optional


class ChatMessage(BaseModel):
    """A single message in the conversation history."""
    role: str = Field(..., pattern="^(user|assistant)$", description="Message role")
    content: str = Field(..., min_length=1, max_length=5000, description="Message content")


class CollegeContext(BaseModel):
    """College data passed from the Next.js proxy for grounding."""
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
    highestPackage: Optional[float] = None
    placementRate: Optional[int] = None
    accreditation: Optional[str] = None
    website: Optional[str] = None
    establishedYear: Optional[int] = None
    description: Optional[str] = None
    streams: list[str] = Field(default_factory=list)
    courses: list[dict] = Field(default_factory=list)
    cutoffs: list[dict] = Field(default_factory=list)


class ScholarshipContext(BaseModel):
    """Scholarship data passed from the Next.js proxy."""
    id: str
    name: str
    provider: str
    description: str = ""
    type: str = ""
    level: str = ""
    amount: str = ""
    eligibility: str = ""
    deadline: Optional[str] = None
    applicationLink: Optional[str] = None
    streams: list[str] = Field(default_factory=list)
    categories: list[str] = Field(default_factory=list)


class CapCollegeContext(BaseModel):
    """CAP college data with MHT-CET cutoffs."""
    id: str
    collegeCode: str
    name: str
    slug: str
    status: str = ""
    region: str = ""
    feesAnnual: int = 0
    avgPackage: Optional[float] = None
    highestPackage: Optional[float] = None
    rating: float = 0
    accreditation: Optional[str] = None
    courses: list[dict] = Field(default_factory=list)


class ChatRequest(BaseModel):
    """Main chat request from the Next.js proxy."""
    message: str = Field(..., min_length=1, max_length=2000, description="User message")
    session_id: str = Field(..., min_length=1, max_length=100, description="Session identifier")
    conversation_history: list[ChatMessage] = Field(
        default_factory=list,
        max_length=20,
        description="Recent conversation history for context"
    )

    # Structured data from the Next.js proxy
    colleges: list[CollegeContext] = Field(
        default_factory=list,
        description="Relevant college data fetched by the proxy"
    )
    cap_colleges: list[CapCollegeContext] = Field(
        default_factory=list,
        description="Relevant CAP college data with MHT-CET cutoffs"
    )
    scholarships: list[ScholarshipContext] = Field(
        default_factory=list,
        description="Relevant scholarship data"
    )

    # Detected intent from the proxy (optional — FastAPI will refine)
    detected_intent: Optional[str] = None

    # User preferences extracted from conversation
    user_preferences: Optional[dict] = None
