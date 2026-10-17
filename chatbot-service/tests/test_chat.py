import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.config import settings

client = TestClient(app)
AUTH_HEADERS = {"Authorization": f"Bearer {settings.service_token}"}


def test_chat_without_auth():
    """Test chat endpoint rejects requests without Bearer token."""
    response = client.post("/api/v1/chat", json={"message": "hello", "session_id": "test"})
    assert response.status_code == 401


def test_chat_with_invalid_auth():
    """Test chat endpoint rejects invalid Bearer token."""
    response = client.post(
        "/api/v1/chat",
        headers={"Authorization": "Bearer wrong-token"},
        json={"message": "hello", "session_id": "test"},
    )
    assert response.status_code == 403


def test_chat_general_greeting():
    """Test general greeting returns welcome information and fallback."""
    response = client.post(
        "/api/v1/chat",
        headers=AUTH_HEADERS,
        json={
            "message": "Hello, how can you help me?",
            "session_id": "session_123",
            "conversation_history": [],
            "colleges": [],
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert "answer" in data
    assert data["intent"] in ["general", "college_search"]
    assert len(data["follow_up_questions"]) > 0


def test_chat_with_college_context():
    """Test chat returns structured college cards when context is provided."""
    sample_college = {
        "id": "c1",
        "name": "COEP Technological University",
        "slug": "coep-pune",
        "city": "Pune",
        "state": "Maharashtra",
        "type": "GOVERNMENT",
        "rating": 4.8,
        "feesMin": 85000,
        "feesMax": 95000,
        "avgPackage": 11.5,
        "highestPackage": 50.5,
        "placementRate": 92,
        "accreditation": "NAAC A++",
        "streams": ["Engineering"],
        "courses": [{"name": "Computer Engineering"}],
        "cutoffs": [],
    }

    response = client.post(
        "/api/v1/chat",
        headers=AUTH_HEADERS,
        json={
            "message": "Tell me about engineering colleges in Pune",
            "session_id": "session_123",
            "colleges": [sample_college],
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert len(data["college_cards"]) >= 1
    assert data["college_cards"][0]["name"] == "COEP Technological University"
    assert len(data["sources"]) >= 1
