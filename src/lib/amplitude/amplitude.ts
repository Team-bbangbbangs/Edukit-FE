import { init, track, setUserId, identify, Identify } from '@amplitude/analytics-browser';
import { jwtDecode } from 'jwt-decode';

import { getKoreaFormattedTimeStamp } from '@/util/get-korea-formatted-time-stamp';

interface UserInfo {
  accessToken: string;
  signupData?: {
    school: string;
    subject: string;
  };
}

type RecordType = 'subject' | 'behavior' | 'career' | 'free' | 'club';

export const initAmplitude = () => {
  const apiKey = process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY;
  if (!apiKey) return;

  init(apiKey);
};

export const trackEvent = (eventName: string, accessToken?: string | null, properties?: object) => {
  let eventProperties = { ...properties };

  if (accessToken) {
    try {
      const decoded = jwtDecode<{ sub: string }>(accessToken);
      const userId = decoded.sub;

      if (userId) {
        eventProperties = {
          user_id: userId,
          ...eventProperties,
        };
      }
    } catch (e) {
      console.error('Failed to decode accessToken for event tracking:', e);
    }
  }

  track(eventName, eventProperties);
};

export const setAmplitudeUserFromAccessToken = (user: UserInfo) => {
  try {
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
    console.error('Failed to decode accessToken for Amplitude:', e);
  }
};

export const increaseTotalStudent = (
  recordType: RecordType,
  incrementBy: number,
  accessToken: string | null,
  eventName: string,
) => {
  try {
    if (!recordType) return;

    let userId: string | undefined;

    if (accessToken) {
      try {
        const decoded = jwtDecode<{ sub: string }>(accessToken);
        userId = decoded.sub;
        if (userId) {
          setUserId(userId);
        }
      } catch (e) {
        console.error('Failed to decode accessToken in increaseTotalStudent:', e);
      }
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
    console.error('Failed to increase total_student:', e);
  }
};
