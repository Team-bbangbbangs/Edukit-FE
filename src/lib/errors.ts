export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const isUnauthorizedError = (error: unknown): boolean => {
  return error instanceof ApiError && error.code === 'EDMT-4010104';
};

export const isNotFoundError = (error: unknown): boolean => {
  return error instanceof ApiError && error.code === 'EDMT-4040201';
};
