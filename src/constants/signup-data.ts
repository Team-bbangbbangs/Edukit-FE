const allowedDomains: string[] = [
  'sen.go.kr',
  'pen.go.kr',
  'dge.go.kr',
  'ice.go.kr',
  'gen.go.kr',
  'dje.go.kr',
  'use.go.kr',
  'sje.go.kr',
  'goe.go.kr',
  'gwe.go.kr',
  'cbe.go.kr',
  'cne.go.kr',
  'jbe.go.kr',
  'jne.go.kr',
  'gbe.kr',
  'gne.go.kr',
  'jje.go.kr',
  'jbedu.kr',
  'edukit.co.kr',
  'korea.kr',
];

const developmentAllowedDomains: string[] = [...allowedDomains, 'naver.com', 'gmail.com'];

export const getValidDomains = (): string[] => {
  const isDevelopment =
    process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_APP_ENV === 'development';

  return isDevelopment ? developmentAllowedDomains : allowedDomains;
};

export const subjects: { value: string; label: string }[] = [
  { value: '국어', label: '국어' },
  { value: '영어', label: '영어' },
  { value: '수학', label: '수학' },
  { value: '도덕', label: '도덕' },
  { value: '사회', label: '사회' },
  { value: '역사', label: '역사' },
  { value: '한국사', label: '한국사' },
  { value: '과학', label: '과학' },
  { value: '기술/가정', label: '기술/가정' },
  { value: '체육', label: '체육' },
  { value: '음악', label: '음악' },
  { value: '미술', label: '미술' },
  { value: '한문', label: '한문' },
  { value: '중국어', label: '중국어' },
  { value: '일본어', label: '일본어' },
  { value: '회계/경영', label: '회계/경영' },
  { value: '정보', label: '정보' },
  { value: '토목', label: '토목' },
  { value: '건축', label: '건축' },
  { value: '기계', label: '기계' },
  { value: '전기/전자', label: '전기/전자' },
  { value: '보건', label: '보건' },
  { value: '조리', label: '조리' },
  { value: '관광', label: '관광' },
  { value: '제과', label: '제과' },
];
