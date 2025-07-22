import { useMutation } from '@tanstack/react-query';

import { useAuth } from '@/contexts/auth/use-auth';
import { setAmplitudeUserFromAccessToken } from '@/lib/amplitude/amplitude';
import { signup } from '@/services/auth/signup';
import type { AuthResponse, SignupBody } from '@/types/auth/auth';

export const useSignup = () => {
  const { setAuthData } = useAuth();

  return useMutation<AuthResponse, Error, SignupBody>({
    mutationFn: signup,

    onSuccess: (data, variables) => {
      setAuthData(data.accessToken, data.isAdmin);

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
