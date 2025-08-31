import type { RecordType } from '@/domains/record/types/record';

export const RECORD_TYPE: { value: RecordType; label: string }[] = [
  { value: 'SUBJECT', label: '세특' },
  { value: 'BEHAVIOR', label: '행발' },
  { value: 'CAREER', label: '창체-진로' },
  { value: 'FREE', label: '창체-자율' },
  { value: 'CLUB', label: '창체-동아리' },
];
