import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { setupMSW } from '@/__tests__/utils/msw-setup';
import { render } from '@/__tests__/utils/test-utils';

import Signup from '../components/signup/signup';

setupMSW();

describe('회원가입 통합 테스트', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('회원가입 폼이 정상적으로 렌더링된다', () => {
    render(<Signup />);
    expect(screen.getByText('회원가입')).toBeInTheDocument();
    expect(screen.getByLabelText('이메일')).toBeInTheDocument();
    expect(screen.getByLabelText('비밀번호')).toBeInTheDocument();
    expect(screen.getByLabelText('비밀번호 확인')).toBeInTheDocument();
    expect(screen.getByText('담당 교과목')).toBeInTheDocument();
    expect(screen.getByText('중학교')).toBeInTheDocument();
    expect(screen.getByText('고등학교')).toBeInTheDocument();
  });

  it('유효하지 않은 이메일 입력 시 에러 메시지가 표시되고, 이메일 input의 border가 빨간색으로 변한다.', async () => {
    const user = userEvent.setup();
    render(<Signup />);

    const emailInput = screen.getByLabelText('이메일');

    await user.type(emailInput, 'invalid-email');

    await waitFor(() => {
      expect(screen.getByText('이메일 형식이 유효하지 않습니다.')).toBeInTheDocument();
      expect(emailInput).toHaveClass('border-red-500');
    });
  });

  it('교직 이메일이 아닌 경우 에러 메시지가 표시되고, 이메일 input의 border가 빨간색으로 변한다.', async () => {
    const user = userEvent.setup();
    render(<Signup />);

    const emailInput = screen.getByLabelText('이메일');

    await user.type(emailInput, 'test@daum.net');

    await waitFor(() => {
      expect(screen.getByText('교직 이메일이 아닙니다.')).toBeInTheDocument();
      expect(emailInput).toHaveClass('border-red-500');
    });
  });

  it('8자 이하의 비밀번호 입력시 에러 메시지가 표시되고, 비밀번호 input의 border가 빨간색으로 변한다.', async () => {
    const user = userEvent.setup();
    render(<Signup />);

    const passwordInput = screen.getByLabelText('비밀번호');

    await user.type(passwordInput, '123');

    await waitFor(() => {
      expect(screen.getByText('비밀번호는 최소 8자 이상이어야 합니다.')).toBeInTheDocument();
      expect(passwordInput).toHaveClass('border-red-500');
    });
  });

  it('20자가 넘는 비밀번호 입력시 에러 메시지가 표시되고, 비밀번호 input의 border가 빨간색으로 변한다.', async () => {
    const user = userEvent.setup();
    render(<Signup />);

    const passwordInput = screen.getByLabelText('비밀번호');

    await user.type(passwordInput, 'ab12345678910112123451234512');

    await waitFor(() => {
      expect(screen.getByText('비밀번호는 최대 20자 이하이어야 합니다.')).toBeInTheDocument();
      expect(passwordInput).toHaveClass('border-red-500');
    });
  });

  it('유효하지 않은 비밀번호 형식 입력시 에러 메시지가 표시되고, 비밀번호 input의 border가 빨간색으로 변한다.', async () => {
    const user = userEvent.setup();
    render(<Signup />);

    const passwordInput = screen.getByLabelText('비밀번호');

    await user.type(passwordInput, '12345678');

    await waitFor(() => {
      expect(
        screen.getByText('영문/숫자/특수문자 중 2가지 이상 포함해야 합니다.'),
      ).toBeInTheDocument();
      expect(passwordInput).toHaveClass('border-red-500');
    });
  });

  it('동일 문자 3번 연속 사용시 에러 메시지가 표시되고, 비밀번호 input의 border가 빨간색으로 변한다.', async () => {
    const user = userEvent.setup();
    render(<Signup />);

    const passwordInput = screen.getByLabelText('비밀번호');

    await user.type(passwordInput, 'aaa12345');

    await waitFor(() => {
      expect(screen.getByText('동일 문자를 3번 연속으로 사용할 수 없습니다.')).toBeInTheDocument();
      expect(passwordInput).toHaveClass('border-red-500');
    });
  });

  it('비밀번호 확인이 비밀번화와 다르면 에러 메시지가 표시되고, 비밀번호 확인 input의 border가 빨간색으로 변한다.', async () => {
    const user = userEvent.setup();
    render(<Signup />);

    const passwordInput = screen.getByLabelText('비밀번호');
    const passwordConfirmInput = screen.getByLabelText('비밀번호 확인');

    await user.type(passwordInput, 'password123!');
    await user.type(passwordConfirmInput, 'wrongpassword');

    await waitFor(() => {
      expect(screen.getByText('비밀번호가 일치하지 않습니다.')).toBeInTheDocument();
      expect(passwordConfirmInput).toHaveClass('border-red-500');
    });
  });

  it('담당 교과목 입력창을 클릭하고 없는 과목을 입력하면 해당 과목이 존재하지 않는다는 메세지가 표시된다.', async () => {
    const user = userEvent.setup();
    render(<Signup />);

    const subjectButton = screen.getByRole('button', { name: '담당 교과목 선택' });
    await user.click(subjectButton);

    const input = screen.getByPlaceholderText('과목을 입력하세요');
    await user.type(input, '없음');

    await waitFor(() => {
      expect(screen.getByText('검색 결과가 없습니다.')).toBeInTheDocument();
    });
  });

  it('담당 교과목 입력창을 클릭하고 과목을 입력한 뒤 선택하면 해당 교과목이 선택된다', async () => {
    const user = userEvent.setup();
    render(<Signup />);

    const subjectButton = screen.getByRole('button', { name: '담당 교과목 선택' });
    await user.click(subjectButton);

    const input = screen.getByPlaceholderText('과목을 입력하세요');
    await user.type(input, '수학');
    const option = await screen.findByText('수학');

    await user.click(option);
    expect(subjectButton).toHaveTextContent('수학');
  });

  it('학교 유형을 선택할 수 있다', async () => {
    const user = userEvent.setup();
    render(<Signup />);

    const middleSchoolButton = screen.getByText('중학교');
    const highSchoolBtn = screen.getByText('고등학교');
    await user.click(highSchoolBtn);

    await user.click(highSchoolBtn);
    expect(highSchoolBtn).toHaveAttribute('aria-checked', 'true');
    expect(middleSchoolButton).toHaveAttribute('aria-checked', 'false');
  });

  it('아무런 입력값을 채워넣지 않고 가입하기 버튼을 누르면 form을 채워달라는 문구가 표시된다.', async () => {
    const user = userEvent.setup();
    render(<Signup />);

    const loginInput = screen.getByLabelText('이메일');
    const passwordInput = screen.getByLabelText('비밀번호');
    const passwordConfirmInput = screen.getByLabelText('비밀번호 확인');

    await user.click(screen.getByRole('button', { name: '가입하기' }));

    await waitFor(() => {
      expect(screen.getByText('이메일을 입력해주세요.')).toBeInTheDocument();
      expect(loginInput).toHaveClass('border-red-500');
      expect(screen.getByText('비밀번호를 입력해주세요.')).toBeInTheDocument();
      expect(passwordInput).toHaveClass('border-red-500');
      expect(screen.getByText('비밀번호 확인을 입력해주세요.')).toBeInTheDocument();
      expect(passwordConfirmInput).toHaveClass('border-red-500');
      expect(screen.getByText('교과목을 입력해주세요.')).toBeInTheDocument();
      expect(screen.getByText('학교를 선택해주세요.')).toBeInTheDocument();
    });
  });

  it('이미 가입되어 있는 이메일을 입력하면 이미 등록된 회원입니다. 라는 alert 메세지가 출력된다.', async () => {
    const user = userEvent.setup();
    window.alert = jest.fn();

    render(<Signup />);

    await user.type(screen.getByLabelText('이메일'), 'test123@edukit.co.kr');
    await user.type(screen.getByLabelText('비밀번호'), 'password123!');
    await user.type(screen.getByLabelText('비밀번호 확인'), 'password123!');

    await user.click(screen.getByRole('button', { name: '담당 교과목 선택' }));
    const input = screen.getByPlaceholderText('과목을 입력하세요');
    await user.type(input, '국어');
    await user.click(await screen.findByText('국어'));

    const highSchoolBtn = screen.getByText('고등학교');
    await user.click(highSchoolBtn);
    await user.click(screen.getByRole('button', { name: '가입하기' }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('이미 등록된 회원입니다.');
    });
  });

  it('유효한 데이터를 입력하고 회원가입을 완료하면 인증 메일 안내 화면이 나타난다', async () => {
    const user = userEvent.setup();
    render(<Signup />);

    await user.type(screen.getByLabelText('이메일'), 'test@edukit.co.kr');
    await user.type(screen.getByLabelText('비밀번호'), 'password123!');
    await user.type(screen.getByLabelText('비밀번호 확인'), 'password123!');

    await user.click(screen.getByRole('button', { name: '담당 교과목 선택' }));
    const input = screen.getByPlaceholderText('과목을 입력하세요');
    await user.type(input, '국어');
    await user.click(await screen.findByText('국어'));

    const highSchoolBtn = screen.getByText('고등학교');
    await user.click(highSchoolBtn);
    await user.click(screen.getByRole('button', { name: '가입하기' }));

    await waitFor(() => {
      expect(mockSetAuthData).toHaveBeenCalledWith(
        expect.stringContaining('user-access-token'),
        false,
      );
      expect(screen.getByText('가입 완료')).toBeInTheDocument();
      expect(screen.getByText(/가입하신 이메일로 인증 메일을 보냈습니다/)).toBeInTheDocument();
    });
  });
});
