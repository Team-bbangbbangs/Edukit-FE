import type { RecordType } from '@/domains/record/types/record';

export const RECORD_TYPE: { value: RecordType; label: string }[] = [
  { value: 'subject', label: '세특' },
  { value: 'behavior', label: '행발' },
  { value: 'career', label: '창체-진로' },
  { value: 'free', label: '창체-자율' },
  { value: 'club', label: '창체-동아리' },
];

export const RECORD_TYPE_TITLES: Record<RecordType, string> = {
  subject: '세부능력 및 특기사항',
  behavior: '행동특성 및 종합의견',
  career: '창의적 체험활동 - 진로',
  free: '창의적 체험활동 - 자율',
  club: '창의적 체험활동 - 동아리',
};
