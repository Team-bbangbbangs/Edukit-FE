import { getVerifyEmail } from '../../domains/auth/mocks/get-verify-email';
import { patchResetPassword } from '../../domains/auth/mocks/patch-reset-password';
import { postLogin } from '../../domains/auth/mocks/post-login';
import { postLogout } from '../../domains/auth/mocks/post-logout';
import { postSendEmail } from '../../domains/auth/mocks/post-send-email';
import { postVerifyEmail } from '../../domains/auth/mocks/post-verify-email';
import { reissue } from '../../domains/auth/mocks/reissue';
import { signup } from '../../domains/auth/mocks/signup';
import { deleteAdminNotice } from '../../domains/notice/mocks/delete-admin-notice';
import { getNoticeDetail } from '../../domains/notice/mocks/get-notice-detail';
import { getNoticeList } from '../../domains/notice/mocks/get-notice-list';
import { patchAdminNotice } from '../../domains/notice/mocks/patch-admin-notice';
import { postAdminNotice } from '../../domains/notice/mocks/post-admin-notice';
import { getCheckValidNickname } from '../../domains/profile/mocks/get-check-valid-nickname';
import { getProfile } from '../../domains/profile/mocks/get-profile';
import { patchAfterLoginPassword } from '../../domains/profile/mocks/patch-after-login-password';
import { patchEmail } from '../../domains/profile/mocks/patch-email';
import { patchProfile } from '../../domains/profile/mocks/patch-profile';
import { createRecordDetail } from '../../domains/record/mocks/create-record-detail';
import { createRecords } from '../../domains/record/mocks/create-records';
import { deleteRecordDetail } from '../../domains/record/mocks/delete-record-detail';
import { getRecords } from '../../domains/record/mocks/get-records';
import { getStudentsName } from '../../domains/record/mocks/get-students-name';
import { getSummaryRecordDetail } from '../../domains/record/mocks/get-summary-record-detail';
import { patchRecordDetail } from '../../domains/record/mocks/patch-record-detail';
import { postPrompt } from '../../domains/record/mocks/post-prompt';
import { postSummaryRecordDetail } from '../../domains/record/mocks/post-summary-record-detail';

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
