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

export type PostAdminNotice = {
  categoryId: number;
  title: string;
  content: string;
  accessToken: string | null;
};

export type PostAdminNoticeRequest = {
  categoryId: number;
  title: string;
  content: string;
};
