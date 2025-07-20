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
    return { isValid: false, isNotVerified: true, isExpired: false };
  }

  const token = authHeader.replace('Bearer ', '');

  const tokenParts = token.split('.');

  if (tokenParts.length !== 2) {
    return { isValid: false, isNotVerified: true, isExpired: false };
  }

  const [tokenType, expiresAtStr] = tokenParts;
  const expiresAt = parseInt(expiresAtStr);

  if (isNaN(expiresAt)) {
    return { isValid: false, isNotVerified: true, isExpired: false };
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
