interface MswTokenDataType {
  type: string;
  expiresAt: number;
  isAdmin: boolean;
}

export function checkAccessToken(authHeader: string | null): {
  isValid: boolean;
  isExpired: boolean;
  tokenData?: MswTokenDataType;
} {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { isValid: false, isExpired: false };
  }

  const token = authHeader.replace('Bearer ', '');

  const tokenParts = token.split('.');

  if (tokenParts.length !== 2) {
    return { isValid: false, isExpired: false };
  }

  const [tokenType, expiresAtStr] = tokenParts;
  const expiresAt = parseInt(expiresAtStr);

  if (isNaN(expiresAt)) {
    return { isValid: false, isExpired: false };
  }

  const now = Date.now();
  const isExpired = now > expiresAt;

  return {
    isValid: true,
    isExpired,
    tokenData: {
      type: tokenType,
      expiresAt,
      isAdmin: tokenType.includes('admin'),
    },
  };
}
