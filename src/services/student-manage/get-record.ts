import type { Response } from '@/types/api/response';
import type { StudentRecord } from '@/types/api/student-record';

export const getSubjectRecord = async () => {
  const res = await fetch('/api/getSubjectRecord', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const json: Response<StudentRecord[]> = await res.json();

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || '데이터 fetch 실패');
  }

  if (!json.data) {
    throw new Error('서버에서 데이터를 받지 못했습니다.');
  }

  return json.data;
};

export const getBehaviorRecord = async () => {
  const res = await fetch('/api/getBehaviorRecord');

  const json: Response<StudentRecord[]> = await res.json();

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || '데이터 fetch 실패');
  }

  if (!json.data) {
    throw new Error('서버에서 데이터를 받지 못했습니다.');
  }

  return json.data;
};

export const getCareerRecord = async () => {
  const res = await fetch('/api/getCareerRecord', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const json: Response<StudentRecord[]> = await res.json();

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || '데이터 fetch 실패');
  }

  if (!json.data) {
    throw new Error('서버에서 데이터를 받지 못했습니다.');
  }

  return json.data;
};

export const getClubRecord = async () => {
  const res = await fetch('/api/getClubRecord', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const json: Response<StudentRecord[]> = await res.json();

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || '데이터 fetch 실패');
  }

  if (!json.data) {
    throw new Error('서버에서 데이터를 받지 못했습니다.');
  }

  return json.data;
};

export const getFreeRecord = async () => {
  const res = await fetch('/api/getFreeRecord', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const json: Response<StudentRecord[]> = await res.json();

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || '데이터 fetch 실패');
  }

  if (!json.data) {
    throw new Error('서버에서 데이터를 받지 못했습니다.');
  }

  return json.data;
};
