import { useMutation } from '@tanstack/react-query';

import type { AuthResponse, SignupBody } from '@/domains/auth/types/auth';
import { signup } from '@/services/auth/signup';
import { setAmplitudeUserFromAccessToken } from '@/shared/lib/amplitude';
import { useAuth } from '@/shared/providers/auth-provider';

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
