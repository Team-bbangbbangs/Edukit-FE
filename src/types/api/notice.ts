export type NoticeTagType = '공지' | '이벤트';

export type DetailNoticeType = {
  id: string;
  tag: NoticeTagType;
  title: string;
  content: string;
  createdAt: string;
};

export type NoticeType = {
  id: string;
  tag: NoticeTagType;
  title: string;
  createdAt: string;
};

export type NoticeResponse = {
  NoticeList: NoticeType[];
  maxPage: number;
};
