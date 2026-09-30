export type ErrorCode =
  | "VALIDATION"
  | "UNAUTHENTICATED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "NO_CREDITS"
  | "RATE_LIMITED"
  | "GENERATION_FAILED"
  | "PAYMENT"
  | "UNAVAILABLE"
  | "INTERNAL";

/** An error whose message is safe to show to end users. Anything else becomes a generic 500. */
export class AppError extends Error {
  constructor(
    public status: number,
    public code: ErrorCode,
    message: string,
    public details?: unknown,
  ) {
    super(message);
  }
}

export const err = {
  validation: (msg: string, details?: unknown) => new AppError(400, "VALIDATION", msg, details),
  unauthenticated: (msg = "Please log in to continue.") => new AppError(401, "UNAUTHENTICATED", msg),
  forbidden: (msg = "You don't have access to that.") => new AppError(403, "FORBIDDEN", msg),
  notFound: (msg = "Not found.") => new AppError(404, "NOT_FOUND", msg),
  conflict: (msg: string) => new AppError(409, "CONFLICT", msg),
  noCredits: () => new AppError(402, "NO_CREDITS", "No credits remaining. Upgrade your plan to continue."),
  rateLimited: (retryAfter: number) =>
    new AppError(429, "RATE_LIMITED", "Too many requests. Please wait a moment and try again.", { retryAfter }),
};
