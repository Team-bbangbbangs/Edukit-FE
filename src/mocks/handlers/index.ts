import { authHandler } from './auth-handler';
import { createRecordDetail } from './create-record-detail';
import { createRecords } from './create-records';
import { deleteRecordDetail } from './delete-record-detail';
import { getNoticeDetail } from './get-notice-detail';
import { getNoticeList } from './get-notice-list';
import { getRecord } from './get-record';
import { getStudentsName } from './get-students-name';
import { getSummaryRecordDetail } from './get-summary-record-detail';
import { getVerifyEmail } from './get-verify-email';
import { postPrompt } from './post-prompt';
import { postSignup } from './post-signup';
import { postSummaryRecordDetail } from './post-summary-record-detail';
import { putRecordDetail } from './put-record-detail';

export const handlers = [
  ...authHandler,
  ...getRecord,
  ...getNoticeList,
  ...getNoticeDetail,
  ...createRecords,
  ...putRecordDetail,
  ...deleteRecordDetail,
  ...createRecordDetail,
  ...postSignup,
  ...getVerifyEmail,
  ...getStudentsName,
  ...postSummaryRecordDetail,
  ...getSummaryRecordDetail,
  ...postPrompt,
];
