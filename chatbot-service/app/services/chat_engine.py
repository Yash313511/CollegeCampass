
"""
Core chat engine that orchestrates intent detection, data retrieval,
recommendation scoring, and LLM-based response generation.
"""

import logging
from typing import Optional

from app.models.requests import ChatRequest
from app.models.responses import (
    ChatResponse, CollegeCard, ComparisonTable, ComparisonItem,
    SourceCitation,
)
from app.services.intent import (
    classify_intent, extract_location_keywords, extract_stream_keywords,
    extract_budget, extract_percentile,
    INTENT_COLLEGE_SEARCH, INTENT_COLLEGE_INFO, INTENT_COMPARISON,
    INTENT_RECOMMENDATION, INTENT_CUTOFF, INTENT_FEES, INTENT_PLACEMENT,
    INTENT_SCHOLARSHIP, INTENT_ADMISSION, INTENT_CAP_ROUND, INTENT_GENERAL,
)
from app.services.recommendation import rank_colleges, score_cap_college
from app.services.rag import rag_service
from app.services.llm_provider import get_llm_provider, LLMError

logger = logging.getLogger(__name__)

# ─── System Prompt ───────────────────────────────────────────────

SYSTEM_PROMPT = """You are the CollegeCompass AI Assistant — a helpful, accurate college counselor for students in India.

ROLE:
- Help students discover colleges, understand admission processes, compare institutions, and find scholarships.
- You specialize in engineering colleges, MHT-CET/JEE admissions, and Maharashtra CAP rounds.

RULES — FOLLOW STRICTLY:
1. ONLY use the college data provided in the CONTEXT section below. Do NOT use your general knowledge for specific college facts (fees, cutoffs, placements, rankings).
2. If the data you need is not in the context, say "I don't have that specific information in my database" — NEVER fabricate college data.
3. When citing numbers (fees, packages, cutoffs), always mention the source year (e.g., "2024 data").
4. Distinguish between: official requirements, historical cutoff data, and general guidance.
5. NEVER guarantee admission. Use language like "based on historical data" or "you may have a good chance."
6. Keep responses concise (2-4 paragraphs max) and well-structured. Use bullet points for lists.
7. If the user asks something unrelated to colleges/education, politely redirect to college topics.
8. When comparing colleges, be balanced — mention strengths and limitations of each.
9. For MHT-CET percentile questions, clarify the category (GOPEN, GOBC, etc.) and quota (HU/OHU) if the user hasn't specified.
10. Format currency as ₹X,XX,XXX or ₹X.X LPA. Format percentiles with 2 decimal places.

PERSONALITY:
- Friendly, professional, encouraging but realistic.
- Use simple language, avoid jargon unless explaining it.
- Suggest follow-up questions to help students explore further.

RESPONSE FORMAT:
- Start with a direct answer to the question.
- Provide supporting details from the data.
- End with a helpful suggestion or follow-up question.
- Do NOT use markdown headers (##) in your response — keep it conversational."""


def _build_context_prompt(request: ChatRequest, intent: str) -> str:
    """Build the context-enriched prompt for the LLM."""
    parts = [f"USER QUESTION: {request.message}"]

    # Add conversation history
    if request.conversation_history:
        history_text = "\n".join(
            f"{'User' if m.role == 'user' else 'Assistant'}: {m.content}"
            for m in request.conversation_history[-6:]  # Last 6 messages
        )
        parts.append(f"\nCONVERSATION HISTORY:\n{history_text}")

    # Add college data context
    if request.colleges:
        college_lines = []
        for c in request.colleges[:15]:  # Limit context size
            line = f"- {c.name} ({c.city}, {c.state}) | Type: {c.type} | Rating: {c.rating}/5"
            if c.feesMin or c.feesMax:
                line += f" | Fees: ₹{c.feesMin:,}–₹{c.feesMax:,}/yr"
            if c.avgPackage:
                line += f" | Avg Package: ₹{c.avgPackage} LPA"
            if c.placementRate:
                line += f" | Placement Rate: {c.placementRate}%"
            if c.accreditation:
                line += f" | Accreditation: {c.accreditation}"
            if c.streams:
                line += f" | Streams: {', '.join(c.streams[:5])}"
            if c.courses:
                course_names = [cr.get("name", "") for cr in c.courses[:5]]
                line += f" | Courses: {', '.join(course_names)}"
            college_lines.append(line)
        parts.append(f"\nCOLLEGE DATA FROM DATABASE:\n" + "\n".join(college_lines))

    # Add CAP college data
    if request.cap_colleges:
        cap_lines = []
        for c in request.cap_colleges[:10]:
            line = f"- {c.name} (Code: {c.collegeCode}) | Status: {c.status} | Fees: ₹{c.feesAnnual:,}/yr | Rating: {c.rating}/5"
            if c.avgPackage:
                line += f" | Avg: ₹{c.avgPackage} LPA"
            if c.accreditation:
                line += f" | {c.accreditation}"
            for course in c.courses[:5]:
                course_name = course.get("courseName", "")
                cutoffs = course.get("cutoffs", [])
                for cut in cutoffs[:2]:
                    cat = cut.get("category", "")
                    hu_perc = cut.get("homeUniversityPercentile")
                    if hu_perc:
                        line += f"\n  → {course_name} [{cat}]: {hu_perc} percentile (HU, {cut.get('year', '2024')})"
            cap_lines.append(line)
        parts.append(f"\nMHT-CET CAP ROUND DATA:\n" + "\n".join(cap_lines))

    # Add scholarship data
    if request.scholarships:
        schol_lines = []
        for s in request.scholarships[:10]:
            line = f"- {s.name} by {s.provider} | Amount: {s.amount} | Type: {s.type}"
            if s.eligibility:
                line += f" | Eligibility: {s.eligibility}"
            if s.deadline:
                line += f" | Deadline: {s.deadline}"
            schol_lines.append(line)
        parts.append(f"\nSCHOLARSHIP DATA:\n" + "\n".join(schol_lines))

    # Add user preferences
    if request.user_preferences:
        prefs = request.user_preferences
        pref_lines = []
        if prefs.get("state"):
            pref_lines.append(f"Preferred state: {prefs['state']}")
        if prefs.get("city"):
            pref_lines.append(f"Preferred city: {prefs['city']}")
        if prefs.get("stream"):
            pref_lines.append(f"Preferred stream: {prefs['stream']}")
        if prefs.get("budget"):
            pref_lines.append(f"Budget: ₹{prefs['budget']:,}/yr")
        if prefs.get("percentile"):
            pref_lines.append(f"MHT-CET Percentile: {prefs['percentile']}")
        if pref_lines:
            parts.append(f"\nUSER PREFERENCES:\n" + "\n".join(pref_lines))

    parts.append(f"\nDETECTED INTENT: {intent}")

    if not request.colleges and not request.cap_colleges and not request.scholarships:
        parts.append("\nNOTE: No specific college data was found for this query. Provide general guidance and suggest what information the user could provide to get better results.")

    return "\n\n".join(parts)


def _build_comparison_table(colleges: list) -> Optional[ComparisonTable]:
    """Build a comparison table from college data."""
    if len(colleges) < 2:
        return None

    names = [c.name for c in colleges[:3]]
    rows = []

    # Location
    rows.append(ComparisonItem(
        attribute="Location",
        values=[f"{c.city}, {c.state}" for c in colleges[:3]],
    ))

    # Type
    rows.append(ComparisonItem(
        attribute="Type",
        values=[c.type for c in colleges[:3]],
    ))

    # Fees
    rows.append(ComparisonItem(
        attribute="Annual Fees",
        values=[f"₹{c.feesMin:,} – ₹{c.feesMax:,}" if hasattr(c, 'feesMin') else f"₹{getattr(c, 'feesAnnual', 0):,}" for c in colleges[:3]],
    ))

    # Rating
    rows.append(ComparisonItem(
        attribute="Rating",
        values=[f"{c.rating}/5" for c in colleges[:3]],
    ))

    # Placements
    rows.append(ComparisonItem(
        attribute="Avg Package",
        values=[f"₹{c.avgPackage} LPA" if c.avgPackage else "N/A" for c in colleges[:3]],
    ))

    # Accreditation
    rows.append(ComparisonItem(
        attribute="Accreditation",
        values=[c.accreditation or "N/A" for c in colleges[:3]],
    ))

    return ComparisonTable(college_names=names, rows=rows)


def _generate_follow_ups(intent: str, request: ChatRequest) -> list[str]:
    """Generate contextual follow-up questions."""
    follow_ups = {
        INTENT_COLLEGE_SEARCH: [
            "What are the placement statistics for these colleges?",
            "Can you compare the top two options?",
            "What scholarships are available at these colleges?",
        ],
        INTENT_RECOMMENDATION: [
            "What is the fee structure for these colleges?",
            "How do the placements compare?",
            "What are the admission cutoffs?",
        ],
        INTENT_CUTOFF: [
            "Which colleges can I get with this percentile?",
            "What if I apply in a different category?",
            "Show me colleges with lower cutoffs in the same branch",
        ],
        INTENT_CAP_ROUND: [
            "What are the fees for these colleges?",
            "Show me cutoffs for Computer Engineering",
            "Which colleges have the best placements?",
        ],
        INTENT_FEES: [
            "Are there scholarships to offset these costs?",
            "Show me more affordable alternatives",
            "What are the placement returns for this investment?",
        ],
        INTENT_PLACEMENT: [
            "Which companies recruit from these colleges?",
            "What courses have the best placement rates?",
            "Show me colleges with packages above ₹10 LPA",
        ],
        INTENT_SCHOLARSHIP: [
            "Am I eligible for any merit-based scholarships?",
            "What are need-based scholarship options?",
            "Show me TFWS scheme details",
        ],
        INTENT_COMPARISON: [
            "Which one has better placements?",
            "What courses does each college offer?",
            "What are the admission cutoffs for these colleges?",
        ],
        INTENT_GENERAL: [
            "Suggest engineering colleges in Pune",
            "What are the MHT-CET cutoffs for Computer Engineering?",
            "Find colleges within ₹2 lakh annual budget",
            "Compare top engineering colleges",
        ],
    }
    return follow_ups.get(intent, follow_ups[INTENT_GENERAL])[:3]


async def process_chat(request: ChatRequest) -> ChatResponse:
    """
    Main chat processing pipeline.

    1. Classify intent
    2. Extract entities
    3. Score/rank colleges if provided
    4. Generate LLM response with context
    5. Return structured response
    """
    # 1. Classify intent
    intent = classify_intent(request.message, request.detected_intent)
    logger.info(f"Intent: {intent} | Message: {request.message[:80]}...")

    # 2. Extract entities for context enrichment
    locations = extract_location_keywords(request.message)
    stream = extract_stream_keywords(request.message)
    budget = extract_budget(request.message)
    percentile = extract_percentile(request.message)

    # Merge with user preferences
    prefs = request.user_preferences or {}
    if locations.get("state"):
        prefs["state"] = locations["state"]
    if locations.get("city"):
        prefs["city"] = locations["city"]
    if stream:
        prefs["stream"] = stream
    if budget:
        prefs["budget"] = budget
    if percentile:
        prefs["percentile"] = percentile

    # 3. Score and rank colleges
    college_cards: list[CollegeCard] = []
    comparison: Optional[ComparisonTable] = None
    sources: list[SourceCitation] = []

    if intent == INTENT_COMPARISON and (request.colleges or request.cap_colleges):
        data = request.colleges or request.cap_colleges
        comparison = _build_comparison_table(data)
        sources = rag_service.create_college_citations(
            [{"name": c.name} for c in data], "comparison data"
        )
    elif request.colleges:
        college_cards = rank_colleges(
            request.colleges,
            preferred_stream=prefs.get("stream"),
            preferred_state=prefs.get("state"),
            preferred_city=prefs.get("city"),
            max_budget=prefs.get("budget"),
            limit=8,
        )
        sources = rag_service.create_college_citations(
            [{"name": c.name} for c in request.colleges],
            "college records",
        )

    if request.cap_colleges and intent in {INTENT_CUTOFF, INTENT_CAP_ROUND, INTENT_RECOMMENDATION}:
        for cap_col in request.cap_colleges[:8]:
            score, reasons, cutoff = score_cap_college(
                cap_col,
                percentile=prefs.get("percentile"),
                preferred_course=prefs.get("stream"),
                max_budget=prefs.get("budget"),
            )
            college_cards.append(CollegeCard(
                id=cap_col.id,
                name=cap_col.name,
                slug=cap_col.slug,
                city=cap_col.region,
                state="Maharashtra",
                type=cap_col.status,
                rating=cap_col.rating,
                feesMin=cap_col.feesAnnual,
                feesMax=cap_col.feesAnnual,
                avgPackage=cap_col.avgPackage,
                accreditation=cap_col.accreditation,
                matchReason=" • ".join(reasons[:3]),
                matchScore=score,
            ))
        college_cards.sort(key=lambda c: c.matchScore or 0, reverse=True)
        college_cards = college_cards[:8]

        if not sources:
            sources = rag_service.create_college_citations(
                [{"name": c.name} for c in request.cap_colleges],
                "MHT-CET CAP Round data (2024)",
            )

    if request.scholarships:
        sources.append(SourceCitation(
            title="CollegeCompass Scholarship Database",
            source_type="database",
            detail=f"Based on {len(request.scholarships)} scholarship records",
        ))

    # 4. Generate LLM response
    llm = get_llm_provider()
    context_prompt = _build_context_prompt(request, intent)

    if llm:
        try:
            answer = await llm.generate(
                system_prompt=SYSTEM_PROMPT,
                user_message=context_prompt,
                temperature=0.3,
                max_tokens=1500,
            )
            confidence = "high" if (request.colleges or request.cap_colleges or request.scholarships) else "medium"
        except LLMError as e:
            logger.error(f"LLM generation failed: {e}")
            answer = _generate_fallback_response(request, intent, college_cards, prefs)
            confidence = "medium"
    else:
        # No LLM configured — use structured fallback
        answer = _generate_fallback_response(request, intent, college_cards, prefs)
        confidence = "medium"

    # 5. Build response
    follow_ups = _generate_follow_ups(intent, request)

    disclaimer = None
    if intent in {INTENT_CUTOFF, INTENT_CAP_ROUND}:
        disclaimer = "Cutoff data is based on previous years and may vary. Always verify with official DTE/college portals."
    elif intent == INTENT_RECOMMENDATION:
        disclaimer = "Recommendations are based on available data. Always verify with official college websites before applying."

    return ChatResponse(
        answer=answer,
        intent=intent,
        college_cards=college_cards,
        comparison=comparison,
        sources=sources,
        follow_up_questions=follow_ups,
        confidence=confidence,
        data_freshness="2024-25" if (request.colleges or request.cap_colleges) else None,
        disclaimer=disclaimer,
    )


def _generate_fallback_response(
    request: ChatRequest,
    intent: str,
    cards: list[CollegeCard],
    prefs: dict,
) -> str:
    """Generate a structured response without LLM — purely from data."""
    if intent == INTENT_GENERAL and not request.colleges and not request.cap_colleges:
        return (
            "Hello! I'm your CollegeCompass AI assistant. I can help you with:\n\n"
            "• **Finding colleges** — by location, course, fees, or entrance exam\n"
            "• **MHT-CET counselling** — cutoffs, CAP round analysis, preference lists\n"
            "• **Comparing colleges** — side-by-side on fees, placements, ratings\n"
            "• **Admission guidance** — eligibility, cutoff analysis, process info\n"
            "• **Scholarships** — find schemes you may qualify for\n\n"
            "Try asking something like: *\"Suggest engineering colleges in Pune within ₹2 lakh budget\"*"
        )

    parts = []

    if cards:
        if intent in {INTENT_RECOMMENDATION, INTENT_COLLEGE_SEARCH, INTENT_CUTOFF, INTENT_CAP_ROUND}:
            parts.append(f"Based on your query, here are **{len(cards)} matching colleges** from our database:\n")
        for i, card in enumerate(cards[:5], 1):
            line = f"**{i}. {card.name}** ({card.city}, {card.state})"
            details = []
            if card.rating:
                details.append(f"Rating: {card.rating}/5")
            if card.feesMin:
                details.append(f"Fees: ₹{card.feesMin:,}/yr")
            if card.avgPackage:
                details.append(f"Avg Package: ₹{card.avgPackage} LPA")
            if card.matchReason:
                details.append(card.matchReason)
            if details:
                line += f"\n  {' • '.join(details)}"
            parts.append(line)
    elif request.scholarships:
        parts.append(f"I found **{len(request.scholarships)} scholarships** that may be relevant:\n")
        for s in request.scholarships[:5]:
            parts.append(f"• **{s.name}** by {s.provider} — {s.amount}")
            if s.eligibility:
                parts.append(f"  Eligibility: {s.eligibility}")
    else:
        parts.append(
            "I couldn't find specific data for your query in our database. "
            "Could you provide more details? For example:\n"
            "• Which city or state are you interested in?\n"
            "• What course or branch are you looking for?\n"
            "• What is your budget range?\n"
            "• What is your MHT-CET percentile?"
        )

    return "\n".join(parts)
