interface MswTokenDataType {
  type: string;
  expiresAt: number;
  isAdmin: boolean;
}

export function checkAccessToken(authHeader: string | null): {
  isValid: boolean;
  isExpired: boolean;
  isNotVerified: boolean;
  tokenData?: MswTokenDataType;
} {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { isValid: false, isNotVerified: false, isExpired: false };
  }

  const [tokenType, expiresAtStr] = authHeader.replace('Bearer ', '').split('.');
  const expiresAt = parseInt(expiresAtStr);

  if (isNaN(expiresAt)) {
    return { isValid: false, isNotVerified: false, isExpired: false };
  }

  const now = Date.now();
  const isExpired = now > expiresAt;
  const isNotVerified = tokenType === 'email-not-verified-user-access-token';

  return {
    isValid: true,
    isNotVerified,
    isExpired,
    tokenData: {
      type: tokenType,
      expiresAt,
      isAdmin: tokenType.includes('admin'),
    },
  };
}
