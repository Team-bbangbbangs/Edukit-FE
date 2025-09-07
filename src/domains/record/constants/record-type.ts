import type { RecordType } from '@/domains/record/types/record';

export const RECORD_TYPE: { value: RecordType; label: string }[] = [
  { value: 'subject', label: '세특' },
  { value: 'behavior', label: '행발' },
  { value: 'career', label: '창체-진로' },
  { value: 'free', label: '창체-자율' },
  { value: 'club', label: '창체-동아리' },
];
