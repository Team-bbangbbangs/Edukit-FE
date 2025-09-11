import { useState } from 'react';

import Button from '@/shared/components/ui/button/button';
import { Icons } from '@/shared/components/ui/icon/icon';
import ExcelUploadModal from '@/shared/components/ui/modal/excel-upload-modal';

interface ManageStudentHeaderProps {
  onAddStudent: () => void;
  isAddingStudent: boolean;
  disabled?: boolean;
}

export function ManageStudentHeader({
  onAddStudent,
  isAddingStudent,
  disabled = false,
}: ManageStudentHeaderProps) {
  const [excelModalOpen, setExcelModalOpen] = useState(false);

  return (
    <div className="mb-14 flex w-[1135px] items-center justify-between">
      <h2 className="text-heading-24">학생 관리</h2>
      <div className="flex items-center gap-[10px]">
        <Button
          color="primary"
          variant="stroke"
          size="medium"
          shape="rect"
          className="flex items-center gap-2"
          onClick={onAddStudent}
          disabled={isAddingStudent || disabled}
        >
          <span className="text-label-16 text-blue-400">학생 추가</span>
          <Icons.Add color="text-blue-400" size={20} />
        </Button>
        <Button
          color="primary"
          variant="fill"
          size="medium"
          shape="rect"
          className="text-label-16 text-white"
          onClick={() => setExcelModalOpen(true)}
          disabled={disabled}
        >
          엑셀 파일에서 명단 업로드
        </Button>
      </div>
      <ExcelUploadModal open={excelModalOpen} onOpenChange={setExcelModalOpen} />
    </div>
  );
}
