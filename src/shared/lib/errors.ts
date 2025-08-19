export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class TokenExpiredError extends Error {
  constructor(
    public code: string,
    message: string,
  ) {
    super(message);
    this.name = 'TokenExpiredError';
  }
}

export const isUnauthorizedError = (error: unknown): boolean => {
  return (
    error instanceof ApiError &&
    (error.code === 'EDMT-4010104' ||
      error.code === 'EDMT-4010107' ||
      error.code === 'EDMT-4010101')
  );
};

export const isNotFoundError = (error: unknown): boolean => {
  return error instanceof ApiError && error.code === 'EDMT-4040201';
};

export const isNotPermissionError = (error: unknown): boolean => {
  return error instanceof ApiError && error.code === 'EDMT-4030101';
};

export const isBusinessError = (error: unknown): boolean => {
  if (!(error instanceof ApiError)) return false;

  const businessErrorCodes = [
    'A-40906', // 이미 등록된 회원입니다
    'M-40004', // 입력하신 닉네임은 유효하지 않습니다
    'M-40005', // 입력하신 닉네임은 중복된 닉네임입니다
  ];

  return businessErrorCodes.includes(error.code);
};
