"""
LLM provider abstraction layer.
Supports Google Gemini, OpenAI, and Ollama backends.
"""

import logging
from abc import ABC, abstractmethod
from typing import Optional

from app.config import settings

logger = logging.getLogger(__name__)


class LLMProvider(ABC):
    """Abstract base class for LLM providers."""

    @abstractmethod
    async def generate(
        self,
        system_prompt: str,
        user_message: str,
        temperature: float = 0.3,
        max_tokens: int = 2048,
    ) -> str:
        """Generate a response from the LLM."""
        ...


class GoogleGeminiProvider(LLMProvider):
    """Google Gemini API provider."""

    def __init__(self, api_key: str, model: str = "gemini-2.0-flash"):
        from google import genai
        self._client = genai.Client(api_key=api_key)
        self._model = model

    async def generate(
        self,
        system_prompt: str,
        user_message: str,
        temperature: float = 0.3,
        max_tokens: int = 2048,
    ) -> str:
        from google.genai import types

        try:
            response = self._client.models.generate_content(
                model=self._model,
                contents=user_message,
                config=types.GenerateContentConfig(
                    system_instruction=system_prompt,
                    temperature=temperature,
                    max_output_tokens=max_tokens,
                ),
            )
            if response.text:
                return response.text
            return "I was unable to generate a response. Please try rephrasing your question."
        except Exception as e:
            logger.error(f"Gemini API error: {e}")
            raise LLMError(f"LLM generation failed: {e}") from e


class OpenAIProvider(LLMProvider):
    """OpenAI API provider."""

    def __init__(self, api_key: str, model: str = "gpt-4o-mini"):
        from openai import AsyncOpenAI
        self._client = AsyncOpenAI(api_key=api_key)
        self._model = model

    async def generate(
        self,
        system_prompt: str,
        user_message: str,
        temperature: float = 0.3,
        max_tokens: int = 2048,
    ) -> str:
        try:
            response = await self._client.chat.completions.create(
                model=self._model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_message},
                ],
                temperature=temperature,
                max_tokens=max_tokens,
            )
            content = response.choices[0].message.content
            return content or "I was unable to generate a response."
        except Exception as e:
            logger.error(f"OpenAI API error: {e}")
            raise LLMError(f"LLM generation failed: {e}") from e


class OllamaProvider(LLMProvider):
    """Ollama local model provider."""

    def __init__(self, model: str = "llama3.1"):
        import httpx
        self._client = httpx.AsyncClient(base_url="http://localhost:11434", timeout=120.0)
        self._model = model

    async def generate(
        self,
        system_prompt: str,
        user_message: str,
        temperature: float = 0.3,
        max_tokens: int = 2048,
    ) -> str:
        import httpx

        try:
            response = await self._client.post(
                "/api/generate",
                json={
                    "model": self._model,
                    "system": system_prompt,
                    "prompt": user_message,
                    "stream": False,
                    "options": {
                        "temperature": temperature,
                        "num_predict": max_tokens,
                    },
                },
            )
            response.raise_for_status()
            data = response.json()
            return data.get("response", "I was unable to generate a response.")
        except httpx.HTTPError as e:
            logger.error(f"Ollama API error: {e}")
            raise LLMError(f"Ollama generation failed: {e}") from e


class LLMError(Exception):
    """Custom exception for LLM errors."""
    pass


# ─── Factory ─────────────────────────────────────────────────────


_provider_instance: Optional[LLMProvider] = None


def get_llm_provider() -> Optional[LLMProvider]:
    """
    Get or create the LLM provider singleton.
    Returns None if LLM is not configured.
    """
    global _provider_instance

    if _provider_instance is not None:
        return _provider_instance

    if not settings.llm_configured:
        logger.warning("LLM provider not configured — AI generation disabled")
        return None

    try:
        if settings.llm_provider == "google":
            _provider_instance = GoogleGeminiProvider(
                api_key=settings.llm_api_key,
                model=settings.llm_model,
            )
        elif settings.llm_provider == "openai":
            _provider_instance = OpenAIProvider(
                api_key=settings.llm_api_key,
                model=settings.llm_model,
            )
        elif settings.llm_provider == "ollama":
            _provider_instance = OllamaProvider(model=settings.llm_model)
        else:
            logger.error(f"Unknown LLM provider: {settings.llm_provider}")
            return None

        logger.info(f"LLM provider initialized: {settings.llm_provider} ({settings.llm_model})")
        return _provider_instance

    except Exception as e:
        logger.error(f"Failed to initialize LLM provider: {e}")
        return None
