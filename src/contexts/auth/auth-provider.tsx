'use client';

import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';

import { setAmplitudeUserFromAccessToken } from '@/lib/amplitude/amplitude';
import { reissue } from '@/services/auth/reissue';

import { AuthContext } from './auth-context';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const res = await reissue();

        if (res?.accessToken) {
          setAccessToken(res.accessToken);
          setIsAdmin(res.isAdmin);

          setAmplitudeUserFromAccessToken({
            accessToken: res.accessToken,
          });
        }
      } catch {
        setAccessToken(null);
      } finally {
        setIsReady(true);
      }
    };

    initializeAuth();
  }, []);

  if (!isReady) return null;

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, isAdmin, setIsAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};
