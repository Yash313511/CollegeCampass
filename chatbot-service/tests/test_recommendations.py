import pytest
from app.models.requests import CollegeContext
from app.services.recommendation import rank_colleges, score_college


def test_recommendation_scoring():
    """Test recommendation ranking prioritizes matching city and stream."""
    colleges = [
        CollegeContext(
            id="c1",
            name="College A",
            slug="college-a",
            city="Pune",
            state="Maharashtra",
            type="GOVERNMENT",
            rating=4.5,
            feesMin=100000,
            feesMax=120000,
            avgPackage=8.0,
            placementRate=85,
            streams=["Engineering"],
        ),
        CollegeContext(
            id="c2",
            name="College B",
            slug="college-b",
            city="Delhi",
            state="Delhi",
            type="PRIVATE",
            rating=3.5,
            feesMin=300000,
            feesMax=400000,
            avgPackage=5.0,
            placementRate=70,
            streams=["Management"],
        ),
    ]

    ranked = rank_colleges(
        colleges,
        preferred_stream="Engineering",
        preferred_city="Pune",
        max_budget=200000,
    )

    assert len(ranked) >= 1
    assert ranked[0].name == "College A"
    assert ranked[0].matchScore is not None
    assert ranked[0].matchScore > 50
