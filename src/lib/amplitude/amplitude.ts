import { init, track, identify, Identify } from '@amplitude/analytics-browser';

let isInitialized = false;

export const initAmplitude = () => {
  if (isInitialized) return;

  const apiKey = process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY;
  if (!apiKey) return;

  init(apiKey, {
    defaultTracking: false,
  });
  isInitialized = true;
};

export const trackEvent = (eventName: string, properties?: object) => {
  if (!isInitialized) return;
  track(eventName, properties);
};

export const setUserInfo = (properties: object) => {
  if (!isInitialized) return;
  const identifyEvent = new Identify();
  Object.entries(properties).forEach(([key, value]) => {
    identifyEvent.set(key, value);
  });
  identify(identifyEvent);
};
