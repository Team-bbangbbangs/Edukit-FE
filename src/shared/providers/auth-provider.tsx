'use client';

import { type ReactNode, createContext, useContext, useState, useEffect } from 'react';

import { reissue } from '@/domains/auth/apis/reissue';
import { setAmplitudeUserFromAccessToken } from '@/shared/lib/amplitude';
import { tokenStore } from '@/shared/lib/token-store';

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
    const admin = adminStatus !== undefined ? adminStatus : isAdmin;

    setAccessToken(token);
    setIsAdmin(admin);

    tokenStore.setToken(token, admin);

    if (token) {
      setAmplitudeUserFromAccessToken({ accessToken: token });
    }
  };

  useEffect(() => {
    const unsubscribe = tokenStore.subscribe((token, admin) => {
      setAccessToken(token);
      setIsAdmin(admin);
    });

    return unsubscribe;
  }, []);

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

  const contextValue = {
    accessToken,
    isAdmin,
    setAuthData,
  };

  if (!isReady) return null;

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};
