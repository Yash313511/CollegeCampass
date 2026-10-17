"""
Recommendation engine for scoring and ranking colleges.
Uses hard filters + configurable weighted scoring.
"""

import logging
from typing import Optional

from app.models.requests import CollegeContext, CapCollegeContext
from app.models.responses import CollegeCard

logger = logging.getLogger(__name__)


# ─── Scoring Weights ─────────────────────────────────────────────

DEFAULT_WEIGHTS = {
    "course_match": 30,
    "location_match": 20,
    "budget_fit": 20,
    "cutoff_fit": 15,
    "rating_quality": 10,
    "placement": 5,
}


def score_college(
    college: CollegeContext,
    *,
    preferred_stream: Optional[str] = None,
    preferred_state: Optional[str] = None,
    preferred_city: Optional[str] = None,
    max_budget: Optional[int] = None,
    weights: Optional[dict] = None,
) -> tuple[int, list[str]]:
    """
    Score a college against user preferences.

    Returns:
        Tuple of (score 0-100, list of match reasons)
    """
    w = weights or DEFAULT_WEIGHTS
    total = 0
    reasons = []

    # 1. Course / Stream match
    if preferred_stream:
        stream_lower = preferred_stream.lower()
        matched_stream = False
        for s in college.streams:
            if stream_lower in s.lower() or s.lower() in stream_lower:
                matched_stream = True
                break
        if not matched_stream:
            for course in college.courses:
                course_name = course.get("name", "").lower()
                if stream_lower in course_name or course_name in stream_lower:
                    matched_stream = True
                    break

        if matched_stream:
            total += w["course_match"]
            reasons.append(f"Offers {preferred_stream}")
        else:
            total += w["course_match"] * 0.2
    else:
        total += w["course_match"] * 0.5  # Neutral if no preference

    # 2. Location match
    if preferred_state or preferred_city:
        loc_score = 0.3
        if preferred_city and college.city.lower() == preferred_city.lower():
            loc_score = 1.0
            reasons.append(f"Located in {college.city}")
        elif preferred_state and college.state.lower() == preferred_state.lower():
            loc_score = 0.8
            reasons.append(f"In preferred state ({college.state})")
        else:
            reasons.append(f"Located in {college.city}, {college.state}")
        total += w["location_match"] * loc_score
    else:
        total += w["location_match"] * 0.5

    # 3. Budget fit
    if max_budget and max_budget > 0:
        if college.feesMax <= max_budget:
            total += w["budget_fit"]
            reasons.append(f"Within budget (₹{college.feesMax:,}/yr)")
        elif college.feesMin <= max_budget:
            total += w["budget_fit"] * 0.7
            reasons.append(f"Some programs within budget")
        else:
            total += w["budget_fit"] * 0.1
    else:
        total += w["budget_fit"] * 0.5

    # 4. Rating / Quality
    rating_norm = min(1.0, college.rating / 5.0)
    total += w["rating_quality"] * rating_norm
    if college.rating >= 4.0:
        reasons.append(f"Highly rated ({college.rating}/5)")
    if college.accreditation:
        reasons.append(f"Accredited: {college.accreditation}")

    # 5. Placement
    if college.avgPackage:
        pkg_norm = min(1.0, college.avgPackage / 15.0)  # 15 LPA = max
        total += w["placement"] * pkg_norm
        reasons.append(f"Avg package: ₹{college.avgPackage} LPA")
    else:
        total += w["placement"] * 0.3

    score = min(99, max(10, int(total)))
    return score, reasons


def rank_colleges(
    colleges: list[CollegeContext],
    *,
    preferred_stream: Optional[str] = None,
    preferred_state: Optional[str] = None,
    preferred_city: Optional[str] = None,
    max_budget: Optional[int] = None,
    limit: int = 10,
) -> list[CollegeCard]:
    """
    Rank colleges by preference match and return as CollegeCards.
    """
    scored = []
    for college in colleges:
        score, reasons = score_college(
            college,
            preferred_stream=preferred_stream,
            preferred_state=preferred_state,
            preferred_city=preferred_city,
            max_budget=max_budget,
        )
        scored.append((college, score, reasons))

    # Sort by score descending
    scored.sort(key=lambda x: x[1], reverse=True)

    # Convert to CollegeCards
    cards = []
    for college, score, reasons in scored[:limit]:
        cards.append(CollegeCard(
            id=college.id,
            name=college.name,
            slug=college.slug,
            city=college.city,
            state=college.state,
            type=college.type,
            rating=college.rating,
            feesMin=college.feesMin,
            feesMax=college.feesMax,
            avgPackage=college.avgPackage,
            placementRate=college.placementRate,
            accreditation=college.accreditation,
            matchReason=" • ".join(reasons[:3]),
            matchScore=score,
            streams=college.streams,
        ))

    return cards


def score_cap_college(
    college: CapCollegeContext,
    *,
    percentile: Optional[float] = None,
    preferred_course: Optional[str] = None,
    category: str = "GOPEN",
    max_budget: Optional[int] = None,
) -> tuple[int, list[str], Optional[float]]:
    """
    Score a CAP college based on MHT-CET percentile and preferences.

    Returns:
        Tuple of (score 0-100, reasons, applicable cutoff percentile)
    """
    reasons = []
    total = 0.0
    applicable_cutoff = None

    # Find matching course cutoff
    for course in college.courses:
        course_name = course.get("courseName", "")
        if preferred_course and preferred_course.lower() not in course_name.lower():
            continue

        cutoffs = course.get("cutoffs", [])
        for cutoff in cutoffs:
            if cutoff.get("category") == category:
                hu_perc = cutoff.get("homeUniversityPercentile")
                if hu_perc is not None:
                    applicable_cutoff = hu_perc
                    break
        if applicable_cutoff is not None:
            reasons.append(f"{course_name}")
            break

    # Cutoff fit (40 points)
    if percentile is not None and applicable_cutoff is not None:
        margin = percentile - applicable_cutoff
        if margin >= 2:
            total += 40
            reasons.append("Safe admission chance")
        elif margin >= 0:
            total += 30
            reasons.append("Target admission chance")
        elif margin >= -3:
            total += 15
            reasons.append("Dream admission chance")
        else:
            total += 5
            reasons.append("Reach admission chance")
    elif applicable_cutoff is not None:
        total += 20  # Has cutoff data but no percentile given

    # Budget fit (20 points)
    if max_budget:
        if college.feesAnnual <= max_budget:
            total += 20
            reasons.append(f"₹{college.feesAnnual:,}/yr")
        else:
            total += 5
    else:
        total += 10

    # Quality (20 points)
    rating_norm = min(1.0, college.rating / 5.0)
    total += 20 * rating_norm

    # Placement (20 points)
    if college.avgPackage:
        pkg_norm = min(1.0, college.avgPackage / 15.0)
        total += 20 * pkg_norm
        reasons.append(f"Avg: ₹{college.avgPackage} LPA")

    score = min(99, max(10, int(total)))
    return score, reasons, applicable_cutoff
