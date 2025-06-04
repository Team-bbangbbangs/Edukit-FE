import { authHandler } from './auth-handler';
import { getNoticeDetail } from './get-notice-detail';
import { getNoticeList } from './get-notice-list';
import { getRecord } from './get-record';

export const handlers = [...authHandler, ...getRecord, ...getNoticeList, ...getNoticeDetail];
