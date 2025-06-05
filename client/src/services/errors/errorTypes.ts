export const ErrorStatus = {
  Unknown: 0,
  BadRequest: 400,
  Unauthorized: 401,
  Forbidden: 403,
  NotFound: 404,
  MethodNotAllowed: 405,
  Conflict: 409,
  UnprocessableEntity: 422,
  TooManyRequests: 429,
  InternalServerError: 500,
  ServiceUnavailable: 503,
  GatewayTimeout: 504,
} as const;

export const ErrorMessages = {
  UnknownError: 'Unknown Error',
  ServerNotFound: "Server won't respond. Please try again later.",
} as const;

//! it just to select the error instead of typing it all
export const FALLBACK_ERROR_MAP: Partial<
  Record<keyof typeof ErrorMessages, FallbackError>
> = {
  ServerNotFound: {
    fbStatus: ErrorStatus.ServiceUnavailable,
    fbMessage: ErrorMessages.ServerNotFound,
  },
};

export type FallbackError = {
  fbStatus: (typeof ErrorStatus)[keyof typeof ErrorStatus];
  fbMessage: (typeof ErrorMessages)[keyof typeof ErrorMessages];
};

export const createFallbackError = (
  fbError: FallbackError | undefined
): FallbackError => ({
  fbStatus: fbError?.fbStatus ?? ErrorStatus.Unknown,
  fbMessage: fbError?.fbMessage ?? ErrorMessages.UnknownError,
});
