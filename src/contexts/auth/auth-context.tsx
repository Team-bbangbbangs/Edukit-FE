import { createContext } from 'react';

interface AuthContextProps {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
}

export const AuthContext = createContext<AuthContextProps | null>(null);
