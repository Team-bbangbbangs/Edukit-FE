import { createContext } from 'react';

interface AuthContextProps {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  isAdmin: boolean | null;
  setIsAdmin: (isAdmin: boolean | null) => void;
}

export const AuthContext = createContext<AuthContextProps | null>(null);
