import React from 'react';

import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { render, loginAsAdmin, loginAsUser } from '@/__tests__/utils/test-utils';
import EditDeleteNoticeButton from '@/domains/notice/components/edit-delete-notice-button';
import EditNotice from '@/domains/notice/components/edit-notice';
import WriteNotice from '@/domains/notice/components/write-notice';
import WriteNoticeButton from '@/domains/notice/components/write-notice-button';
import type { DetailNoticeResponse, UploadedImageInfo } from '@/domains/notice/types/notice';

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

jest.mock('@/shared/lib/actions/revalidateNotice', () => ({
  revalidateNotice: jest.fn(),
}));

global.alert = jest.fn();

const mockGetHTML = jest.fn().mockReturnValue('');

jest.mock('@/shared/components/ui/editor/tiptap-editor', () => {
  function MockTipTapEditor(props: any, ref: any) {
    React.useImperativeHandle(ref, () => ({
      getHTML: mockGetHTML,
    }));

    return React.createElement('div', {
      'data-testid': 'tiptap-editor',
      className: props.className,
      onClick: () => {
        if (props.onImageUpload) {
          const mockImageInfo: UploadedImageInfo = {
            tmpFileUrl: 'https://tmp.example.com/test.jpg',
            fileUrl: 'https://cdn.example.com/test.jpg',
            fileKey: 'test-file-key-1',
          };
          props.onImageUpload(mockImageInfo);
        }
      },
    });
  }

  return {
    __esModule: true,
    default: React.forwardRef(MockTipTapEditor),
  };
});

const mockHandleImageUpload = jest.fn();
const mockExtractUsedFileKeys = jest.fn().mockReturnValue(['test-key-1', 'test-key-2']);
const mockConvertTmpUrlsToFileUrls = jest.fn((content) => content);
const mockResetFileKeys = jest.fn();

jest.mock('@/domains/notice/hooks/use-notice-file-keys', () => ({
  useNoticeFileKeys: jest.fn(() => ({
    handleImageUpload: mockHandleImageUpload,
    extractUsedFileKeys: mockExtractUsedFileKeys,
    convertTmpUrlsToFileUrls: mockConvertTmpUrlsToFileUrls,
    resetFileKeys: mockResetFileKeys,
    uploadedImagesCount: 0,
    existingImagesCount: 0,
    totalImagesCount: 0,
  })),
}));

const mockNoticeDetail: DetailNoticeResponse = {
  noticeId: 1,
  title: '테스트 공지사항',
  content: '<p>테스트 내용입니다.</p>',
  category: '공지',
  createdAt: '2024-01-01T00:00:00Z',
  noticeFileKeys: ['1', '2', '3'],
};

describe('공지사항 어드민 통합 테스트', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(async () => {
    user = userEvent.setup();
    clearAllTestMocks();

    mockGetHTML.mockReturnValue('');
    mockHandleImageUpload.mockClear();
    mockExtractUsedFileKeys.mockClear();
    mockConvertTmpUrlsToFileUrls.mockClear();
    (global.alert as jest.Mock).mockClear();
  });

  describe('어드민 권한별 글쓰기 버튼 노출', () => {
    it('비로그인 상태에서는 글쓰기 버튼이 보이지 않는다', () => {
      const { container } = render(<WriteNoticeButton />);
      expect(container.firstChild).toBeNull();
    });

    it('일반 사용자 로그인 시 글쓰기 버튼이 보이지 않는다', async () => {
      await loginAsUser();
      const { container } = render(<WriteNoticeButton />);
      expect(container.firstChild).toBeNull();
    });

    it('어드민 로그인 시 글쓰기 버튼이 보인다', async () => {
      await loginAsAdmin();
      render(<WriteNoticeButton />);

      expect(screen.getByText('글쓰기')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: '글쓰기' })).toHaveAttribute(
        'href',
        '/notice/write-notice',
      );
    });
  });

  describe('공지사항 작성 기능', () => {
    beforeEach(async () => {
      await loginAsAdmin();
    });

    it('작성 폼이 정상적으로 렌더링된다', () => {
      render(<WriteNotice />);

      expect(screen.getByText('공지')).toBeInTheDocument();
      expect(screen.getByText('이벤트')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('제목')).toBeInTheDocument();
      expect(screen.getByTestId('tiptap-editor')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '작성하기' })).toBeInTheDocument();
    });

    it('카테고리 선택이 정상적으로 동작한다', async () => {
      render(<WriteNotice />);

      const noticeButton = screen.getByText('공지');
      const eventButton = screen.getByText('이벤트');

      expect(noticeButton).toHaveClass('bg-slate-800');
      expect(eventButton).toHaveClass('bg-white');

      await user.click(eventButton);

      expect(eventButton).toHaveClass('bg-slate-800');
      expect(noticeButton).toHaveClass('bg-white');
    });

    it.each([
      ['제목만 입력', '테스트 제목', ''],
      ['내용만 입력', '', '<p>테스트 내용입니다.</p>'],
      ['공백으로만 구성된 제목과 내용', '   ', '<p>   </p>'],
    ])('%s 상태에서 작성하기 클릭 시 유효성 검사 알림이 표시된다', async (_, title, content) => {
      render(<WriteNotice />);

      if (title) {
        const titleInput = screen.getByPlaceholderText('제목');
        await user.type(titleInput, title);
      }

      if (content) {
        mockGetHTML.mockReturnValue(content);
      }

      const submitButton = screen.getByRole('button', { name: '작성하기' });
      await user.click(submitButton);

      expect(global.alert).toHaveBeenCalledWith('제목과 내용을 모두 입력해주세요.');
    });

    it('정상적인 공지사항을 작성하고 제출하면 공지사항 목록으로 이동한다', async () => {
      render(<WriteNotice />);

      await user.click(screen.getByText('이벤트'));

      const titleInput = screen.getByPlaceholderText('제목');
      await user.type(titleInput, '새로운 이벤트 공지사항');

      mockGetHTML.mockReturnValue('<p>새로운 이벤트에 대한 상세 내용입니다.</p>');

      mockConvertTmpUrlsToFileUrls.mockReturnValue('<p>새로운 이벤트에 대한 상세 내용입니다.</p>');

      const submitButton = screen.getByRole('button', { name: '작성하기' });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/notice');
      });
    });

    it('이미지 업로드 시 handleImageUpload가 호출된다', async () => {
      render(<WriteNotice />);

      const editor = screen.getByTestId('tiptap-editor');
      await user.click(editor);

      expect(mockHandleImageUpload).toHaveBeenCalledWith({
        tmpFileUrl: 'https://tmp.example.com/test.jpg',
        fileUrl: 'https://cdn.example.com/test.jpg',
        fileKey: 'test-file-key-1',
      });
    });

    it('제출 시 파일 키 추출 및 URL 변환 함수가 호출된다', async () => {
      render(<WriteNotice />);

      const titleInput = screen.getByPlaceholderText('제목');
      await user.type(titleInput, '테스트 제목');

      const testContent = '<p>이미지가 포함된 내용</p>';
      mockGetHTML.mockReturnValue(testContent);

      const submitButton = screen.getByRole('button', { name: '작성하기' });
      await user.click(submitButton);

      expect(mockExtractUsedFileKeys).toHaveBeenCalledWith(testContent);
      expect(mockConvertTmpUrlsToFileUrls).toHaveBeenCalledWith(testContent);
    });
  });

  describe('공지사항 수정/삭제 기능', () => {
    beforeEach(async () => {
      await loginAsAdmin();
    });

    it('일반 사용자일 때 수정/삭제 버튼이 보이지 않는다', async () => {
      clearAllTestMocks();
      await loginAsUser();

      const { container } = render(<EditDeleteNoticeButton noticeId={1} />);
      expect(container.firstChild).toBeNull();
    });

    it('어드민일 때 수정/삭제 버튼이 표시된다', () => {
      render(<EditDeleteNoticeButton noticeId={1} />);

      expect(screen.getByText('수정하기')).toBeInTheDocument();
      expect(screen.getByText('삭제하기')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: '수정하기' })).toHaveAttribute(
        'href',
        '/notice/edit-notice/1',
      );
    });

    it('삭제 버튼 클릭 후 확인 모달에서 삭제를 진행하면 공지사항 목록으로 이동한다', async () => {
      render(<EditDeleteNoticeButton noticeId={1} />);

      await user.click(screen.getByText('삭제하기'));

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      await user.click(screen.getByRole('button', { name: '삭제' }));

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/notice');
      });
    });

    it('수정 폼에서 기존 데이터가 정상적으로 로드된다', () => {
      render(<EditNotice notice={mockNoticeDetail} />);

      expect(screen.getByDisplayValue('테스트 공지사항')).toBeInTheDocument();
      expect(screen.getByText('공지')).toHaveClass('bg-slate-800');
      expect(screen.getByRole('button', { name: '수정하기' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '취소' })).toBeInTheDocument();
    });

    it('수정 폼에서 취소 버튼 클릭 시 이전 페이지로 이동한다', async () => {
      render(<EditNotice notice={mockNoticeDetail} />);

      await user.click(screen.getByRole('button', { name: '취소' }));

      expect(mockBack).toHaveBeenCalled();
    });

    it('공지사항 정보를 수정하고 저장하면 해당 공지사항 상세 페이지로 이동한다', async () => {
      render(<EditNotice notice={mockNoticeDetail} />);

      const titleInput = screen.getByDisplayValue('테스트 공지사항');
      await user.clear(titleInput);
      await user.type(titleInput, '수정된 공지사항 제목');

      await user.click(screen.getByText('이벤트'));

      mockGetHTML.mockReturnValue('<p>수정된 공지사항 내용입니다.</p>');
      mockConvertTmpUrlsToFileUrls.mockReturnValue('<p>수정된 공지사항 내용입니다.</p>');

      await user.click(screen.getByRole('button', { name: '수정하기' }));

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/notice/1');
      });
    });

    it('수정 시 유효성 검사가 정상적으로 동작한다', async () => {
      render(<EditNotice notice={mockNoticeDetail} />);

      const titleInput = screen.getByDisplayValue('테스트 공지사항');
      await user.clear(titleInput);

      mockGetHTML.mockReturnValue('');

      await user.click(screen.getByRole('button', { name: '수정하기' }));

      expect(global.alert).toHaveBeenCalledWith('제목과 내용을 모두 입력해주세요.');
    });
  });

  describe('파일 관리 기능', () => {
    beforeEach(async () => {
      await loginAsAdmin();
    });

    it('수정 시 기존 파일 키와 새로운 파일을 올바르게 처리한다', async () => {
      const noticeWithFiles: DetailNoticeResponse = {
        ...mockNoticeDetail,
        noticeFileKeys: ['existing-key-1', 'existing-key-2'],
      };

      render(<EditNotice notice={noticeWithFiles} />);

      const titleInput = screen.getByDisplayValue('테스트 공지사항');
      await user.type(titleInput, ' 수정됨');

      mockGetHTML.mockReturnValue('<p>수정된 내용</p>');
      mockExtractUsedFileKeys.mockReturnValue(['existing-key-1', 'new-key-1']);
      mockConvertTmpUrlsToFileUrls.mockReturnValue('<p>수정된 내용</p>');

      await user.click(screen.getByRole('button', { name: '수정하기' }));

      expect(mockExtractUsedFileKeys).toHaveBeenCalledWith('<p>수정된 내용</p>');

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/notice/1');
      });
    });

    it('이미지 업로드 후 파일 정보가 올바르게 처리된다', async () => {
      render(<WriteNotice />);

      const editor = screen.getByTestId('tiptap-editor');
      await user.click(editor);

      expect(mockHandleImageUpload).toHaveBeenCalledWith({
        tmpFileUrl: 'https://tmp.example.com/test.jpg',
        fileUrl: 'https://cdn.example.com/test.jpg',
        fileKey: 'test-file-key-1',
      });
    });
  });
});
