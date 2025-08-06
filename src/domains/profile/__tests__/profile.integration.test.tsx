import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { render, loginAsUser, loginAsUnverifiedUser } from '@/__tests__/utils/test-utils';
import Mypage from '@/domains/profile/components/mypage';

global.alert = jest.fn();

describe('profile 기능 통합 테스트', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(async () => {
    user = userEvent.setup();
    clearAllTestMocks();
  });

  it('비로그인 상태에서 마이페이지에 접근하면 로딩 스피너가 나오다가, 로그인 안내 메시지가 표시된다', async () => {
    render(<Mypage />);

    await waitFor(
      () => {
        const loading = document.querySelector('[class*="animate-spin"]');
        expect(loading).not.toBeInTheDocument();
      },
      { timeout: 3000 },
    );

    expect(screen.getByText('로그인 후 접근 가능합니다.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '로그인하기' })).toHaveAttribute('href', '/login');
  });

  it('로그인 상태에서는 프로필 정보가 정상적으로 표시된다', async () => {
    await loginAsUser();

    render(<Mypage />);

    await waitFor(() => {
      const loading = document.querySelector('[class*="animate-spin"]');
      expect(loading).not.toBeInTheDocument();
    });

    expect(screen.getByText('내 프로필')).toBeInTheDocument();
    expect(screen.getByText('기본 정보')).toBeInTheDocument();

    expect(screen.getByText('인증 상태 :')).toBeInTheDocument();
    expect(screen.getByText('과목 :')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: '프로필 수정하기' })).toBeInTheDocument();
  });

  it('프로필 수정하기 버튼을 누르면 profile-edit 컴포넌트가 정상적으로 렌더링된다', async () => {
    await loginAsUser();

    render(<Mypage />);

    await waitFor(() => {
      const loading = document.querySelector('[class*="animate-spin"]');
      expect(loading).not.toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: '프로필 수정하기' }));

    expect(screen.getByText('닉네임')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('닉네임을 입력하세요')).toBeInTheDocument();
    expect(screen.getByText('학교')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '중복 확인' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '저장' })).toBeInTheDocument();
  });

  it('프로필 수정하기에서 취소 버튼을 누르면 profile-view 컴포넌트가 정상적으로 렌더링된다', async () => {
    await loginAsUser();

    render(<Mypage />);

    await waitFor(() => {
      const loading = document.querySelector('[class*="animate-spin"]');
      expect(loading).not.toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: '프로필 수정하기' }));

    await user.click(screen.getByRole('button', { name: '취소' }));

    expect(screen.getByText('내 프로필')).toBeInTheDocument();

    expect(screen.getByText('인증 상태 :')).toBeInTheDocument();
    expect(screen.getByText('과목 :')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: '프로필 수정하기' })).toBeInTheDocument();
  });

  it('교사 미인증 유저가 교사 인증 필요 버튼을 클릭하면 이메일이 발송되었다는 모달창이 나온다', async () => {
    await loginAsUnverifiedUser();

    render(<Mypage />);

    await waitFor(() => {
      const loading = document.querySelector('[class*="animate-spin"]');
      expect(loading).not.toBeInTheDocument();
    });

    const certificationButton = screen.getByText('교사 인증 필요');
    await user.click(certificationButton);

    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());
    expect(screen.getByText('이메일이 발송되었습니다')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '확인' }));

    expect(screen.getByText('내 프로필')).toBeInTheDocument();
  });
});
