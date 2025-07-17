'use client';

import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';

import { setAmplitudeUserFromAccessToken } from '@/lib/amplitude/amplitude';
import { setAuthContext } from '@/lib/api';
import type { AuthResponse } from '@/types/api/auth';
import type { ApiResponseWithData } from '@/types/api/response';

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
      try {
        const isMSWEnabled = process.env.NEXT_PUBLIC_API_MOCKING === 'enabled';
        const baseURL = isMSWEnabled
          ? '/api/v1/auth/reissue'
          : `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/reissue`;

        const response = await fetch(baseURL, {
          method: 'PATCH',
          credentials: 'include',
        });

        if (response.ok) {
          const json: ApiResponseWithData<AuthResponse> = await response.json();
          if (json.data?.accessToken) {
            setAuthData(json.data.accessToken, json.data.isAdmin);
            setAuthContext({
              accessToken: json.data.accessToken,
              isAdmin: json.data.isAdmin,
              setAuthData,
            });
          } else {
            setAuthData(null, null);
          }
        } else {
          setAuthData(null, null);
        }
      } catch {
        setAuthData(null, null);
      } finally {
        setIsReady(true);
      }
    };

    initializeAuth();
  }, []);

  if (!isReady) return null;

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};
