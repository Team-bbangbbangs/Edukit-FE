export type NoticeTagType = '공지' | '이벤트';

export interface NoticeListRequest {
  categoryId?: '2' | '3';
  page?: string;
}

export interface Notice {
  noticeId: string;
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
  categoryId: number;
  title: string;
  content: string;
}

export interface EditAdminNoticeRequest extends AdminNoticeBody {
  id: string;
}
