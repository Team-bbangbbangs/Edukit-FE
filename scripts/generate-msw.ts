// pnpm generate:msw [domain]/apis/[filename].ts 로 script 코드를 실행시키면 해당 파일을 파싱해서 msw 뼈대 코드를 만들어주는 스크립트
// ex) pnpm generate:msw auth/apis/ddd.ts

import fs from 'fs';
import path from 'path';

interface APIInfo {
  method: string;
  url: string;
  functionName: string;
}

// api 코드 추출 함수
function parseAPIFile(filePath: string): APIInfo | null {
  const content = fs.readFileSync(filePath, 'utf-8');

  const apiPattern =
    /(?:export\s+)?(?:const|function)\s+(\w+)\s*=?\s*async?\s*\([^)]*\)\s*(?::\s*[^{]+)?\s*=>\s*\{[\s\S]*?api\.(\w+)<[^>]*>\s*\(\s*['"`]([^'"`]+)['"`]/;
  const match = apiPattern.exec(content);

  if (match) {
    const [, functionName, method, url] = match;
    return {
      method,
      url,
      functionName,
    };
  }

  return null;
}

// msw 핸들러 코드 생성
function generateMSWHandler(apiInfo: APIInfo): string {
  const { method, url, functionName } = apiInfo;

  const handlerName = functionName.charAt(0).toLowerCase() + functionName.slice(1) || functionName;

  // 경로 파라미터가 있는지
  const hasParam = url.includes(':') || url.includes('${') ? ', params' : '';

  // body가 존재하는지
  const hasBody = ['post', 'patch', 'put'].includes(method.toLowerCase());

  let template = `import { http, HttpResponse } from 'msw';

export const ${handlerName} = [
  http.${method}('${url}', async ({ request${hasParam} }) => {`;

  if (hasBody) {
    template += `
    const body = await request.json();`;
  }

  if (hasParam) {
    template += `
    console.log('Path params:', params);`;
  }

  template += `

    return HttpResponse.json(
      {
        code: 'SUCCESS',
        message: '성공 메세지 작성',
      },
      { status: 200 }
    );
  }),
];`;

  return template;
}

// 새 핸들러를 기존 handlers.ts에 추가
function addToHandlersFile(domain: string, fileName: string) {
  const projectRoot = process.cwd();
  const handlersPath = path.join(projectRoot, 'src', 'shared', 'mocks', 'handlers.ts');

  const exportName = toCamelCase(fileName);
  const importPath = `../../domains/${domain}/mocks/${fileName}`;
  const newImport = `import { ${exportName} } from '${importPath}';`;
  const newHandler = `...${exportName}`;

  // 기존 파일 읽기
  let content = fs.readFileSync(handlersPath, 'utf-8');

  // import 구문 추가 (마지막 import 다음에)
  const lastImportMatch = content.match(/^import.*$/gm);
  if (lastImportMatch) {
    const lastImportIndex = content.lastIndexOf(lastImportMatch[lastImportMatch.length - 1]);
    const afterLastImport = lastImportIndex + lastImportMatch[lastImportMatch.length - 1].length;
    content = content.slice(0, afterLastImport) + `\n${newImport}` + content.slice(afterLastImport);
  } else {
    // import가 없으면 파일 맨 위에 추가
    content = `${newImport}\n\n${content}`;
  }

  // handlers 배열에 추가 (마지막 항목 뒤에)
  const handlersMatch = content.match(/export const handlers = \[([\s\S]*?)\];/);
  if (handlersMatch) {
    const handlersContent = handlersMatch[1].trim();
    let newHandlersContent;

    if (handlersContent) {
      // 기존 핸들러들이 있으면 끝에 추가
      newHandlersContent = `${handlersContent}\n  ${newHandler}`;
    } else {
      // 빈 배열이면 첫 번째로 추가
      newHandlersContent = `\n  ${newHandler},`;
    }

    content = content.replace(
      /export const handlers = \[([\s\S]*?)\];/,
      `export const handlers = [${newHandlersContent},\n];`,
    );
  }

  // 파일 저장
  fs.writeFileSync(handlersPath, content);
}

// 카멜케이스로 변환
function toCamelCase(str: string): string {
  return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}

// 파일 경로를 도메인과 상대 경로로 분리
function parseFilePath(inputPath: string): { domain: string; fileName: string } {
  const parts = inputPath.split('/');

  if (parts.length < 3) {
    throw new Error('파일 경로는 최소 "domain/apis/filename.ts" 형태여야 합니다.');
  }

  const domain = parts[0];
  let fileName = path.basename(inputPath, path.extname(inputPath));

  if (fileName.startsWith('use-')) {
    fileName = fileName.substring(4);
  }

  return {
    domain,
    fileName,
  };
}

async function main() {
  const args = process.argv.slice(2);

  const inputPath = args[0];

  try {
    // 파일 경로 파싱
    const { domain, fileName } = parseFilePath(inputPath);

    // 실제 API 파일 경로 구성
    const projectRoot = process.cwd();
    const apiFilePath = path.join(projectRoot, 'src', 'domains', inputPath);

    // API 파일 존재 확인
    if (!fs.existsSync(apiFilePath)) {
      console.error(`API 파일을 찾을 수 없습니다: ${apiFilePath}`);
      process.exit(1);
    }

    // API 정보 추출
    const apiInfo = parseAPIFile(apiFilePath);

    if (!apiInfo) {
      console.error(
        'API 함수를 찾을 수 없습니다. api.get, api.post 등을 사용하는 함수가 있는지 확인해주세요.',
      );
      process.exit(1);
    }

    // Mocks 디렉토리 경로
    const mocksDir = path.join(projectRoot, 'src', 'domains', domain, 'mocks');

    // MSW 핸들러 생성
    const handlerContent = generateMSWHandler(apiInfo);

    // 핸들러 파일 경로
    const handlerFilePath = path.join(mocksDir, `${fileName}.ts`);

    // 파일 작성
    fs.writeFileSync(handlerFilePath, handlerContent);
    console.log(`MSW 핸들러 생성 완료: src/domains/${domain}/mocks/${fileName}.ts`);

    // handlers.ts에 새 핸들러 추가
    console.log('\nhandlers.ts에 새 핸들러를 추가합니다.');
    addToHandlersFile(domain, fileName);
  } catch (error) {
    console.error('오류 발생:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

// 스크립트 실행
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
