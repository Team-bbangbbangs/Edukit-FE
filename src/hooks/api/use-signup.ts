import { useMutation } from '@tanstack/react-query';

import { useAuth } from '@/contexts/auth/use-auth';
import { setAmplitudeUserFromAccessToken } from '@/lib/amplitude/amplitude';
import { signup } from '@/services/auth/signup';
import type { AuthResponse, SignupTypes } from '@/types/api/auth';

export const useSignup = () => {
  const { setAccessToken, setIsAdmin } = useAuth();

  return useMutation<AuthResponse, Error, SignupTypes>({
    mutationFn: signup,

    onSuccess: (data, variables) => {
      setAccessToken(data.accessToken);
      setIsAdmin(data.isAdmin);

      setAmplitudeUserFromAccessToken({
        accessToken: data.accessToken,
        signupData: {
          school: variables.school,
          subject: variables.subject,
        },
      });
    },

    onError: (error) => {
      alert(error.message);
    },
  });
};
