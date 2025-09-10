'use client';

import { useState, useRef } from 'react';

import type { Student } from '@/domains/record/types/record';

interface EditableCellProps {
  student: Student;
  field: keyof Pick<Student, 'grade' | 'classNumber' | 'studentNumber' | 'studentName'>;
  value: string | number;
  onSave: (
    updatedStudent: Student,
    options?: {
      onSuccess?: () => void;
      onError?: (error: Error) => void;
    },
  ) => void;
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
      setTempValue(value.toString());
      setIsEditing(true);
      return;
    }

    if (tempValue === value.toString()) {
      setError('');
      setIsEditing(false);
      return;
    }

    const isNumberField = ['grade', 'classNumber', 'studentNumber'].includes(field);
    let finalValue: string | number = tempValue;

    if (isNumberField) {
      const numValue = Number(tempValue);
      if (isNaN(numValue)) {
        setError('숫자만 입력 가능합니다.');
        setTempValue(value.toString());
        setIsEditing(true);
        return;
      }
      finalValue = numValue;
    }

    setError('');

    const updatedStudent: Student = {
      ...student,
      [field]: finalValue,
    };

    onSave(updatedStudent, {
      onSuccess: () => {
        setIsEditing(false);
      },
      onError: () => {
        setError('유효한 값을 입력해주세요.');
        setTempValue(value.toString());
        setIsEditing(true);
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
          }
        }, 0);
      },
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleBlur();
    }
    if (e.key === 'Escape') {
      setError('');
      setTempValue(value.toString());
      setIsEditing(false);
    }
  };

  return (
    <div
      className={`relative flex items-center justify-center px-10 py-4 transition-colors ${className} ${error ? 'border-red-500' : ''} ${isEditing ? 'border border-blue-400' : 'cursor-pointer border-r border-gray-2 hover:bg-gray-50'}`}
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
          onKeyDown={handleKeyDown}
          className="w-full bg-transparent text-center text-body-16-m text-gray-black outline-none disabled:opacity-50"
        />
      ) : (
        <span className="truncate text-body-16-m text-gray-black">{value}</span>
      )}

      {error ? (
        <span className="absolute -bottom-5 z-10 whitespace-nowrap text-xs text-red-500">
          {error}
        </span>
      ) : null}
    </div>
  );
}
