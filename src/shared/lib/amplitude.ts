import { init, track, setUserId, identify, Identify } from '@amplitude/analytics-browser';
import { jwtDecode } from 'jwt-decode';

import type { RecordType } from '@/domains/record/types/record';

interface UserInfo {
  accessToken: string;
  signupData?: {
    school: string;
    subject: string;
  };
}

export const getKoreaFormattedTimeStamp = (): string => {
  const now = new Date();

  const kstString = now.toLocaleString('en-US', { timeZone: 'Asia/Seoul' });
  const kstDate = new Date(kstString);

  const yyyy = kstDate.getFullYear();
  const mm = String(kstDate.getMonth() + 1).padStart(2, '0');
  const dd = String(kstDate.getDate()).padStart(2, '0');
  const hh = String(kstDate.getHours()).padStart(2, '0');
  const min = String(kstDate.getMinutes()).padStart(2, '0');
  const ss = String(kstDate.getSeconds()).padStart(2, '0');

  return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
};

class AmplitudeManager {
  private accessToken: string | null = null;

  setAccessToken(token: string | null) {
    this.accessToken = token;
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  getUserIdFromToken(): string | null {
    if (!this.accessToken) return null;

    try {
      const decoded = jwtDecode<{ sub: string }>(this.accessToken);
      return decoded.sub;
    } catch {
      return null;
    }
  }
}

const amplitudeManager = new AmplitudeManager();

export const initAmplitude = () => {
  const apiKey = process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY;
  if (!apiKey) return;

  init(apiKey);
};

export const setAmplitudeAccessToken = (token: string | null) => {
  amplitudeManager.setAccessToken(token);
};

export const trackEvent = (eventName: string, properties?: object) => {
  let eventProperties = { ...properties };

  const userId = amplitudeManager.getUserIdFromToken();
  if (userId) {
    eventProperties = {
      user_id: userId,
      ...eventProperties,
    };
  }

  track(eventName, eventProperties);
};

export const setAmplitudeUserFromAccessToken = (user: UserInfo) => {
  try {
    amplitudeManager.setAccessToken(user.accessToken);

    const decoded = jwtDecode<{ sub: string }>(user.accessToken);
    const userId = decoded.sub;

    if (!userId) return;

    setUserId(userId);

    const identifyEvent = new Identify();

    if (user.signupData) {
      identifyEvent.set('join_date', getKoreaFormattedTimeStamp());
      identifyEvent.set('school_type', user.signupData.school === 'middle' ? '중학교' : '고등학교');
      identifyEvent.set('teach_subject', user.signupData.subject);
      ['subject', 'behavior', 'career', 'free', 'club'].forEach((type) => {
        identifyEvent.set(`total_student_${type}`, 0);
      });
    }

    identify(identifyEvent);
  } catch (e) {
    console.error('엑세스 토큰 파싱 실패 : ', e);
  }
};

export const increaseTotalStudent = (
  recordType: RecordType,
  incrementBy: number,
  eventName: string,
) => {
  try {
    if (!recordType) return;

    const userId = amplitudeManager.getUserIdFromToken();
    if (userId) {
      setUserId(userId);
    }

    const identifyEvent = new Identify();
    identifyEvent.add(`total_student_${recordType}`, incrementBy);
    identify(identifyEvent);

    const eventProperties = {
      total_student: incrementBy,
      ...(userId && { user_id: userId }),
    };

    track(eventName, eventProperties);
  } catch (e) {
    console.error('total_student 증가 실패 :', e);
  }
};

export const clearAmplitudeAccessToken = () => {
  amplitudeManager.setAccessToken(null);
};
