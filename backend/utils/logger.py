"""Structured logging utilities shared by the FastAPI services."""
from __future__ import annotations

import asyncio
import json
import logging
import time
from functools import wraps
from typing import Any, Awaitable, Callable, Optional, Tuple, Type, TypeVar, Union

STANDARD_ATTRS = {
    'name',
    'msg',
    'args',
    'levelname',
    'levelno',
    'pathname',
    'filename',
    'module',
    'exc_info',
    'exc_text',
    'stack_info',
    'lineno',
    'funcName',
    'created',
    'msecs',
    'relativeCreated',
    'thread',
    'threadName',
    'processName',
    'process',
}


class JsonFormatter(logging.Formatter):
    """Serialize log records as JSON for consistent ingestion downstream."""

    def format(self, record: logging.LogRecord) -> str:  # noqa: D401 - required override
        payload = {
            'timestamp': self.formatTime(record, self.datefmt),
            'level': record.levelname,
            'logger': record.name,
            'message': record.getMessage(),
        }

        if record.exc_info:
            payload['exception'] = self.formatException(record.exc_info)

        for key, value in record.__dict__.items():
            if key not in STANDARD_ATTRS:
                try:
                    json.dumps({key: value})
                    payload[key] = value
                except TypeError:
                    payload[key] = repr(value)

        return json.dumps(payload, ensure_ascii=False)


def get_logger(name: str) -> logging.Logger:
    """Configure and return a module-level logger with JSON formatting."""
    logger = logging.getLogger(name)
    if not logger.handlers:
        handler = logging.StreamHandler()
        handler.setFormatter(JsonFormatter())
        logger.addHandler(handler)
        logger.setLevel(logging.INFO)
    return logger


F = TypeVar('F', bound=Callable[..., Any])
AsyncCallable = Callable[..., Awaitable[Any]]


def retry(
    *,
    max_attempts: int = 3,
    exceptions: Tuple[Type[BaseException], ...] = (TimeoutError,),
    backoff_seconds: float = 0.5,
) -> Callable[[Union[F, AsyncCallable]], Union[F, AsyncCallable]]:
    """Retry decorator that supports sync and async callables for transient errors."""

    def decorator(func: Union[F, AsyncCallable]) -> Union[F, AsyncCallable]:
        if asyncio.iscoroutinefunction(func):

            @wraps(func)
            async def async_wrapper(*args: Any, **kwargs: Any) -> Any:
                attempt = 0
                while True:
                    try:
                        return await func(*args, **kwargs)
                    except exceptions:
                        attempt += 1
                        if attempt >= max_attempts:
                            raise
                        await asyncio.sleep(backoff_seconds)

            return async_wrapper  # type: ignore[return-value]

        @wraps(func)
        def sync_wrapper(*args: Any, **kwargs: Any) -> Any:
            attempt = 0
            while True:
                try:
                    return func(*args, **kwargs)
                except exceptions:
                    attempt += 1
                    if attempt >= max_attempts:
                        raise
                    time.sleep(backoff_seconds)

        return sync_wrapper  # type: ignore[return-value]

    return decorator


class CircuitBreaker:
    """Simple in-memory circuit breaker to avoid hammering unstable dependencies."""

    def __init__(self, failure_threshold: int = 5, recovery_time_seconds: float = 60.0) -> None:
        self.failure_threshold = failure_threshold
        self.recovery_time_seconds = recovery_time_seconds
        self._failure_count = 0
        self._last_failure: Optional[float] = None

    def allow_request(self) -> bool:
        """Return True if downstream calls should be attempted."""
        if self._failure_count < self.failure_threshold:
            return True

        if self._last_failure is None:
            return True

        if (time.monotonic() - self._last_failure) >= self.recovery_time_seconds:
            self.reset()
            return True

        return False

    def record_failure(self) -> None:
        """Record a downstream failure to eventually open the circuit."""
        self._failure_count += 1
        self._last_failure = time.monotonic()

    def record_success(self) -> None:
        """Reset counters after a successful call."""
        self.reset()

    def reset(self) -> None:
        """Manually reset the breaker state."""
        self._failure_count = 0
        self._last_failure = None


class QuotaError(RuntimeError):
    """Raised when an upstream service indicates rate or quota exhaustion."""


__all__ = ['CircuitBreaker', 'JsonFormatter', 'QuotaError', 'get_logger', 'retry']
