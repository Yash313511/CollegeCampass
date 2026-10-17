# CollegeCompass AI Chatbot Service

FastAPI-powered intelligent assistant backend for CollegeCompass. Provides intent detection, college search & recommendation scoring, RAG support, comparison data generation, and LLM orchestration (Google Gemini, OpenAI, Ollama).

## Features

- **Multi-Provider LLM Integration**: Google Gemini, OpenAI, or local Ollama.
- **Data-Grounded Responses**: Uses context provided by the Next.js proxy from Postgres/Prisma.
- **Recommendation & Scoring**: Multi-factor scoring across percentiles, budgets, locations, streams, and NIRF/ratings.
- **Structured Outputs**: Direct generation of college cards, comparison matrices, and follow-up prompts.
- **Fail-Safe Operation**: If no LLM API key is configured or the LLM provider fails, responds using rich structured database records.
- **Security**: Service token authentication and per-client rate limiting.

## Setup & Running Locally

### 1. Requirements
- Python 3.11+
- Virtual environment (recommended)

### 2. Install Dependencies
```bash
cd chatbot-service
python3 -m venv venv
source venv/bin/activate
pip install -e .
```

### 3. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Set your `LLM_API_KEY` (Gemini or OpenAI) and `SERVICE_TOKEN`.

### 4. Run the Development Server
```bash
uvicorn app.main:app --reload --port 8000
```

### 5. Running with Docker
```bash
docker build -t collegecompass-chatbot .
docker run -p 8000:8000 --env-file .env collegecompass-chatbot
```

## API Endpoints

- `GET /health` — Health check and LLM configuration status
- `POST /api/v1/chat` — Main conversation pipeline
- `POST /api/v1/recommendations` — Direct college ranking
- `POST /api/v1/compare` — Compare colleges side-by-side
- `GET /docs` — Interactive OpenAPI Swagger UI
