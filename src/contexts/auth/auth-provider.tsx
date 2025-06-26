'use client';

import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';

import { reissue } from '@/services/auth/reissue';

import { AuthContext } from './auth-context';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const res = await reissue();

        if (res) {
          setAccessToken(res.accessToken);
          setIsAdmin(res.isAdmin);
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        setAccessToken(null);
      }
    };

    initializeAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, isAdmin, setIsAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};
