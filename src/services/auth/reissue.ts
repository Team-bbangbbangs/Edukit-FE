import type { AuthResponse } from '@/types/api/auth';
import type { ApiResponseWithData } from '@/types/api/response';

export const reissue = async (): Promise<AuthResponse | null> => {
  try {
    const isMSWEnabled = process.env.NEXT_PUBLIC_API_MOCKING === 'enabled';
    const url = isMSWEnabled
      ? '/api/v1/auth/reissue'
      : `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/reissue`;

    const response = await fetch(url, {
      method: 'PATCH',
      credentials: 'include',
    });

    if (!response.ok) {
      return null;
    }

    const json: ApiResponseWithData<AuthResponse> = await response.json();
    return json.data || null;
  } catch {
    return null;
  }
};
