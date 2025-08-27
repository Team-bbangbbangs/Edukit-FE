'use client';

import { useRef, useState } from 'react';

import { useCreateRecords } from '@/domains/record/apis/mutations/use-create-records';
import type { RecordType } from '@/domains/record/types/record';
import { Input } from '@/shared/components/ui/input/input';
import Modal from '@/shared/components/ui/modal/modal';

interface CreateRecordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recordType: RecordType;
}

export default function CreateRecordModal({
  open,
  onOpenChange,
  recordType,
}: CreateRecordModalProps) {
  const countInputRef = useRef<HTMLInputElement>(null);

  const [studentCount, setStudentCount] = useState(0);

  const studentNumberRefs = useRef<(HTMLInputElement | null)[]>([]);
  const studentNameRefs = useRef<(HTMLInputElement | null)[]>([]);

  const { mutate: createRecords } = useCreateRecords();

  const handleRegister = () => {
    const count = Number(countInputRef.current?.value || 0);
    if (count <= 0) return;

    setStudentCount(count);
  };

  const semesterRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    const semester = semesterRef.current?.value;
    if (!semester) return;

    const studentRecords = Array.from({ length: studentCount }, (_, index) => ({
      studentNumber: studentNumberRefs.current[index]?.value || '',
      studentName: studentNameRefs.current[index]?.value || '',
    }));

    if (studentRecords.length === 0) {
      alert('학생 이름과 학번을 최소 1명 이상 입력해주세요.');
      return;
    }

    createRecords({ recordType, studentRecords, semester }, { onSuccess: handleClose });
  };

  const handleClose = () => {
    setStudentCount(0);
    onOpenChange(false);
  };

  return (
    <Modal open={open} onOpenChange={handleClose}>
      <Modal.Overlay />
      <Modal.Content aria-describedby={undefined} className="max-w-xl rounded-xl px-16 py-5 pt-10">
        <Modal.Close />
        <Modal.Title className="mb-5 flex flex-col items-center justify-center gap-1 text-[24px]">
          <div className="flex gap-2">
            <span>학기</span>
            <Input
              ref={semesterRef}
              className="ml-2 w-[86px] p-2 pt-3 text-black"
              type="text"
              defaultValue="2025-1"
              disabled
            />
          </div>
          <div className="flex gap-2">
            <span>학생</span>
            <Input
              type="text"
              ref={countInputRef}
              className="ml-2 w-20 p-2 pt-3 text-right"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleRegister();
                }
              }}
            />
            <span>명</span>
            <button
              onClick={handleRegister}
              className="ml-2 rounded-md bg-blue-800 px-4 pb-1.5 pt-2 text-[16px] font-bold text-white hover:bg-blue-950"
            >
              등록
            </button>
          </div>
        </Modal.Title>
        <div className="max-h-96 min-h-96 w-full overflow-y-auto rounded-xl border border-black p-5">
          {Array.from({ length: studentCount }, (_, index) => (
            <div
              key={index}
              className="mb-2 flex items-center justify-center gap-2 rounded-xl bg-white p-2"
            >
              <span className="w-8 text-black">{index + 1}</span>
              <Input
                type="text"
                placeholder="학번"
                ref={(studentNumber) => {
                  studentNumberRefs.current[index] = studentNumber;
                }}
                className="text-black placeholder:text-slate-700"
              />
              <Input
                type="text"
                placeholder="이름"
                ref={(name) => {
                  studentNameRefs.current[index] = name;
                }}
                className="text-black placeholder:text-slate-700"
              />
            </div>
          ))}
        </div>
        <button
          onClick={handleSubmit}
          className="mt-5 rounded-md bg-blue-800 px-4 py-2 font-bold text-white hover:bg-blue-950"
        >
          생성하기
        </button>
      </Modal.Content>
    </Modal>
  );
}
