import { HTTP_STATUS } from "@/constants/http";

/**
 * Base application error with HTTP status and optional code.
 * Use subclasses for specific cases so the error handler can send the right status.
 */
export class AppError extends Error {
  readonly statusCode: number;
  readonly code?: string;
  readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
    code?: string,
    isOperational: boolean = true,
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace?.(this, this.constructor);
  }
}

/** 400 - Validation or bad request */
export class ValidationError extends AppError {
  readonly errors?: Record<string, string[]>;
  constructor(
    message: string = "Validation failed",
    errors?: Record<string, string[]>,
    code?: string,
  ) {
    super(message, HTTP_STATUS.BAD_REQUEST, code ?? "VALIDATION_ERROR");
    this.errors = errors;
  }
}

/** 429 - Rate limit exceeded */
export class TooManyRequestsError extends AppError {
  constructor(message: string = "Too many requests", code?: string) {
    super(
      message,
      HTTP_STATUS.TOO_MANY_REQUESTS,
      code ?? "RATE_LIMIT_EXCEEDED",
    );
  }
}

/** 401 - Not authenticated */
export class UnauthorizedError extends AppError {
  constructor(message: string = "Unauthorized", code?: string) {
    super(message, HTTP_STATUS.UNAUTHORIZED, code ?? "UNAUTHORIZED");
  }
}

/** 403 - Authenticated but not allowed */
export class ForbiddenError extends AppError {
  constructor(message: string = "Forbidden", code?: string) {
    super(message, HTTP_STATUS.FORBIDDEN, code ?? "FORBIDDEN");
  }
}

/** 404 - Resource not found */
export class NotFoundError extends AppError {
  constructor(message: string = "Resource not found", code?: string) {
    super(message, HTTP_STATUS.NOT_FOUND, code ?? "NOT_FOUND");
  }
}

/** 409 - Conflict (e.g. duplicate) */
export class ConflictError extends AppError {
  constructor(message: string = "Conflict", code?: string) {
    super(message, HTTP_STATUS.CONFLICT, code ?? "CONFLICT");
  }
}
