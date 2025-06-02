export type NoticeTagType = '공지' | '이벤트';

export type NoticeType = {
  id: string;
  tag: NoticeTagType;
  title: string;
  createdAt: Date;
};

export type NoticeResponse = {
  NoticeList: NoticeType[];
  maxPage: number;
};
