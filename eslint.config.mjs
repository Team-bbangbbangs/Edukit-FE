// @ts-check

import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import * as pluginImport from 'eslint-plugin-import';

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  pluginReact.configs.flat['jsx-runtime'],

  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        typescript: {}, // tsconfig.json 기준으로 모듈 해석
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      react: pluginReact,
      'react-hooks': reactHooks,
      import: pluginImport,
    },
    rules: {
      // JavaScript & TypeScript 일반 규칙
      'no-var': 'error', // var 대신 let/const 사용
      'prefer-const': 'warn', // const로 선언 가능한 경우 const 사용 권장
      eqeqeq: ['error', 'always'], // ==, != 대신 ===, !== 사용

      // React 관련 규칙
      'react/self-closing-comp': 'error', // 빈 요소는 <Comp />로 작성
      'react/jsx-no-leaked-render': ['warn', { validStrategies: ['ternary'] }], // 조건부 undefined 반환 방지

      // React Hooks 관련 규칙
      'react-hooks/rules-of-hooks': 'error', // use* 훅은 컴포넌트나 커스텀 훅에서만 호출
      'react-hooks/exhaustive-deps': 'warn', // useEffect 의존성 배열 검사

      // ✅ TypeScript 관련 규칙
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }], // 미사용 변수 경고 (단, _로 시작한 변수는 무시)
      '@typescript-eslint/no-explicit-any': 'warn', // any 사용 시 경고
      '@typescript-eslint/explicit-function-return-type': 'off', // 함수 리턴 타입 생략 허용
      '@typescript-eslint/consistent-type-imports': 'error', // type import는 import type으로 일관

      // import 정렬 및 구조
      'import/order': [
        'error',
        {
          groups: [
            'builtin', // Node.js 내장 모듈 (fs, path 등)
            'external', // 외부 패키지
            'internal', // alias (@/...)
            ['parent', 'sibling', 'index'], // 상대 경로 import
            'type', // 타입 import
          ],
          pathGroups: [
            {
              pattern: 'react{,/**}',
              group: 'external',
              position: 'before', // React는 외부 라이브러리 중 최상단
            },
            {
              pattern: 'next{*,*/**}',
              group: 'external',
              position: 'after', // Next.js는 React 뒤에 위치
            },
            {
              pattern: '@/**',
              group: 'internal',
              position: 'after', // 내부 모듈은 외부 라이브러리 뒤
            },
          ],
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
          pathGroupsExcludedImportTypes: ['builtin', 'index'],
          'newlines-between': 'always', // 각각 그룹마다 띄어쓰기 적용
        },
      ],
      'import/no-unresolved': 'error', // 잘못된 import 경로 방지
      'import/no-duplicates': 'error', // 같은 파일 중복 import 방지
    },
  },
];
