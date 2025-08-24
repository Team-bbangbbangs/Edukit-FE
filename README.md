# Edukit 🎓

> 교사를 위한 AI 기반 생활기록부 작성 및 관리 서비스
<img width="1920" height="1080" alt="1111" src="https://github.com/user-attachments/assets/7e911bc5-27b8-4cad-b026-e4a42ed8e66e" />


## ✨ 주요 기능

- **🤖 AI 기반 생활기록부 작성**: AI가 도와주는 편리한 생기부 작성 기능
- **👥 학생 관리**: 작성한 생활기록부를 한 번에 관리
- **📢 공지사항**: 서비스 업데이트 및 이벤트 정보

## 🚀 기술 스택

- **Next.js 14**
- **TypeScript**
- **Tailwind CSS**
- **TanStack Query**
- **React Hook Form**
- **Zod**
- **Jest**
- **Testing Library**
- **Playwright**
- **MSW**

## 🏗️ 프로젝트 구조

```
src/
├── app/                    # Next.js App Router
├── domains/               # 도메인별 모듈
│   ├── auth/              # 인증 관련
│   ├── notice/            # 공지사항
│   ├── profile/           # 사용자 프로필
│   └── record/            # 생활기록부
├── shared/                # 공통 모듈
│   ├── components/        # 공통 컴포넌트
│   ├── lib/              # 유틸리티 함수
│   ├── providers/        # Context Providers
│   └── constants/        # 상수 정의
└── __tests__/            # 테스트 유틸리티

tests/                     # E2E 테스트
scripts/                   # 빌드/개발 스크립트
```
