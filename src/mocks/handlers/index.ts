import { authHandler } from './auth-handler';
import { getBehaviorRecord } from './get-behavior-record';
import { getCareerRecord } from './get-career-record';
import { getClubRecord } from './get-club-record';
import { getFreeRecord } from './get-free-record';
import { getNoticeDetail } from './get-notice-detail';
import { getNoticeList } from './get-notice-list';
import { getSubjectRecord } from './get-subject-record';

export const handlers = [
  ...authHandler,
  ...getSubjectRecord,
  ...getBehaviorRecord,
  ...getCareerRecord,
  ...getFreeRecord,
  ...getClubRecord,
  ...getNoticeList,
  ...getNoticeDetail,
];
