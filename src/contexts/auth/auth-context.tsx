import { createContext } from 'react';

export interface AuthContextProps {
  accessToken: string | null;
  isAdmin: boolean | null;
  setAuthData: (token: string | null, isAdmin?: boolean | null) => void;
}

export const AuthContext = createContext<AuthContextProps | null>(null);
