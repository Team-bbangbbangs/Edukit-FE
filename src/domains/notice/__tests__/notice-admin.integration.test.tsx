import React from 'react';

import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { render, loginAsAdmin, loginAsUser } from '@/__tests__/utils/test-utils';
import EditDeleteNoticeButton from '@/domains/notice/components/edit-delete-notice-button';
import EditNotice from '@/domains/notice/components/edit-notice';
import WriteNotice from '@/domains/notice/components/write-notice';
import WriteNoticeButton from '@/domains/notice/components/write-notice-button';
import type { DetailNoticeResponse } from '@/domains/notice/types/notice';

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

const mockGetHTML = jest.fn().mockReturnValue('');

jest.mock('@/shared/components/ui/editor/tiptap-editor', () => {
  function MockTipTapEditor(props: any, ref: any) {
    React.useImperativeHandle(ref, () => ({
      getHTML: mockGetHTML,
    }));

    return React.createElement('div', {
      'data-testid': 'tiptap-editor',
      className: props.className,
    });
  }

  return {
    __esModule: true,
    default: React.forwardRef(MockTipTapEditor),
  };
});

const mockNoticeDetail: DetailNoticeResponse = {
  noticeId: '1',
  title: '테스트 공지사항',
  content: '<p>테스트 내용입니다.</p>',
  category: '공지',
  createdAt: '2024-01-01T00:00:00Z',
};

describe('notice-admin 기능 통합 테스트', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(async () => {
    user = userEvent.setup();
    clearAllTestMocks();

    mockGetHTML.mockReturnValue('');
  });

  describe('어드민 권한별 글쓰기 버튼 노출', () => {
    it('비로그인 상태에서는 글쓰기 버튼이 없다', () => {
      const { container } = render(<WriteNoticeButton />);
      expect(container.firstChild).toBeNull();
    });

    it('일반 사용자 로그인 시 글쓰기 버튼이 없다', async () => {
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

    it('작성 폼 렌더링 확인', () => {
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

      await user.click(eventButton);

      expect(eventButton).toHaveClass('bg-slate-800');
      expect(noticeButton).toHaveClass('bg-white');
    });

    it.each([
      ['제목만 입력', '테스트 제목', ''],
      ['내용만 입력', '', '<p>테스트 내용입니다.</p>'],
    ])(
      '"%s" 상태에서 작성하기 클릭 시 제목과 내용을 모두 입력해달라는 alert 메세지가 표시된다',
      async (_, title, content) => {
        const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
        try {
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

          expect(alertSpy).toHaveBeenCalledWith('제목과 내용을 모두 입력해주세요.');
        } finally {
          alertSpy.mockRestore();
        }
      },
    );

    it('이벤트 태그를 클릭하고, 제목 및 내용을 입력하고 작성하기 버튼을 클릭 시 공지사항 작성 api 요청이 성공하고 notice 페이지로 이동한다', async () => {
      render(<WriteNotice />);
      await user.click(screen.getByText('이벤트'));

      const titleInput = screen.getByPlaceholderText('제목');
      await user.type(titleInput, '테스트 공지사항 제목');

      mockGetHTML.mockReturnValue('<p>테스트 내용입니다.</p>');

      await user.click(screen.getByRole('button', { name: '작성하기' }));

      expect(mockPush).toHaveBeenCalledWith('/notice');
    });
  });

  describe('공지사항 수정/삭제 기능', () => {
    beforeEach(async () => {
      await loginAsAdmin();
    });

    it('일반 사용자일 때 수정/삭제 버튼이 보이지 않는다', async () => {
      clearAllTestMocks();
      await loginAsUser();

      const { container } = render(<EditDeleteNoticeButton id="1" />);
      expect(container.firstChild).toBeNull();
    });

    it('어드민 시 수정/삭제 버튼 노출', () => {
      render(<EditDeleteNoticeButton id="1" />);
      expect(screen.getByText('수정하기')).toBeInTheDocument();
      expect(screen.getByText('삭제하기')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: '수정하기' })).toHaveAttribute(
        'href',
        '/notice/edit-notice/1',
      );
    });

    it('삭제 버튼 클릭 -> 모달 열림 -> 삭제 버튼 클릭 -> 삭제 api 요청이 성공하고 notice 페이지로 이동한다', async () => {
      render(<EditDeleteNoticeButton id="1" />);

      await user.click(screen.getByText('삭제하기'));

      await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());

      await user.click(screen.getByRole('button', { name: '삭제' }));

      expect(mockPush).toHaveBeenCalledWith('/notice');
    });

    it('수정 폼에서 취소 버튼 클릭 시 이전 페이지로 이동한다', async () => {
      render(<EditNotice notice={mockNoticeDetail} />);
      await user.click(screen.getByRole('button', { name: '취소' }));
      expect(mockBack).toHaveBeenCalled();
    });

    it('공지사항 수정을 수정하고 수정하기 버튼을 누르면 수정 api 요청이 성공하고 /notice/id 페이지로 이동한다.', async () => {
      render(<EditNotice notice={mockNoticeDetail} />);

      const titleInput = screen.getByDisplayValue('테스트 공지사항');
      await user.clear(titleInput);
      await user.type(titleInput, '수정된 테스트 공지사항');

      await user.click(screen.getByText('이벤트'));

      mockGetHTML.mockReturnValue('<p>수정된 테스트 내용입니다.</p>');

      await user.click(screen.getByRole('button', { name: '수정하기' }));

      expect(mockPush).toHaveBeenCalledWith('/notice/1');
    });
  });
});
