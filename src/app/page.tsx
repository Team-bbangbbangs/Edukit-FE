import Image from 'next/image';
import Link from 'next/link';

import landingPageImage from '../../public/images/landing-page-image.png';

export default function Page() {
  return (
    <article className="flex flex-col items-center justify-center gap-8">
      <Image src={landingPageImage} alt="랜딩 페이지 이미지" width={1000} />
      <div className="flex max-w-[1000px] gap-4">
        <Link
          href="/manage-subject"
          className="rounded-md border border-slate-400 p-4 hover:bg-slate-100"
        >
          <h3 className="mb-4 text-[20px] font-bold">나의 학생 관리</h3>
          <p className="text-slate-700">
            학생 정보를 체계적으로 관리하고, 학업 성취도, 교내외 활동, 봉사활동 기록 등을 한눈에
            파악할 수 있습니다.
          </p>
        </Link>
        <Link
          href="/write-subject"
          className="rounded-md border border-slate-400 p-4 hover:bg-slate-100"
        >
          <h3 className="mb-4 text-[20px] font-bold">생기부 작성 기능</h3>
          <p className="text-slate-700">
            각 항목별 작성 가이드라인과 예시 문구를 제공하여, 쉽고 빠르게 완성도 높은 생활기록부를
            작성할 수 있습니다.
          </p>
        </Link>
      </div>
    </article>
  );
}
