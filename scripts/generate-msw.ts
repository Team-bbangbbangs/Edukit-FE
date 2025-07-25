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
  const hasBody = ['POST', 'PATCH', 'PUT'].includes(method);

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
        status: 200,
        code: 'EDMT-200',
        message: '성공 메세지 작성',
      },
      { status: 200 }
    );
  }),
];`;

  return template;
}

// 파일 경로를 도메인과 상대 경로로 분리

function parseFilePath(inputPath: string): { domain: string; fileName: string } {
  const parts = inputPath.split('/');

  if (parts.length < 3) {
    throw new Error('파일 경로는 최소 "domain/apis/filename.ts" 형태여야 합니다.');
  }

  const domain = parts[0];
  const fileName = path.basename(inputPath, path.extname(inputPath));

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
  } catch (error) {
    console.error('오류 발생:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

// 스크립트 실행
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
