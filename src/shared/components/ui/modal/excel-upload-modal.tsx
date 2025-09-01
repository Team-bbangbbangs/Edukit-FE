'use client';

import { useRef, useState } from 'react';

import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

import Image from 'next/image';

import { usePostUploadExcel } from '@/domains/record/apis/mutations/use-post-upload-excel';
import Modal from '@/shared/components/ui/modal/modal';

interface ExcelUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export default function ExcelUploadModal({ open, onOpenChange }: ExcelUploadModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { mutate: UploadExcel, isPending } = usePostUploadExcel();

  const downloadTemplate = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('학생명단');

    worksheet.columns = [
      { header: '학년', key: 'grade', width: 15 },
      { header: '반', key: 'classNumber', width: 15 },
      { header: '번호', key: 'studentNumber', width: 15 },
      { header: '이름', key: 'studentName', width: 15 },
    ];

    worksheet.addRow({ grade: '1', classNumber: '1', studentNumber: '1', studentName: '홍길동' });
    worksheet.addRow({ grade: '1', classNumber: '1', studentNumber: '2', studentName: '김철수' });
    worksheet.addRow({ grade: '1', classNumber: '1', studentNumber: '3', studentName: '이영희' });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    saveAs(blob, '학생목록_템플릿.xlsx');
  };

  const setFileWithValidation = (file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      setSelectedFile(null);
      alert('파일 크기는 10MB를 초과할 수 없습니다.');
      return;
    }

    setSelectedFile(file);
  };

  const handleSubmit = () => {
    if (!selectedFile) {
      alert('업로드할 파일을 선택해주세요.');
      return;
    }

    UploadExcel(
      { file: selectedFile },
      {
        onSuccess: () => {
          onOpenChange(false);
          setSelectedFile(null);
        },
        onError: (error) => {
          alert(error.message);
        },
      },
    );
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileWithValidation(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      setFileWithValidation(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleClose = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setSelectedFile(null);
    onOpenChange(false);
  };

  return (
    <Modal open={open} onOpenChange={handleClose}>
      <Modal.Overlay />
      <Modal.Content aria-describedby={undefined} className="max-w-[987px]">
        <Modal.Close />

        <Modal.Title className="mb-8 text-title-20 text-gray-black">
          템플릿을 다운로드하여 학생 정보를 입력한 후 업로드해주세요.
        </Modal.Title>

        <div className="mb-8 flex w-full items-stretch justify-center gap-5">
          <div className="flex flex-1 flex-col gap-3">
            <div className="flex flex-col gap-[2px]">
              <h3 className="text-title-18 text-gray-5">1단계: 템플릿 다운로드</h3>
              <p className="text-body-16-m text-gray-4">
                먼저 엑셀 템플릿을 다운로드하여 학생 정보를 입력해주세요.
              </p>
            </div>
            <button
              onClick={downloadTemplate}
              className="flex flex-col items-center rounded-[8px] bg-gray-1 p-8 transition-colors duration-200 hover:bg-gray-2"
            >
              <div className="flex flex-col items-center gap-4">
                <Image src={'/svgs/ic_24_download.svg'} alt="download" width={24} height={24} />
                <p className="text-label-14 text-gray-5">템플릿 다운로드</p>
              </div>
            </button>
          </div>

          <div className="flex flex-1 flex-col gap-3">
            <div className="flex flex-col gap-[2px]">
              <h3 className="text-title-18 text-gray-5">2단계: 파일 업로드</h3>
              <p className="text-body-16-m text-gray-4">
                학생 정보를 입력한 엑셀 파일(.xlsx)을 업로드해주세요.
              </p>
            </div>
            {selectedFile ? (
              <div className="flex flex-col items-center rounded-[8px] bg-blue-50 p-8">
                <div className="flex w-full items-center justify-between rounded-lg bg-white p-4 shadow-sm">
                  <span className="flex-1 truncate pr-2 text-body-16-m text-gray-5">
                    {selectedFile.name}
                  </span>
                  <button
                    onClick={() => setSelectedFile(null)}
                    className="flex h-6 w-6 items-center justify-center rounded-full text-gray-4 transition-colors duration-150 hover:bg-red-50 hover:text-red-500"
                    aria-label="파일 제거"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ) : (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={isPending}
                />
                <button
                  data-testid="excel-upload"
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  className={`flex flex-col items-center rounded-[8px] bg-gray-1 p-8 transition-colors duration-200 hover:bg-gray-2 ${
                    isDragOver ? 'bg-gray-2' : ''
                  } ${isPending ? 'pointer-events-none opacity-50' : ''} `}
                >
                  <div className="flex flex-col items-center gap-4">
                    <Image src={'/svgs/ic_24_upload.svg'} alt="uploading" width={24} height={24} />
                    <p className="text-label-14 text-gray-5">드래그하거나 클릭하여 파일 업로드</p>
                  </div>
                </button>
              </>
            )}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!selectedFile || isPending}
          className="flex w-full items-center justify-center rounded-[20px] bg-blue-400 px-5 py-6 text-label-18 text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          학생 리스트 생성
        </button>
      </Modal.Content>
    </Modal>
  );
}
