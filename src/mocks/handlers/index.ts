import { getVerifyEmail } from './auth/get-verify-email';
import { patchResetPassword } from './auth/patch-reset-password';
import { postLogin } from './auth/post-login';
import { postLogout } from './auth/post-logout';
import { postVerifyEmail } from './auth/post-verify-email';
import { reissue } from './auth/reissue';
import { signup } from './auth/signup';
import { deleteAdminNotice } from './notice/delete-admin-notice';
import { getNoticeDetail } from './notice/get-notice-detail';
import { getNoticeList } from './notice/get-notice-list';
import { patchAdminNotice } from './notice/patch-admin-notice';
import { postAdminNotice } from './notice/post-admin-notice';
import { getCheckValidNickname } from './profile/get-check-valid-nickname';
import { getProfile } from './profile/get-profile';
import { patchAfterLoginPassword } from './profile/patch-after-login-password';
import { patchEmail } from './profile/patch-email';
import { patchProfile } from './profile/patch-profile';
import { postSendEmail } from './profile/post-send-email';
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
  ...getCheckValidNickname,
  ...patchProfile,
  ...patchEmail,
  ...patchAfterLoginPassword,
  ...postLogout,
  ...reissue,
  ...postSendEmail,
  ...postVerifyEmail,
  ...patchResetPassword,
  ...postAdminNotice,
  ...patchAdminNotice,
  ...deleteAdminNotice,
];
