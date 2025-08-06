import nextJest from 'next/jest.js';

import type { Config } from 'jest';

const createJestConfig = nextJest({ dir: './' });

// Jest에 전달할 사용자 정의 설정
const config: Config = {
  // 테스트 환경 설정
  testEnvironment: 'jest-fixed-jsdom',

  // js DOM 가져오기 가능
  testEnvironmentOptions: {
    customExportConditions: [''],
  },

  // 각 테스트 실행 전에 실행할 설정 파일
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

  // E2E 테스트 디렉토리는 제외
  testPathIgnorePatterns: [
    '<rootDir>/tests/',
    '<rootDir>/.next/',
    '<rootDir>/node_modules/',
    '/node_modules/',
    '/.next/',
    // CodeBuild 환경에서의 절대 경로도 고려
    '.*/tests/',
    '.*/.next/',
    '.*/node_modules/',
  ],

  // 모듈 경로 매핑
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },

  // 테스트 파일 패턴
  testMatch: [
    '<rootDir>/src/domains/**/__tests__/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/domains/**/*.test.{js,jsx,ts,tsx}',
    '<rootDir>/src/domains/**/*.spec.{js,jsx,ts,tsx}',
    // CodeBuild 환경에서도 동작하도록 절대 경로 패턴 추가
    '**/src/domains/**/__tests__/*.{js,jsx,ts,tsx}',
    '**/src/domains/**/*.test.{js,jsx,ts,tsx}',
    '**/src/domains/**/*.spec.{js,jsx,ts,tsx}',
  ],

  // 테스트가 없을 때 성공으로 처리
  passWithNoTests: true,

  // 테스트 실행 타임아웃 설정
  testTimeout: 30000,

  // 캐시 설정
  cache: false,

  // verbose 모드로 더 자세한 정보 출력
  verbose: true,
};

export default createJestConfig(config);
