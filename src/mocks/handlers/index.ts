import { getProfile } from './auth/get-profile';
import { getVerifyEmail } from './auth/get-verify-email';
import { patchResetPassword } from './auth/patch-reset-password';
import { postLogin } from './auth/post-login';
import { postLogout } from './auth/post-logout';
import { postSendEmail } from './auth/post-send-email';
import { postVerifyEmail } from './auth/post-verify-email';
import { reissue } from './auth/reissue';
import { signup } from './auth/signup';
import { getNoticeDetail } from './notice/get-notice-detail';
import { getNoticeList } from './notice/get-notice-list';
import { postAdminNotice } from './notice/post-admin-notice';
import { createRecordDetail } from './student-manage/create-record-detail';
import { createRecords } from './student-manage/create-records';
import { deleteRecordDetail } from './student-manage/delete-record-detail';
import { getRecords } from './student-manage/get-records';
import { patchRecordDetail } from './student-manage/patch-record-detail';
import { getStudentsName } from './write-record/get-students-name';
import { getSummaryRecordDetail } from './write-record/get-summary-record-detail';
import { postPrompt } from './write-record/post-prompt';
import { postSummaryRecordDetail } from './write-record/post-summary-record-detail';

export const handlers = [
  ...postLogin,
  ...getRecords,
  ...getNoticeList,
  ...getNoticeDetail,
  ...createRecords,
  ...patchRecordDetail,
  ...deleteRecordDetail,
  ...createRecordDetail,
  ...signup,
  ...getVerifyEmail,
  ...getStudentsName,
  ...postSummaryRecordDetail,
  ...getSummaryRecordDetail,
  ...postPrompt,
  ...getProfile,
  ...postLogout,
  ...reissue,
  ...postSendEmail,
  ...postVerifyEmail,
  ...patchResetPassword,
  ...postAdminNotice,
];
