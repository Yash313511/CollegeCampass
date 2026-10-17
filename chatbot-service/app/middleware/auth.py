"""
Service token authentication middleware.
"""

import logging
from fastapi import Request
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware

from app.config import settings

logger = logging.getLogger(__name__)

# Paths that don't require authentication
PUBLIC_PATHS = {"/", "/health", "/docs", "/openapi.json", "/redoc"}


class ServiceAuthMiddleware(BaseHTTPMiddleware):
    """
    Validates the service token on protected endpoints.
    Requests must include: Authorization: Bearer <service_token>
    """

    async def dispatch(self, request: Request, call_next):
        # Allow public paths and OPTIONS (CORS preflight)
        if request.url.path in PUBLIC_PATHS or request.method == "OPTIONS":
            return await call_next(request)

        # Validate Authorization header
        auth_header = request.headers.get("authorization", "")
        if not auth_header.startswith("Bearer "):
            return JSONResponse(
                status_code=401,
                content={"detail": "Missing or invalid Authorization header"},
            )

        token = auth_header[7:]  # Strip "Bearer "
        if token != settings.service_token:
            client_host = request.client.host if request.client else "unknown"
            logger.warning(f"Invalid service token from {client_host}")
            return JSONResponse(
                status_code=403,
                content={"detail": "Invalid service token"},
            )

        return await call_next(request)

