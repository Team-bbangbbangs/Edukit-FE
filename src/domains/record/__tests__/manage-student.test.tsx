import { screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { render, loginAsUser } from '@/__tests__/utils/test-utils';
import ManageStudent from '@/domains/record/components/manage-student/manage-student';

global.alert = jest.fn();
global.confirm = jest.fn();

beforeAll(() => {
  global.URL.createObjectURL = jest.fn(() => 'mock-url');
  global.URL.revokeObjectURL = jest.fn();

  global.Blob = jest.fn((parts, options) => ({
    size: 0,
    type: options?.type || '',
    parts,
  })) as any;

  const originalCreateElement = document.createElement;
  document.createElement = jest.fn((tagName) => {
    if (tagName === 'a') {
      const mockAnchor = originalCreateElement.call(document, 'a');
      mockAnchor.click = jest.fn();
      mockAnchor.dispatchEvent = jest.fn();
      return mockAnchor;
    }
    return originalCreateElement.call(document, tagName);
  });
});

describe('ManageStudent 컴포넌트 단위 테스트', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(async () => {
    user = userEvent.setup();
    clearAllTestMocks();
    (global.alert as jest.Mock).mockClear();
    (global.confirm as jest.Mock).mockClear();
    (global.URL.createObjectURL as jest.Mock).mockClear();

    await loginAsUser();
  });

  describe('기본 렌더링 테스트', () => {
    it('컴포넌트가 정상적으로 렌더링된다', async () => {
      render(<ManageStudent />);

      expect(screen.getByText('학생 관리')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '학생 추가' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '엑셀 파일에서 명단 업로드' })).toBeInTheDocument();
      expect(screen.getByText('필터')).toBeInTheDocument();
    });

    it('학생 데이터 로딩 후 학생 목록을 표시한다', async () => {
      render(<ManageStudent />);

      await waitFor(() => {
        expect(screen.getByText(/총.*명의 학생 등록/)).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByText('학생1')).toBeInTheDocument();
      });
    });
  });

  describe('학생 목록 표시 테스트', () => {
    it('학생 목록 헤더가 정상적으로 표시된다', async () => {
      render(<ManageStudent />);

      await waitFor(() => {
        const headers = screen.getAllByText('학년');
        expect(headers.length).toBeGreaterThanOrEqual(1);
        expect(screen.getAllByText('반').length).toBeGreaterThanOrEqual(1);
        expect(screen.getByText('번호')).toBeInTheDocument();
        expect(screen.getByText('이름')).toBeInTheDocument();
        expect(screen.getByText('생활기록부 관리 항목')).toBeInTheDocument();
      });
    });
  });

  describe('학생 선택 및 삭제 기능 테스트', () => {
    it('개별 학생 체크박스를 클릭하면 선택된다', async () => {
      render(<ManageStudent />);

      await waitFor(() => {
        expect(screen.getByText('학생1')).toBeInTheDocument();
      });

      const firstStudentCheckbox = screen.getAllByTestId('student-defaultbox')[0];
      expect(firstStudentCheckbox).toBeInTheDocument();

      await user.click(firstStudentCheckbox);

      await waitFor(() => {
        expect(screen.getByText(/총.*명의 학생 선택/)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: '삭제' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: '취소' })).toBeInTheDocument();
      });

      const selectionText = screen.getByText(/총.*명의 학생 선택/).textContent;
      expect(selectionText).toMatch(/총 1명의 학생 선택/);
    });

    it('여러 학생을 선택할 수 있다', async () => {
      render(<ManageStudent />);

      await waitFor(() => {
        expect(screen.getByText('학생1')).toBeInTheDocument();
      });

      const studentCheckboxes = screen.getAllByTestId('student-defaultbox');

      await user.click(studentCheckboxes[0]);

      await waitFor(() => {
        expect(screen.getByText(/총 1명의 학생 선택/)).toBeInTheDocument();
      });

      await user.click(studentCheckboxes[1]);

      await waitFor(() => {
        expect(screen.getByText(/총 2명의 학생 선택/)).toBeInTheDocument();
      });

      await user.click(studentCheckboxes[2]);

      await waitFor(() => {
        expect(screen.getByText(/총 3명의 학생 선택/)).toBeInTheDocument();
      });
    });

    it('전체 선택 체크박스를 클릭하면 모든 학생이 선택된다', async () => {
      render(<ManageStudent />);

      await waitFor(() => {
        expect(screen.getByText('학생1')).toBeInTheDocument();
      });

      const headerCheckbox = screen.getByTestId('header-defaultbox');
      expect(headerCheckbox).toBeInTheDocument();

      await user.click(headerCheckbox);

      await waitFor(() => {
        const selectionText = screen.getByText(/총.*명의 학생 선택/).textContent;
        const selectedCount = parseInt(selectionText?.match(/\d+/)?.[0] || '0');

        expect(selectedCount).toBeGreaterThan(0);
      });
    });

    it('취소 버튼을 클릭하면 모든 선택이 해제된다', async () => {
      render(<ManageStudent />);

      await waitFor(() => {
        expect(screen.getByText('학생1')).toBeInTheDocument();
      });

      const firstStudentCheckbox = screen.getAllByTestId('student-defaultbox')[0];
      await user.click(firstStudentCheckbox);

      await waitFor(() => {
        expect(screen.getByText(/총.*명의 학생 선택/)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: '취소' })).toBeInTheDocument();
      });

      const cancelButton = screen.getByRole('button', { name: '취소' });
      await user.click(cancelButton);

      await waitFor(() => {
        expect(screen.queryByText(/총.*명의 학생 선택/)).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: '삭제' })).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: '취소' })).not.toBeInTheDocument();

        expect(screen.getByText(/총.*명의 학생 등록/)).toBeInTheDocument();
      });
    });

    it('삭제 버튼을 클릭하면 삭제 확인 모달이 열린다', async () => {
      render(<ManageStudent />);

      await waitFor(() => {
        expect(screen.getByText('학생1')).toBeInTheDocument();
      });

      const firstStudentCheckbox = screen.getAllByTestId('student-defaultbox')[0];
      await user.click(firstStudentCheckbox);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: '삭제' })).toBeInTheDocument();
      });

      const deleteButton = screen.getByRole('button', { name: '삭제' });
      await user.click(deleteButton);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText('정말 삭제하시겠습니까?')).toBeInTheDocument();
        expect(
          screen.getByText('현재까지 작성한 학생들의 생활기록부 내용이 사라집니다.'),
        ).toBeInTheDocument();
        expect(screen.getByTestId('modal-remove-button')).toBeInTheDocument();
      });
    });

    it('삭제 확인 모달에서 취소를 클릭하면 모달이 닫힌다', async () => {
      render(<ManageStudent />);

      await waitFor(() => {
        expect(screen.getByText('학생1')).toBeInTheDocument();
      });

      const firstStudentCheckbox = screen.getAllByTestId('student-defaultbox')[0];
      await user.click(firstStudentCheckbox);

      const deleteButton = screen.getByRole('button', { name: '삭제' });
      await user.click(deleteButton);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      const confirmCancelButton = screen.getByTestId('modal-cancel-button');
      await user.click(confirmCancelButton);

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        expect(screen.queryByText('정말 삭제하시겠습니까?')).not.toBeInTheDocument();
      });

      expect(screen.getByText(/총.*명의 학생 선택/)).toBeInTheDocument();
    });

    it('삭제 확인 모달에서 삭제를 클릭하면 모달이 사라진다', async () => {
      render(<ManageStudent />);

      await waitFor(() => {
        expect(screen.getByText('학생1')).toBeInTheDocument();
      });

      const firstStudentCheckbox = screen.getAllByTestId('student-defaultbox')[0];
      await user.click(firstStudentCheckbox);

      const deleteButton = screen.getByRole('button', { name: '삭제' });
      await user.click(deleteButton);

      await waitFor(() => {
        expect(screen.getByTestId('modal-remove-button')).toBeInTheDocument();
      });

      const confirmDeleteButton = screen.getByTestId('modal-remove-button');
      await user.click(confirmDeleteButton);

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        expect(screen.queryByText(/총.*명의 학생 선택/)).not.toBeInTheDocument();
      });
    });
  });

  describe('필터 기능 테스트', () => {
    it('필터 버튼을 클릭하면 메뉴가 표시된다', async () => {
      render(<ManageStudent />);

      await waitFor(() => {
        expect(screen.getByText('필터')).toBeInTheDocument();
      });

      const filterButton = screen.getByText('필터').closest('button');
      if (filterButton) {
        await user.click(filterButton);

        await waitFor(() => {
          expect(screen.getByRole('option', { name: '학년' })).toBeInTheDocument();
          expect(screen.getByRole('option', { name: '반' })).toBeInTheDocument();
          expect(screen.getByRole('option', { name: '생기부 관리 항목' })).toBeInTheDocument();
        });
      }
    });

    it('학년 필터를 선택하면 해당 학년 학생들만 표시된다', async () => {
      render(<ManageStudent />);

      await waitFor(() => {
        expect(screen.getByText(/총.*명의 학생 등록/)).toBeInTheDocument();
      });

      const filterButton = screen.getByText('필터').closest('button');
      if (filterButton) {
        await user.click(filterButton);

        await waitFor(() => {
          expect(screen.getByRole('option', { name: '학년' })).toBeInTheDocument();
        });

        const gradeFilter = screen.getByRole('option', { name: '학년' });
        await user.click(gradeFilter);

        await waitFor(() => {
          expect(screen.getByText(/학년:/)).toBeInTheDocument();
        });

        const firstGradeOption = screen.getByRole('option', { name: '1' });
        await user.click(firstGradeOption);

        await waitFor(() => {
          expect(screen.getByText('학년: 1')).toBeInTheDocument();
        });

        await waitFor(() => {
          const studentRows = screen.getAllByText(/학생\d+/);
          expect(studentRows.length).toBeGreaterThan(0);
        });
      }
    });

    it('반 필터를 선택하면 해당 반 학생들만 표시된다', async () => {
      render(<ManageStudent />);

      await waitFor(() => {
        expect(screen.getByText('필터')).toBeInTheDocument();
      });

      const filterButton = screen.getByText('필터').closest('button');
      if (filterButton) {
        await user.click(filterButton);

        await waitFor(() => {
          expect(screen.getByRole('option', { name: '반' })).toBeInTheDocument();
        });

        const classFilter = screen.getByRole('option', { name: '반' });
        await user.click(classFilter);

        await waitFor(() => {
          expect(screen.getByText(/반:/)).toBeInTheDocument();
        });

        const firstClassOption = screen.getByRole('option', { name: '1' });
        await user.click(firstClassOption);

        await waitFor(() => {
          expect(screen.getByText('반: 1')).toBeInTheDocument();
        });

        await waitFor(() => {
          const studentRows = screen.getAllByText(/학생\d+/);
          expect(studentRows.length).toBeGreaterThan(0);
        });
      }
    });

    it('생활기록부 관리 항목 필터를 선택하면 해당 항목을 가진 학생들만 표시된다', async () => {
      render(<ManageStudent />);

      await waitFor(() => {
        expect(screen.getByText('필터')).toBeInTheDocument();
      });

      const filterButton = screen.getByText('필터').closest('button');
      if (filterButton) {
        await user.click(filterButton);

        await waitFor(() => {
          expect(screen.getByRole('option', { name: '생기부 관리 항목' })).toBeInTheDocument();
        });

        const recordFilter = screen.getByRole('option', { name: '생기부 관리 항목' });
        await user.click(recordFilter);

        await waitFor(() => {
          expect(screen.getByText(/생활기록부 관리 항목:/)).toBeInTheDocument();
        });

        await waitFor(() => {
          expect(screen.getByTestId('record-option-subject')).toBeInTheDocument();
        });

        const subjectOption = screen.getByTestId('record-option-subject');

        await user.click(subjectOption);

        await waitFor(() => {
          const studentRows = screen.getAllByText(/학생\d+/);
          expect(studentRows.length).toBeGreaterThan(0);

          const subjectTags = screen.getAllByText('세특');
          expect(subjectTags.length).toBeGreaterThan(1);
        });
      }
    });
  });

  describe('학생 추가 기능 테스트', () => {
    it('학생 추가 버튼을 클릭하면 추가 폼이 표시된다', async () => {
      render(<ManageStudent />);

      const addButton = screen.getByRole('button', { name: '학생 추가' });
      await user.click(addButton);

      await waitFor(() => {
        const inputs = screen.getAllByPlaceholderText('입력');
        expect(inputs).toHaveLength(4);
      });

      expect(addButton).toBeDisabled();
    });

    it('학생 추가 폼에서 취소할 수 있다', async () => {
      render(<ManageStudent />);

      const addButton = screen.getByRole('button', { name: '학생 추가' });
      await user.click(addButton);

      await waitFor(() => {
        const inputs = screen.getAllByPlaceholderText('입력');
        expect(inputs).toHaveLength(4);
      });

      const cancelButton = screen.getByRole('button', { name: '취소' });
      await user.click(cancelButton);

      await waitFor(() => {
        expect(screen.queryAllByPlaceholderText('입력')).toHaveLength(0);
      });

      expect(addButton).toBeEnabled();
    });

    it('학생 정보를 입력하고 생활기록부 항목을 선택한 후 입력한후 추가버튼을 누르면 학생 추가 form이 사라진다', async () => {
      render(<ManageStudent />);

      const addButton = screen.getByRole('button', { name: '학생 추가' });
      await user.click(addButton);

      await waitFor(() => {
        const inputs = screen.getAllByPlaceholderText('입력');
        expect(inputs).toHaveLength(4);
      });

      const inputs = screen.getAllByPlaceholderText('입력');
      const gradeInput = inputs[0];
      const classInput = inputs[1];
      const numberInput = inputs[2];
      const nameInput = inputs[3];

      await user.type(gradeInput, '2');
      await user.type(classInput, '3');
      await user.type(numberInput, '15');
      await user.type(nameInput, '테스트학생');

      const recordDropdownTrigger = screen.getAllByText('항목 추가')[0].closest('button');

      if (recordDropdownTrigger) {
        await user.click(recordDropdownTrigger);

        await waitFor(() => {
          expect(screen.getByTestId('record-option-subject')).toBeInTheDocument();
          expect(screen.getByTestId('record-option-behavior')).toBeInTheDocument();
        });

        const subjectOption = screen.getByTestId('record-option-subject');
        const behaviorOption = screen.getByTestId('record-option-behavior');

        await user.click(subjectOption);
        await user.click(behaviorOption);

        await waitFor(() => {
          const subjectTags = screen.getAllByText('세특');
          const behaviorTags = screen.getAllByText('행발');
          expect(subjectTags.length).toBeGreaterThan(0);
          expect(behaviorTags.length).toBeGreaterThan(0);
        });
      }

      const saveButton = screen.getByRole('button', { name: '추가' });

      await user.click(saveButton);

      await waitFor(() => {
        expect(screen.queryAllByPlaceholderText('입력')).toHaveLength(0);
        expect(addButton).toBeEnabled();
      });
    });

    it('중복 학생 등록 시 에러 알림이 표시된다', async () => {
      render(<ManageStudent />);

      const addButton = screen.getByRole('button', { name: '학생 추가' });
      await user.click(addButton);

      await waitFor(() => {
        const inputs = screen.getAllByPlaceholderText('입력');
        expect(inputs).toHaveLength(4);
      });

      const inputs = screen.getAllByPlaceholderText('입력');
      const gradeInput = inputs[0];
      const classInput = inputs[1];
      const numberInput = inputs[2];
      const nameInput = inputs[3];

      await user.type(gradeInput, '1');
      await user.type(classInput, '1');
      await user.type(numberInput, '1');
      await user.type(nameInput, '중복학생');

      const recordDropdownTrigger = screen.getAllByText('항목 추가')[0].closest('button');

      if (recordDropdownTrigger) {
        await user.click(recordDropdownTrigger);

        await waitFor(() => {
          expect(screen.getByTestId('record-option-subject')).toBeInTheDocument();
        });

        const subjectOption = screen.getByTestId('record-option-subject');
        await user.click(subjectOption);
      }

      const saveButton = screen.getByRole('button', { name: '추가' });

      await user.click(saveButton);

      await waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith('이미 등록된 학생입니다.');
      });
    });

    it('필수 입력값이 없으면 적절한 알림이 표시된다', async () => {
      render(<ManageStudent />);

      const addButton = screen.getByRole('button', { name: '학생 추가' });
      await user.click(addButton);

      await waitFor(() => {
        const inputs = screen.getAllByPlaceholderText('입력');
        expect(inputs).toHaveLength(4);
      });

      const saveButton = screen.getByRole('button', { name: '추가' });

      await user.click(saveButton);

      await waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith('학년을 입력해주세요.');
      });
    });
  });

  describe('엑셀 업로드 기능 테스트', () => {
    const createTestExcelFile = () => {
      const csvContent =
        'data:text/csv;charset=utf-8,학년,반,번호,이름\n1,1,1,홍길동\n1,1,2,김철수\n1,1,3,이영희';
      const blob = new Blob([csvContent], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      return new File([blob], 'test-students.xlsx', {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
    };

    it('엑셀 업로드 버튼을 클릭하면 모달이 열린다', async () => {
      render(<ManageStudent />);

      const excelButton = screen.getByRole('button', { name: '엑셀 파일에서 명단 업로드' });
      await user.click(excelButton);

      await waitFor(() => {
        expect(
          screen.getByText('템플릿을 다운로드하여 학생 정보를 입력한 후 업로드해주세요.'),
        ).toBeInTheDocument();
        expect(screen.getByText('1단계: 템플릿 다운로드')).toBeInTheDocument();
        expect(screen.getByText('2단계: 파일 업로드')).toBeInTheDocument();
        expect(screen.getByText('템플릿 다운로드')).toBeInTheDocument();
        expect(screen.getByText('드래그하거나 클릭하여 파일 업로드')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: '학생 리스트 생성' })).toBeInTheDocument();
      });

      expect(screen.getByRole('button', { name: '학생 리스트 생성' })).toBeDisabled();
    });

    it('템플릿 다운로드 버튼을 클릭하면 템플릿 파일이 다운로드된다', async () => {
      render(<ManageStudent />);

      const excelButton = screen.getByRole('button', { name: '엑셀 파일에서 명단 업로드' });
      await user.click(excelButton);

      await waitFor(() => {
        expect(screen.getByText('템플릿 다운로드')).toBeInTheDocument();
      });

      const downloadButton = screen.getByText('템플릿 다운로드');
      await user.click(downloadButton);

      await waitFor(() => {
        expect(global.URL.createObjectURL).toHaveBeenCalled();
      });
    });

    it('유효한 엑셀 파일을 선택하면 파일이 업로드된다', async () => {
      render(<ManageStudent />);

      const excelButton = screen.getByRole('button', { name: '엑셀 파일에서 명단 업로드' });
      await user.click(excelButton);

      await waitFor(() => {
        expect(screen.getByTestId('excel-upload')).toBeInTheDocument();
      });

      const testFile = createTestExcelFile();
      const hiddenFileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

      if (hiddenFileInput) {
        await user.upload(hiddenFileInput, testFile);

        await waitFor(() => {
          expect(screen.getByText('test-students.xlsx')).toBeInTheDocument();
          expect(screen.getByRole('button', { name: '학생 리스트 생성' })).toBeEnabled();
        });
      }
    });

    it('유효한 파일로 학생 리스트를 생성하면 성공 메시지와 함께 모달이 닫힌다', async () => {
      render(<ManageStudent />);

      const excelButton = screen.getByRole('button', { name: '엑셀 파일에서 명단 업로드' });
      await user.click(excelButton);

      const testFile = createTestExcelFile();
      const hiddenFileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

      if (hiddenFileInput) {
        fireEvent.change(hiddenFileInput, { target: { files: [testFile] } });

        await waitFor(() => {
          expect(screen.getByText('test-students.xlsx')).toBeInTheDocument();
        });

        const createButton = screen.getByRole('button', { name: '학생 리스트 생성' });
        await user.click(createButton);

        await waitFor(() => {
          expect(
            screen.queryByText('템플릿을 다운로드하여 학생 정보를 입력한 후 업로드해주세요.'),
          ).not.toBeInTheDocument();
        });
      }
    });
  });
});
