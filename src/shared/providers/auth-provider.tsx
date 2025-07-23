'use client';

import { type ReactNode, createContext, useContext } from 'react';
import { useState, useEffect } from 'react';

import { reissue } from '@/services/auth/reissue';
import { setAmplitudeUserFromAccessToken } from '@/shared/lib/amplitude';
import { setAuthContext } from '@/shared/lib/api';

export interface AuthContextProps {
  accessToken: string | null;
  isAdmin: boolean | null;
  setAuthData: (token: string | null, isAdmin?: boolean | null) => void;
}

export const AuthContext = createContext<AuthContextProps | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === null) {
    throw new Error('useAuth는 AuthProvider내부에 선언되어야 합니다.');
  }

  return context;
};

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
