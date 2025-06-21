import { createRecordDetail } from './create-record-detail';
import { createRecords } from './create-records';
import { deleteRecordDetail } from './delete-record-detail';
import { getNoticeDetail } from './get-notice-detail';
import { getNoticeList } from './get-notice-list';
import { getProfile } from './get-profile';
import { getRecords } from './get-records';
import { getStudentsName } from './get-students-name';
import { getSummaryRecordDetail } from './get-summary-record-detail';
import { getVerifyEmail } from './get-verify-email';
import { patchRecordDetail } from './patch-record-detail';
import { patchReissue } from './patch-reissue';
import { postLogin } from './post-login';
import { postLogout } from './post-logout';
import { postPrompt } from './post-prompt';
import { postSendEmail } from './post-send-email';
import { postSignup } from './post-signup';
import { postSummaryRecordDetail } from './post-summary-record-detail';

export const handlers = [
  ...postLogin,
  ...getRecords,
  ...getNoticeList,
  ...getNoticeDetail,
  ...createRecords,
  ...patchRecordDetail,
  ...deleteRecordDetail,
  ...createRecordDetail,
  ...postSignup,
  ...getVerifyEmail,
  ...getStudentsName,
  ...postSummaryRecordDetail,
  ...getSummaryRecordDetail,
  ...postPrompt,
  ...getProfile,
  ...postLogout,
  ...patchReissue,
  ...postSendEmail,
];
