import nextJest from 'next/jest.js';

import type { Config } from 'jest';

const createJestConfig = nextJest({ dir: './' });

// Jest에 전달할 사용자 정의 설정
const config: Config = {
  // 각 테스트 실행 전에 실행할 설정 파일
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

  // 테스트 환경 설정 (브라우저 환경 시뮤레이션)
  testEnvironment: 'jest-environment-jsdom',

  // E2E 테스트 디렉토리는 제외
  testPathIgnorePatterns: ['<rootDir>/tests/', '<rootDir>/.next/', '<rootDir>/node_modules/'],

  // 모듈 경로 매핑 (절대 경로 사용을 위함)
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },

  // 테스트 파일 패턴
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{test,spec}.{js,jsx,ts,tsx}',
  ],

  // 커버리지 수집 대상
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/index.{js,jsx,ts,tsx}',
  ],

  // 커버리지 임계값 설정
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};

export default createJestConfig(config);
