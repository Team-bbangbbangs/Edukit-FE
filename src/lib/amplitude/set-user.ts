import { setUserId, identify, Identify } from '@amplitude/analytics-browser';
import { jwtDecode } from 'jwt-decode';

import { getKoreaFormattedTimeStamp } from '@/util/get-korea-formatted-time-stamp';

interface UserInfo {
  accessToken: string;
  isAdmin?: boolean;
}

export const setAmplitudeUserFromAccessToken = (user: UserInfo) => {
  try {
    const decoded = jwtDecode<{ uuid: string }>(user.accessToken);
    const uuid = decoded.uuid;

    if (!uuid) return;

    setUserId(uuid);

    const identifyEvent = new Identify();
    if (user.isAdmin !== undefined) {
      identifyEvent.set('role', user.isAdmin ? 'admin' : 'user');
    }
    identifyEvent.set('login_time', getKoreaFormattedTimeStamp());

    identify(identifyEvent);
  } catch (e) {
    console.error('Failed to decode accessToken for Amplitude:', e);
  }
};
