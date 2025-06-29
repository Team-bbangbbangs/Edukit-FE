import { useContext } from 'react';

import { AuthContext } from '@/contexts/auth/auth-context';

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === null) {
    throw new Error('useAuth는 AuthProvider내부에 선언되어야 합니다.');
  }

  return context;
};
