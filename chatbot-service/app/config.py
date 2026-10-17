"""
Configuration settings loaded from environment variables.
"""

from pydantic_settings import BaseSettings
from typing import Literal


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # ─── LLM Provider ────────────────────────────────────────────
    llm_provider: Literal["google", "openai", "ollama"] = "google"
    llm_api_key: str = ""
    llm_model: str = "gemini-2.0-flash"

    # ─── Embedding (for future RAG) ──────────────────────────────
    embedding_provider: str = "google"
    embedding_model: str = "text-embedding-004"

    # ─── Service Authentication ──────────────────────────────────
    service_token: str = "change-me-to-a-random-secret"

    # ─── Server ──────────────────────────────────────────────────
    host: str = "0.0.0.0"
    port: int = 8000
    log_level: str = "info"

    # ─── Rate Limiting ───────────────────────────────────────────
    rate_limit_per_minute: int = 20

    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
        "extra": "ignore",
    }

    @property
    def llm_configured(self) -> bool:
        """Check if LLM provider credentials are properly configured."""
        if self.llm_provider == "ollama":
            return True  # Ollama doesn't need API key
        return bool(self.llm_api_key and self.llm_api_key != "your-api-key-here")


settings = Settings()
