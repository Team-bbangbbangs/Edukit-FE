'use client';

import { useState, useRef } from 'react';

import type { Student } from '@/domains/record/types/record';

interface EditableCellProps {
  student: Student;
  field: keyof Pick<Student, 'grade' | 'classNumber' | 'studentNumber' | 'studentName'>;
  value: string | number;
  onSave: (updatedStudent: Student) => void;
  className?: string;
}

export function EditCell({ student, field, value, onSave, className }: EditableCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value.toString());
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleBlur = () => {
    if (tempValue.trim() === '') {
      setError('입력값은 비워놓을 수 없습니다.');
      setIsEditing(true);
      return;
    }

    setError('');
    setIsEditing(false);

    if (tempValue !== value.toString()) {
      const isNumberField = ['grade', 'classNumber', 'studentNumber'].includes(field);
      let finalValue: string | number = tempValue;

      if (isNumberField) {
        const numValue = Number(tempValue);
        if (isNaN(numValue)) {
          setError('숫자만 입력 가능합니다.');
          setIsEditing(true);
          return;
        }
        finalValue = numValue;
      }

      const updatedStudent: Student = {
        ...student,
        [field]: finalValue,
      };
      onSave(updatedStudent);
    }
  };

  return (
    <div
      className={`relative flex items-center justify-center border-r border-gray-2 px-10 py-4 transition-colors ${className} ${error ? 'border-red-500' : ''} ${isEditing ? 'border-blue-400 ring-1 ring-blue-300' : 'cursor-pointer hover:bg-gray-50'} focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-300`}
      onClick={() => {
        if (!isEditing) {
          setIsEditing(true);
          setTimeout(() => inputRef.current?.focus(), 0);
        }
      }}
    >
      {isEditing ? (
        <input
          ref={inputRef}
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          onBlur={handleBlur}
          className="w-full bg-transparent text-center text-body-16-m text-gray-black outline-none"
        />
      ) : (
        <span className="truncate text-body-16-m text-gray-black">{value}</span>
      )}

      {error ? (
        <span className="absolute -bottom-5 whitespace-nowrap text-xs text-red-500">{error}</span>
      ) : null}
    </div>
  );
}
