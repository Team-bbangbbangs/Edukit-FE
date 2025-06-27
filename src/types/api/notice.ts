export type NoticeTagType = '공지' | '이벤트';

export type DetailNoticeType = {
  noticeId: string;
  category: NoticeTagType;
  title: string;
  content: string;
  createdAt: string;
};

export type NoticeType = {
  noticeId: string;
  category: NoticeTagType;
  title: string;
  createdAt: string;
};

export type NoticeResponse = {
  notices: NoticeType[];
  totalPages: number;
};

export type AdminNotice = {
  categoryId: number;
  title: string;
  content: string;
  accessToken: string | null;
};

export type AdminNoticeRequest = {
  categoryId: number;
  title: string;
  content: string;
};

export type PatchAdminNotice = AdminNotice & {
  id: string;
};

export type PatchAdminNoticeRequest = AdminNoticeRequest & {
  id: string;
};

export type DeleteAdminNotice = {
  id: string;
  accessToken: string | null;
};

export type DeleteAdminNoticeRequest = {
  id: string;
};
