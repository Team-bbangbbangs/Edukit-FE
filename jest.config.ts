import nextJest from 'next/jest.js';

import type { Config } from 'jest';

const createJestConfig = nextJest({ dir: './' });

// Jest에 전달할 사용자 정의 설정
const config: Config = {
  // 테스트 환경 설정 (브라우저 환경 시뮤레이션)
  testEnvironment: 'jest-fixed-jsdom',

  // js DOM 가져오기 가능
  testEnvironmentOptions: {
    customExportConditions: [''],
  },

  // 각 테스트 실행 전에 실행할 설정 파일
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

  // E2E 테스트 디렉토리는 제외
  testPathIgnorePatterns: ['<rootDir>/tests/', '<rootDir>/.next/', '<rootDir>/node_modules/'],

  // 모듈 경로 매핑 (절대 경로 사용을 위함)
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },

  // 테스트 파일 패턴
  testMatch: ['<rootDir>/src/domains/**/__tests__/*.{js,jsx,ts,tsx}'],
};

export default createJestConfig(config);
