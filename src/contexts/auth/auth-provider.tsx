'use client';

import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';

import { setAmplitudeUserFromAccessToken } from '@/lib/amplitude/amplitude';
import { setAuthContext } from '@/lib/api';
import { reissue } from '@/services/auth/reissue';

import { AuthContext } from './auth-context';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isReady, setIsReady] = useState(false);

  const setAuthData = (token: string | null, adminStatus?: boolean | null) => {
    setAccessToken(token);

    if (adminStatus !== undefined) {
      setIsAdmin(adminStatus);
    }

    if (token) {
      setAmplitudeUserFromAccessToken({ accessToken: token });
    }
  };

  const contextValue = {
    accessToken,
    isAdmin,
    setAuthData,
  };

  useEffect(() => {
    setAuthContext(contextValue);
  }, [accessToken, isAdmin]);

  useEffect(() => {
    const initializeAuth = async () => {
      const authData = await reissue();
      if (authData) {
        setAuthData(authData.accessToken, authData.isAdmin);
      }
      setIsReady(true);
    };

    initializeAuth();
  }, []);

  if (!isReady) return null;

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};
