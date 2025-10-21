"""FastAPI application providing secure file uploads for StudyBuddy."""
from __future__ import annotations

import io
from typing import Any

from fastapi import FastAPI, File, HTTPException, Request, UploadFile, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from utils.logger import CircuitBreaker, QuotaError, get_logger, retry

app = FastAPI(title='Study Assistant API', version='1.0.0')
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

logger = get_logger(__name__)
breaker = CircuitBreaker(failure_threshold=3, recovery_time_seconds=30)

MAX_FILE_SIZE = 5 * 1024 * 1024
ALLOWED_CONTENT_TYPES = {'text/plain', 'application/pdf'}


class UploadResponse(BaseModel):
    """Response schema returning the extracted document text."""

    name: str
    content: str


class UploadValidationError(ValueError):
    """Raised when the incoming upload fails validation checks."""


@app.exception_handler(RequestValidationError)
async def request_validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    """Emit structured logs for FastAPI validation errors."""
    logger.warning(
        'request_validation_error',
        extra={'error_type': 'ValidationError', 'errors': exc.errors()},
    )
    return JSONResponse(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, content={'detail': exc.errors()})


@retry(max_attempts=2, exceptions=(TimeoutError, QuotaError))
async def extract_text_from_upload(file: UploadFile, raw_bytes: bytes) -> str:
    """Convert an uploaded file into plain text while handling PDF parsing errors."""
    if file.content_type == 'application/pdf':
        try:
            from PyPDF2 import PdfReader
        except Exception as error:  # pragma: no cover - import guard
            raise UploadValidationError('Không thể xử lý tệp PDF đã tải lên.') from error

        reader = PdfReader(io.BytesIO(raw_bytes))
        extracted = []
        for page in reader.pages:
            text = page.extract_text() or ''
            extracted.append(text)

        combined = '\n'.join(extracted).strip()
        if not combined:
            raise UploadValidationError('Không thể trích xuất văn bản từ PDF.')
        return combined

    try:
        return raw_bytes.decode('utf-8')
    except UnicodeDecodeError as error:
        raise UploadValidationError('Không thể giải mã nội dung văn bản.') from error


@app.post('/upload', response_model=UploadResponse)
async def upload_file(file: UploadFile = File(...)) -> UploadResponse:
    """Validate and persist uploads while shielding the service with retries and a circuit breaker."""
    if not breaker.allow_request():
        logger.warning('upload_blocked', extra={'error_type': 'CircuitOpen'})
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail='Dịch vụ đang tạm ngắt, vui lòng thử lại sau.')

    filename = file.filename or 'unknown'

    try:
        if file.content_type not in ALLOWED_CONTENT_TYPES:
            raise UploadValidationError('Chỉ hỗ trợ tệp văn bản (.txt) hoặc PDF (.pdf).')

        raw_bytes = await file.read()
        if len(raw_bytes) > MAX_FILE_SIZE:
            raise UploadValidationError('Dung lượng tệp vượt quá 5MB.')

        content = await extract_text_from_upload(file, raw_bytes)
        breaker.record_success()
        logger.info('upload_success', extra={'filename': filename, 'size': len(raw_bytes)})
        return UploadResponse(name=filename, content=content)
    except UploadValidationError as error:
        breaker.record_success()
        logger.warning(
            'upload_validation_error',
            extra={'error_type': 'ValidationError', 'filename': filename, 'detail': str(error)},
        )
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(error)) from error
    except TimeoutError as error:
        breaker.record_failure()
        logger.error('upload_timeout', extra={'error_type': 'TimeoutError', 'filename': filename})
        raise HTTPException(status_code=status.HTTP_504_GATEWAY_TIMEOUT, detail='Xử lý tệp quá thời gian cho phép.') from error
    except QuotaError as error:
        breaker.record_failure()
        logger.error('upload_quota', extra={'error_type': 'QuotaError', 'filename': filename})
        raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail='Dịch vụ đang quá tải, thử lại sau ít phút.') from error
    except Exception as error:  # pragma: no cover - defensive catch
        breaker.record_failure()
        logger.exception('upload_unexpected', extra={'error_type': 'UnexpectedError', 'filename': filename})
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail='Máy chủ gặp sự cố bất ngờ.') from error


@app.get('/healthz')
async def healthcheck() -> dict[str, Any]:
    """Lightweight health endpoint for container orchestrators."""
    return {'status': 'ok'}
