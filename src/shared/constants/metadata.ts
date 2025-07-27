import type { Metadata } from 'next';

const SITE_CONFIG = {
  name: 'Edukit',
  url: 'https://edukit.co.kr',
  ogImage: '/og-image.png',
} as const;

export const METADATA_CONFIG = {
  home: {
    title: 'Edukit - 교사를 위한 AI 기반 업무 도움 서비스',
    description: '생활기록부 작성부터 수업 자료까지, AI가 도와주는 스마트한 교육 도구',
    keywords: '생활기록부, 학생관리, 수업 자료, 고민 상담, 커뮤니티',
    url: '/',
  },

  login: {
    title: '로그인 - Edukit',
    description: 'Edukit에 로그인하여 생활기록부 작성 및 수업 자료 공유를 시작하세요',
    keywords: '로그인, Edukit 접속',
    url: '/login',
  },

  signup: {
    title: '회원가입 - Edukit',
    description: 'Edukit 회원가입으로 업무에 도움을 받으세요',
    keywords: '회원가입, 교사 가입, Edukit 가입',
    url: '/signup',
  },

  verifyEmail: {
    title: '이메일 인증 - Edukit',
    description: '이메일 인증을 완료하여 Edukit 서비스를 안전하게 이용하세요',
    keywords: '이메일 인증, 계정 인증, 회원가입 완료',
    url: '/verify-email',
  },

  findPassword: {
    title: '비밀번호 찾기 - Edukit',
    description: '비밀번호를 안전하게 찾으세요',
    keywords: '비밀번호 찾기',
    url: '/find-password',
  },

  notice: {
    title: '공지사항 - Edukit',
    description: 'Edukit 서비스 공지사항, 업데이트 소식, 이벤트 정보를 확인하세요',
    keywords: '공지사항, 서비스 소식, 업데이트, 이벤트',
    url: '/notice',
  },

  manageStudent: {
    title: '학생 관리 - Edukit',
    description: '작성한 생활기록부를 한 번에 관리하세요',
    keywords: '생활기록부 관리',
    url: '/manage-subject',
  },

  writeRecords: {
    title: '생활기록부 작성 - Edukit',
    description: 'AI가 도와주는 생활기록부 작성으로 편리하게 생활기록부를 작성해보세요',
    keywords: '생활기록부 작성, AI 작성, 생기부 작성',
    url: '/write-subject',
  },

  myPage: {
    title: '마이페이지 - Edukit',
    description: '나의 정보를 쉽게 확인하고, 수정해보세요',
    keywords: '마이페이지, 정보 수정, 이메일 변경, 비밀번호 변경',
    url: '/mypage',
  },
} as const;

export function createPageMetadata(
  pageKey: keyof typeof METADATA_CONFIG,
  customData?: {
    title?: string;
    description?: string;
    url?: string;
  },
): Metadata {
  const config = METADATA_CONFIG[pageKey];
  const title = customData?.title || config.title;
  const description = customData?.description || config.description;
  const url = customData?.url || config.url;

  return {
    title,
    description,
    keywords: config.keywords.split(',').map((kw) => kw.trim()),

    openGraph: {
      title,
      description,
      url: url.startsWith('/') ? `${SITE_CONFIG.url}${url}` : `${SITE_CONFIG.url}/${url}`,
      siteName: SITE_CONFIG.name,
      images: [
        {
          url: SITE_CONFIG.ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'ko_KR',
      type: 'website',
    },

    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [SITE_CONFIG.ogImage],
    },
  };
}

export function createDynamicMetadata(
  basePageKey: keyof typeof METADATA_CONFIG,
  dynamicTitle: string,
  dynamicDescription: string,
  url: string,
): Metadata {
  return createPageMetadata(basePageKey, {
    title: `${dynamicTitle} - Edukit`,
    description: dynamicDescription,
    url,
  });
}
