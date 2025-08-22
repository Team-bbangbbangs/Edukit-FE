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
  noticeFileKeys: string[];
}

export interface AdminNoticeBody {
  category: NoticeCategoryType;
  title: string;
  content: string;
  fileKeys?: string[];
}

export interface EditAdminNoticeRequest extends AdminNoticeBody {
  noticeId: number;
  fileKeys?: string[];
}

export interface ImageUploadData {
  uploadPresignedUrl: string;
  tmpFileUrl: string;
  fileUrl: string;
  fileKey: string;
}

export interface PresignedUrlResponse {
  images: ImageUploadData[];
}

export interface UploadedImageInfo {
  tmpFileUrl: string;
  fileUrl: string;
  fileKey: string;
}
