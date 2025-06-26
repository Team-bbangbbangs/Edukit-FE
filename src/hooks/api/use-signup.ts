import { useMutation } from '@tanstack/react-query';

import { useAuth } from '@/contexts/auth/use-auth';
import { signup } from '@/services/auth/signup';
import type { AuthResponse, SignupTypes } from '@/types/api/auth';

export const useSignup = () => {
  const { setAccessToken, setIsAdmin } = useAuth();

  return useMutation<AuthResponse, Error, SignupTypes>({
    mutationFn: signup,
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
      setIsAdmin(data.isAdmin);
    },
    onError: (error) => {
      alert(error.message);
    },
  });
};
