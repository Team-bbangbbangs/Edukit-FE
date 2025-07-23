import { useMutation } from '@tanstack/react-query';

import type { AuthResponse, SignupBody } from '@/domains/auth/types/auth';
import { setAmplitudeUserFromAccessToken } from '@/shared/lib/amplitude';
import { api } from '@/shared/lib/api';
import { useAuth } from '@/shared/providers/auth-provider';

export const signup = async (signupData: SignupBody) => {
  return api.post<AuthResponse>('/api/v1/auth/signup', signupData, {
    credentials: 'include',
    skipTokenRefresh: true,
  });
};

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
