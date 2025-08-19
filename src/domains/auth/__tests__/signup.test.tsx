import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { render } from '@/__tests__/utils/test-utils';

import Signup from '../components/signup/signup';

describe('signup 컴포넌트 단위 테스트', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('회원가입 폼이 정상적으로 렌더링된다', () => {
    render(<Signup />);
    expect(screen.getByText('회원가입')).toBeInTheDocument();
    expect(screen.getByLabelText('이메일')).toBeInTheDocument();
    expect(screen.getByLabelText('비밀번호')).toBeInTheDocument();
    expect(screen.getByLabelText('비밀번호 확인')).toBeInTheDocument();
    expect(screen.getByLabelText('닉네임')).toBeInTheDocument();
    expect(screen.getByText('중복 확인')).toBeInTheDocument();

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
      expect(screen.getByText('이메일 형식이 올바르지 않습니다.')).toBeInTheDocument();
      expect(emailInput).toHaveClass('border-red-500');
    });
  });

  it('교직 이메일이 아닌 경우 에러 메시지가 표시되고, 이메일 input의 border가 빨간색으로 변한다.', async () => {
    const user = userEvent.setup();
    render(<Signup />);

    const emailInput = screen.getByLabelText('이메일');

    await user.type(emailInput, 'test@daum.net');

    await waitFor(() => {
      expect(
        screen.getByText('유효하지 않은 교사 이메일입니다. 교육청 이메일 도메인만 허용됩니다.'),
      ).toBeInTheDocument();
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

  it('닉네임을 입력하면 중복 확인이 필요하다는 메시지가 표시된다', async () => {
    const user = userEvent.setup();
    render(<Signup />);

    const nicknameInput = screen.getByLabelText('닉네임');
    await user.type(nicknameInput, 'testnickname');

    await waitFor(() => {
      expect(screen.getByText('닉네임 중복 확인을 해주세요.')).toBeInTheDocument();
      expect(nicknameInput).toHaveClass('border-orange-500');
    });
  });

  it('닉네임이 비어있으면 중복 확인 버튼이 비활성화된다', () => {
    render(<Signup />);

    const checkButton = screen.getByText('중복 확인');
    expect(checkButton).toBeDisabled();
  });

  it('닉네임 중복 확인에 성공하면 사용 가능하다는 메시지가 표시된다', async () => {
    const user = userEvent.setup();
    render(<Signup />);

    const nicknameInput = screen.getByLabelText('닉네임');
    const checkButton = screen.getByText('중복 확인');

    await user.type(nicknameInput, 'testnickname');
    await user.click(checkButton);

    await waitFor(() => {
      expect(screen.getByText('사용하실 수 있는 닉네임입니다!')).toBeInTheDocument();
    });
  });

  it('유효하지 않은 닉네임일 경우 에러 메시지가 표시된다', async () => {
    const user = userEvent.setup();
    render(<Signup />);

    const nicknameInput = screen.getByLabelText('닉네임');
    const checkButton = screen.getByText('중복 확인');

    await user.type(nicknameInput, 'ㅇㅇ');
    await user.click(checkButton);

    await waitFor(() => {
      expect(screen.getByText('입력하신 닉네임은 유효하지 않습니다.')).toBeInTheDocument();
      expect(nicknameInput).toHaveClass('border-red-500');
    });
  });

  it('중복된 닉네임일 경우 에러 메시지가 표시된다', async () => {
    const user = userEvent.setup();
    render(<Signup />);

    const nicknameInput = screen.getByLabelText('닉네임');
    const checkButton = screen.getByText('중복 확인');

    await user.type(nicknameInput, '선생님1');
    await user.click(checkButton);

    await waitFor(() => {
      expect(screen.getByText('입력하신 닉네임은 중복된 닉네임입니다.')).toBeInTheDocument();
      expect(nicknameInput).toHaveClass('border-red-500');
    });
  });

  it('닉네임을 변경하면 중복 확인 상태가 초기화된다', async () => {
    const user = userEvent.setup();
    render(<Signup />);

    const nicknameInput = screen.getByLabelText('닉네임');
    const checkButton = screen.getByText('중복 확인');

    await user.type(nicknameInput, 'testnickname');
    await user.click(checkButton);

    await waitFor(() => {
      expect(screen.getByText('사용하실 수 있는 닉네임입니다!')).toBeInTheDocument();
    });

    await user.clear(nicknameInput);
    await user.type(nicknameInput, 'newnickname');

    await waitFor(() => {
      expect(screen.getByText('닉네임 중복 확인을 해주세요.')).toBeInTheDocument();
      expect(screen.queryByText('사용하실 수 있는 닉네임입니다!')).not.toBeInTheDocument();
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

  it('필수 입력값이 없거나 닉네임 중복 확인을 하지 않으면 가입하기 버튼이 비활성화된다', async () => {
    render(<Signup />);

    const submitButton = screen.getByRole('button', { name: '가입하기' });
    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveClass('cursor-not-allowed');
  });

  it('이미 가입되어 있는 이메일로 가입 시 이메일 필드에 에러가 표시된다', async () => {
    const user = userEvent.setup();
    render(<Signup />);

    await user.type(screen.getByLabelText('이메일'), 'test123@edukit.co.kr');
    await user.type(screen.getByLabelText('비밀번호'), 'password123!');
    await user.type(screen.getByLabelText('비밀번호 확인'), 'password123!');
    await user.type(screen.getByLabelText('닉네임'), 'testnickname');

    await user.click(screen.getByText('중복 확인'));
    await waitFor(() => {
      expect(screen.getByText('사용하실 수 있는 닉네임입니다!')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: '담당 교과목 선택' }));
    const input = screen.getByPlaceholderText('과목을 입력하세요');
    await user.type(input, '국어');
    await user.click(await screen.findByText('국어'));

    await user.click(screen.getByText('고등학교'));

    await user.click(screen.getByRole('button', { name: '가입하기' }));

    await waitFor(() => {
      expect(screen.getByText('이미 등록된 회원입니다.')).toBeInTheDocument();
      expect(screen.getByLabelText('이메일')).toHaveClass('border-red-500');
    });
  });

  it('닉네임 중복 확인을 하지 않으면 가입하기 버튼이 비활성화된다', async () => {
    const user = userEvent.setup();
    render(<Signup />);

    await user.type(screen.getByLabelText('이메일'), 'test@edukit.co.kr');
    await user.type(screen.getByLabelText('비밀번호'), 'password123!');
    await user.type(screen.getByLabelText('비밀번호 확인'), 'password123!');
    await user.type(screen.getByLabelText('닉네임'), 'testnickname');

    await user.click(screen.getByRole('button', { name: '담당 교과목 선택' }));
    const input = screen.getByPlaceholderText('과목을 입력하세요');
    await user.type(input, '국어');
    await user.click(await screen.findByText('국어'));

    await user.click(screen.getByText('고등학교'));

    const submitButton = screen.getByRole('button', { name: '가입하기' });
    expect(submitButton).toBeDisabled();
  });

  it('유효한 데이터를 입력하고 회원가입을 완료하면 인증 메일 안내 화면이 나타난다', async () => {
    const user = userEvent.setup();
    render(<Signup />);

    await user.type(screen.getByLabelText('이메일'), 'test@edukit.co.kr');
    await user.type(screen.getByLabelText('비밀번호'), 'password123!');
    await user.type(screen.getByLabelText('비밀번호 확인'), 'password123!');
    await user.type(screen.getByLabelText('닉네임'), 'testnickname');

    await user.click(screen.getByText('중복 확인'));
    await waitFor(() => {
      expect(screen.getByText('사용하실 수 있는 닉네임입니다!')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: '담당 교과목 선택' }));
    const input = screen.getByPlaceholderText('과목을 입력하세요');
    await user.type(input, '국어');
    await user.click(await screen.findByText('국어'));

    await user.click(screen.getByText('고등학교'));

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
