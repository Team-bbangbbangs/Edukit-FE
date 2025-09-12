export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const isUnauthorizedError = (error: unknown): boolean => {
  return (
    error instanceof ApiError &&
    (error.code === 'A-40101' || error.code === 'A-40102' || error.code === 'A-40103')
  );
};

export const isNotPermissionError = (error: unknown): boolean => {
  return error instanceof ApiError && error.code === 'A-40304';
};
