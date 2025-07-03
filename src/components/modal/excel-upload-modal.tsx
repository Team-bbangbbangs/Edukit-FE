'use client';

import { useRef, useState } from 'react';

import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

import { Input } from '@/components/input/input';
import { useCreateRecords } from '@/hooks/api/use-create-records';
import type { RecordType } from '@/types/api/student-record';

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalOverlay,
  ModalPortal,
} from './base-modal';

interface ExcelUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recordType: RecordType;
}

interface StudentData {
  studentNumber: string;
  studentName: string;
}

export default function ExcelUploadModal({
  open,
  onOpenChange,
  recordType,
}: ExcelUploadModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const semesterRef = useRef<HTMLInputElement>(null);

  const [uploadedStudents, setUploadedStudents] = useState<StudentData[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const { mutate: createRecords } = useCreateRecords();

  const downloadTemplate = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('학생 목록');

    worksheet.columns = [
      { header: '학번', key: 'studentNumber', width: 15 },
      { header: '이름', key: 'studentName', width: 15 },
    ];

    worksheet.addRow({ studentNumber: '20240001', studentName: '홍길동' });
    worksheet.addRow({ studentNumber: '20240002', studentName: '김철수' });
    worksheet.addRow({ studentNumber: '20240003', studentName: '이영희' });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    saveAs(blob, '학생목록_템플릿.xlsx');
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      alert('파일 크기가 너무 큽니다. 10MB 이하의 파일을 업로드해주세요.');
      return;
    }

    setIsUploading(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(arrayBuffer);

      const worksheet = workbook.getWorksheet(1);
      if (!worksheet) {
        alert('엑셀 파일을 읽을 수 없습니다.');
        return;
      }

      const students: StudentData[] = [];

      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return;

        const studentNumber = row.getCell(1).value?.toString().trim();
        const studentName = row.getCell(2).value?.toString().trim();

        if (studentNumber && studentName) {
          students.push({
            studentNumber,
            studentName,
          });
        }
      });

      if (students.length === 0) {
        alert('유효한 학생 데이터가 없습니다. 학번과 이름을 확인해주세요.');
        return;
      }

      setUploadedStudents(students);
    } catch {
      alert('엑셀 파일을 처리하는 중 오류가 발생했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = () => {
    const semester = semesterRef.current?.value;
    if (!semester) {
      alert('학기를 입력해주세요.');
      return;
    }

    if (uploadedStudents.length === 0) {
      alert('업로드된 학생 데이터가 없습니다.');
      return;
    }

    const studentRecords = uploadedStudents.map((student) => ({
      studentNumber: student.studentNumber,
      studentName: student.studentName,
    }));

    createRecords(
      { recordType, studentRecords, semester },
      {
        onSuccess: handleClose,
      },
    );
  };

  const handleClose = () => {
    setUploadedStudents([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onOpenChange(false);
  };

  return (
    <Modal open={open} onOpenChange={handleClose}>
      <ModalPortal>
        <ModalOverlay />
        <ModalContent aria-describedby={undefined} className="max-w-[778px] rounded-xl p-5">
          <ModalHeader className="w-full">
            <ModalTitle className="mb-5 flex flex-col items-center justify-center gap-3 text-[24px]">
              <div className="flex items-center gap-2">
                <span>학기</span>
                <Input
                  ref={semesterRef}
                  className="ml-2 w-[86px] p-2 pt-3 text-black"
                  type="text"
                  defaultValue="2025-1"
                  disabled
                />
              </div>

              <p className="text-center text-lg text-gray-700">
                템플릿을 다운로드하여 학생 정보를 입력한 후 업로드해주세요.
              </p>
            </ModalTitle>
          </ModalHeader>

          <div className="flex items-center justify-center gap-4">
            <div className="flex flex-col items-center justify-center gap-2 rounded-lg bg-blue-50 p-4">
              <h3 className="font-semibold">1단계: 템플릿 다운로드</h3>
              <p className="text-sm text-gray-600">
                먼저 엑셀 템플릿을 다운로드하여 학생 정보를 입력해주세요.
              </p>
              <button
                onClick={downloadTemplate}
                className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
              >
                📥 템플릿 다운로드
              </button>
            </div>

            <div className="flex flex-col items-center justify-center gap-2 rounded-lg bg-green-50 px-[30px] py-[18px]">
              <h3 className="font-semibold">2단계: 파일 업로드</h3>
              <p className="text-sm text-gray-600">
                학생 정보를 입력한 엑셀 파일을 업로드해주세요.
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
                className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-green-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-green-700 hover:file:bg-green-100"
                disabled={isUploading}
              />
              {isUploading ? (
                <p className="mt-2 text-sm text-blue-600">파일을 처리하는 중...</p>
              ) : null}
            </div>
          </div>

          {uploadedStudents.length > 0 ? (
            <div className="w-full rounded-lg bg-gray-50 p-4">
              <h3 className="mb-2 font-semibold">
                업로드된 학생 목록 ({uploadedStudents.length}명)
              </h3>
              <div className="max-h-32 overflow-y-auto">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {uploadedStudents.map((student, index) => (
                    <div key={index} className="flex gap-2 rounded border bg-white p-2">
                      <span className="font-medium">{student.studentNumber}</span>
                      <span>{student.studentName}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          <div className="mt-6 flex gap-2">
            <button
              onClick={handleClose}
              className="rounded-md bg-gray-200 px-4 py-2 font-medium text-gray-700 hover:bg-gray-300"
            >
              취소
            </button>
            <button
              onClick={handleSubmit}
              disabled={uploadedStudents.length === 0}
              className="rounded-md bg-slate-800 px-4 py-2 font-medium text-white hover:bg-slate-950 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {uploadedStudents.length > 0 ? `${uploadedStudents.length}명 생성하기` : '생성하기'}
            </button>
          </div>
        </ModalContent>
      </ModalPortal>
    </Modal>
  );
}
