export type NoticeTagType = '공지' | '이벤트';

export type NoticeCategoryType = 'announcement' | 'event';

export interface NoticeListRequest {
  category?: NoticeCategoryType;
  page?: number;
}

export interface Notice {
  noticeId: number;
  category: NoticeTagType;
  title: string;
  createdAt: string;
}

export interface NoticeListResponse {
  totalPages: number;
  notices: Notice[];
}

export interface DetailNoticeResponse extends Notice {
  content: string;
}

export interface AdminNoticeBody {
  category: string;
  title: string;
  content: string;
}

export interface EditAdminNoticeRequest extends AdminNoticeBody {
  noticeId: number;
}
