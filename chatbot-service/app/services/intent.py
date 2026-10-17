"""
Intent classification for user messages.
Detects what the user is asking about to route data retrieval.
"""

import re
from typing import Optional


# Intent categories
INTENT_COLLEGE_SEARCH = "college_search"
INTENT_COLLEGE_INFO = "college_info"
INTENT_COMPARISON = "comparison"
INTENT_RECOMMENDATION = "recommendation"
INTENT_CUTOFF = "cutoff_info"
INTENT_FEES = "fees_info"
INTENT_PLACEMENT = "placement_info"
INTENT_SCHOLARSHIP = "scholarship"
INTENT_ADMISSION = "admission_process"
INTENT_CAP_ROUND = "cap_round"
INTENT_GENERAL = "general"

# Keyword patterns for rule-based intent detection
_INTENT_PATTERNS: list[tuple[str, list[str]]] = [
    (INTENT_COMPARISON, [
        r"\bcompar", r"\bvs\b", r"\bversus\b", r"\bdifference\s+between\b",
        r"\bbetter\b.*\bor\b", r"\bwhich\s+is\s+better\b",
    ]),
    (INTENT_CUTOFF, [
        r"\bcutoff", r"\bcut[\s-]?off", r"\bclosing\s+rank", r"\blast\s+rank",
        r"\bpercentile\b.*\bcolleg", r"\bcolleg.*\bpercentile\b",
        r"\brank\b.*\badmission", r"\bwhat\s+rank\b", r"\bwhat\s+percentile\b",
        r"\bI\s+scored\b", r"\bmy\s+score\b", r"\bmy\s+percentile\b", r"\bmy\s+rank\b",
    ]),
    (INTENT_CAP_ROUND, [
        r"\bcap\s+round", r"\bmht[\s-]?cet\b", r"\bdte\b", r"\bchoice\s+code\b",
        r"\bpreference\s+list\b", r"\bcap\s+allotment\b", r"\bpune\s+engineering\b",
    ]),
    (INTENT_SCHOLARSHIP, [
        r"\bscholarship", r"\bfinancial\s+aid\b", r"\bfee\s+waiver\b",
        r"\bstipend\b", r"\bfellowship\b", r"\btfws\b",
    ]),
    (INTENT_FEES, [
        r"\bfees?\b", r"\btuition\b", r"\bcost\b", r"\bbudget\b",
        r"\baffordab", r"\bexpensive\b", r"\bcheap", r"\bprice\b",
        r"\bannual\s+fee", r"\bhow\s+much\b",
    ]),
    (INTENT_PLACEMENT, [
        r"\bplacement", r"\bpackage\b", r"\bsalary\b", r"\blpa\b",
        r"\brecruit", r"\bhiring\b", r"\bjob\b", r"\bcompan",
        r"\baverage\s+package\b", r"\bhighest\s+package\b",
    ]),
    (INTENT_RECOMMENDATION, [
        r"\brecommend", r"\bsuggest", r"\bbest\s+college", r"\btop\s+college",
        r"\bwhich\s+college", r"\bshould\s+I\b", r"\bgood\s+college",
        r"\bhelp\s+me\s+(find|choose)", r"\bfind\s+(me\s+)?college",
        r"\bsuitable\b", r"\bexplore\b",
    ]),
    (INTENT_ADMISSION, [
        r"\badmission\s+process", r"\bhow\s+to\s+apply\b", r"\bapplication\b",
        r"\bcounsell?ing\b", r"\beligibilit", r"\brequirement",
        r"\bdocument", r"\bdeadline\b",
    ]),
    (INTENT_COLLEGE_SEARCH, [
        r"\bcolleg\w*\s+in\b", r"\bengineering\s+colleg", r"\bmedical\s+colleg",
        r"\bmanagement\s+colleg", r"\blist\s+of\b", r"\bshow\s+(me\s+)?colleg",
        r"\bfind\s+colleg", r"\bsearch\b", r"\bfilter\b",
        r"\bcolleg\w*\s+(offering|with|that\s+offer)",
    ]),
    (INTENT_COLLEGE_INFO, [
        r"\btell\s+me\s+about\b", r"\binfo(rmation)?\s+(about|on)\b",
        r"\bdetails?\s+(about|of|on)\b", r"\bwhat\s+is\b.*\bcolleg",
        r"\babout\b.*\buniversity\b", r"\baccreditation\b", r"\bnaac\b", r"\bnba\b",
        r"\bestablished\b", r"\baffiliation\b", r"\bhistory\s+of\b",
    ]),
]


def classify_intent(message: str, proxy_hint: Optional[str] = None) -> str:
    """
    Classify the user's message intent using rule-based pattern matching.

    Args:
        message: The user's message text
        proxy_hint: Optional intent hint from the Next.js proxy

    Returns:
        Intent category string
    """
    if proxy_hint and proxy_hint in {
        INTENT_COLLEGE_SEARCH, INTENT_COLLEGE_INFO, INTENT_COMPARISON,
        INTENT_RECOMMENDATION, INTENT_CUTOFF, INTENT_FEES, INTENT_PLACEMENT,
        INTENT_SCHOLARSHIP, INTENT_ADMISSION, INTENT_CAP_ROUND, INTENT_GENERAL,
    }:
        return proxy_hint

    lower_msg = message.lower().strip()

    for intent, patterns in _INTENT_PATTERNS:
        for pattern in patterns:
            if re.search(pattern, lower_msg, re.IGNORECASE):
                return intent

    return INTENT_GENERAL


def extract_location_keywords(message: str) -> dict:
    """Extract location keywords from the message."""
    lower = message.lower()
    result = {}

    # Common Indian states
    states = [
        "maharashtra", "karnataka", "tamil nadu", "delhi", "uttar pradesh",
        "rajasthan", "gujarat", "west bengal", "telangana", "andhra pradesh",
        "kerala", "madhya pradesh", "bihar", "punjab", "haryana", "jharkhand",
        "odisha", "chhattisgarh", "assam", "goa",
    ]
    for state in states:
        if state in lower:
            result["state"] = state.title()
            break

    # Common Indian cities
    cities = [
        "mumbai", "pune", "delhi", "bangalore", "bengaluru", "chennai",
        "hyderabad", "kolkata", "ahmedabad", "jaipur", "lucknow", "nagpur",
        "indore", "bhopal", "chandigarh", "coimbatore", "kochi", "trivandrum",
        "noida", "gurgaon", "gurugram", "thane", "nashik", "aurangabad",
    ]
    for city in cities:
        if city in lower:
            result["city"] = city.title()
            if city == "bengaluru":
                result["city"] = "Bangalore"
            if city == "gurugram":
                result["city"] = "Gurgaon"
            break

    return result


def extract_stream_keywords(message: str) -> Optional[str]:
    """Extract academic stream/course keywords."""
    lower = message.lower()

    stream_map = {
        "engineering": ["engineering", "b.tech", "btech", "b tech"],
        "Computer Science": ["computer science", "cse", "cs ", "computer engineering", "comp eng"],
        "Management": ["management", "mba", "bba", "business"],
        "Medical": ["medical", "mbbs", "bds", "medicine"],
        "Pharmacy": ["pharmacy", "pharma", "b.pharm"],
        "Law": ["law", "llb", "legal"],
        "Architecture": ["architecture", "b.arch"],
        "Arts": ["arts", "humanities", "liberal arts"],
        "Science": ["science", "bsc", "b.sc"],
        "Commerce": ["commerce", "b.com", "bcom"],
    }

    # Check for specific branches first
    branches = [
        "artificial intelligence", "ai ", "ai,", "machine learning", "data science",
        "information technology", "it ", "electronics", "mechanical",
        "civil", "electrical", "chemical", "aerospace", "robotics",
        "computer engineering",
    ]
    for branch in branches:
        if branch in lower:
            return branch.strip().title()

    for stream, keywords in stream_map.items():
        for kw in keywords:
            if kw in lower:
                return stream

    return None


def extract_budget(message: str) -> Optional[int]:
    """Extract annual budget from the message (in INR)."""
    lower = message.lower()

    # Match patterns like "5 lakh", "5L", "5,00,000", "500000", "2.5 lakh"
    lakh_match = re.search(r'(\d+(?:\.\d+)?)\s*(?:lakh|lac|l\b)', lower)
    if lakh_match:
        return int(float(lakh_match.group(1)) * 100000)

    # Match patterns like "50000", "1,00,000"
    amount_match = re.search(r'(?:₹|rs\.?|inr)?\s*(\d{1,2}(?:,?\d{2}){1,3})', lower)
    if amount_match:
        amount = int(amount_match.group(1).replace(",", ""))
        if amount >= 10000:
            return amount

    return None


def extract_percentile(message: str) -> Optional[float]:
    """Extract percentile score from the message."""
    lower = message.lower()

    perc_match = re.search(r'(\d{1,2}(?:\.\d{1,2})?)\s*(?:percentile|%ile|percent)', lower)
    if perc_match:
        val = float(perc_match.group(1))
        if 0 <= val <= 100:
            return val

    # "scored 85" or "got 92"
    score_match = re.search(r'(?:scored?|got)\s+(\d{1,2}(?:\.\d{1,2})?)', lower)
    if score_match:
        val = float(score_match.group(1))
        if 50 <= val <= 100:
            return val

    return None
