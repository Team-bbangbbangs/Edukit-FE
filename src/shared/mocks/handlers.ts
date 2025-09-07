import { getCheckAuthValidNickname } from '../../domains/auth/mocks/get-check-auth-valid-nickname';
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
import { deleteWithdraw } from '../../domains/profile/mocks/delete-withdraw';
import { getCheckValidNickname } from '../../domains/profile/mocks/get-check-valid-nickname';
import { getProfile } from '../../domains/profile/mocks/get-profile';
import { patchAfterLoginPassword } from '../../domains/profile/mocks/patch-after-login-password';
import { patchEmail } from '../../domains/profile/mocks/patch-email';
import { patchProfile } from '../../domains/profile/mocks/patch-profile';
import { createRecordDetail } from '../../domains/record/mocks/create-record-detail';
import { deleteStudents } from '../../domains/record/mocks/delete-students';
import { getRecordDetail } from '../../domains/record/mocks/get-record-detail';
import { getRecords } from '../../domains/record/mocks/get-records';
import { getStudents } from '../../domains/record/mocks/get-students';
import { getStudentsName } from '../../domains/record/mocks/get-students-name';
import { patchRecordDetail } from '../../domains/record/mocks/patch-record-detail';
import { patchStudents } from '../../domains/record/mocks/patch-students';
import { postPrompt } from '../../domains/record/mocks/post-prompt';
import { postRecordDetail } from '../../domains/record/mocks/post-record-detail';
import { postStudents } from '../../domains/record/mocks/post-students';
import { postUploadExcel } from '../../domains/record/mocks/post-upload-excel';

export const handlers = [
  ...getCheckAuthValidNickname,
  ...postLogin,
  ...getRecords,
  ...getNoticeList,
  ...getNoticeDetail,
  ...patchRecordDetail,
  ...createRecordDetail,
  ...signup,
  ...getVerifyEmail,
  ...getStudentsName,
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
  ...deleteWithdraw,
  ...postUploadExcel,
  ...getStudents,
  ...deleteStudents,
  ...patchStudents,
  ...postStudents,
  ...postRecordDetail,
  ...getRecordDetail,
];
