const breakerState = new Map<string, { failureCount: number; openUntil: number }>();

type LogLevel = 'info' | 'warn' | 'error';

type ErrorCategory = 'TimeoutError' | 'QuotaError' | 'ValidationError' | 'UnknownError';

/**
 * Structured log helper to keep server action telemetry consistent with the FastAPI service.
 */
export function logStructured(level: LogLevel, message: string, meta: Record<string, unknown> = {}) {
  const payload = {
    level: level.toUpperCase(),
    message,
    time: new Date().toISOString(),
    ...meta,
  };

  const serialized = JSON.stringify(payload);
  if (level === 'info') {
    console.log(serialized);
  } else if (level === 'warn') {
    console.warn(serialized);
  } else {
    console.error(serialized);
  }
}

/**
 * Error raised when the circuit breaker is open to prevent repeated calls into a failing dependency.
 */
export class CircuitOpenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CircuitOpenError';
  }
}

/**
 * Classifies common error shapes so the UI can tailor messages and logging can label failure causes.
 */
export function classifyError(error: unknown): { type: ErrorCategory; message: string } {
  if (error instanceof CircuitOpenError) {
    return { type: 'TimeoutError', message: error.message };
  }

  if (error instanceof Error) {
    const normalized = `${error.name} ${error.message}`.toLowerCase();
    const code = (error as { code?: string | number | undefined }).code;

    if (normalized.includes('timeout') || code === 'ETIMEDOUT') {
      return { type: 'TimeoutError', message: error.message };
    }

    if (normalized.includes('quota') || normalized.includes('rate limit') || code === 429) {
      return { type: 'QuotaError', message: error.message };
    }

    if (normalized.includes('invalid') || normalized.includes('validation') || code === 400) {
      return { type: 'ValidationError', message: error.message };
    }

    return { type: 'UnknownError', message: error.message };
  }

  if (typeof error === 'string') {
    const normalized = error.toLowerCase();
    if (normalized.includes('timeout')) {
      return { type: 'TimeoutError', message: error };
    }
    if (normalized.includes('quota') || normalized.includes('rate limit')) {
      return { type: 'QuotaError', message: error };
    }
    if (normalized.includes('invalid') || normalized.includes('validation')) {
      return { type: 'ValidationError', message: error };
    }
  }

  return { type: 'UnknownError', message: typeof error === 'string' ? error : 'Unknown error' };
}

/**
 * Executes a task with retry and circuit-breaker semantics to shield downstream services from repeated failures.
 */
export async function runWithResilience<T>(
  key: string,
  task: () => Promise<T>,
  options: { maxRetries?: number; failureThreshold?: number; cooldownMs?: number } = {}
): Promise<T> {
  const { maxRetries = 2, failureThreshold = 3, cooldownMs = 30_000 } = options;
  const state = breakerState.get(key) ?? { failureCount: 0, openUntil: 0 };
  breakerState.set(key, state);

  if (state.openUntil > Date.now()) {
    throw new CircuitOpenError(`Circuit for ${key} is temporarily open due to repeated failures.`);
  }

  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = await task();
      state.failureCount = 0;
      state.openUntil = 0;
      return result;
    } catch (error) {
      lastError = error;
      state.failureCount += 1;

      const classification = classifyError(error);
      logStructured('error', 'Resilient task failed', {
        key,
        attempt,
        classification: classification.type,
        message: classification.message,
      });

      const isTransient = classification.type === 'TimeoutError' || classification.type === 'QuotaError';
      if (state.failureCount >= failureThreshold && isTransient) {
        state.openUntil = Date.now() + cooldownMs;
        logStructured('warn', 'Circuit opened for task', { key, cooldownMs, failureCount: state.failureCount });
      }

      if (attempt === maxRetries || !isTransient) {
        break;
      }

      await wait(Math.pow(2, attempt) * 200);
    }
  }

  if (lastError instanceof Error) {
    throw lastError;
  }

  throw new Error('Unknown failure while executing resilient task.');
}

/**
 * Promise-based timeout helper for retry backoff delays.
 */
function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
