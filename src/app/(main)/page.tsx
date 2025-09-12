import { Users, FileText, Shield, Clock, CheckCircle } from 'lucide-react';

import Image from 'next/image';
import Link from 'next/link';

import { createPageMetadata } from '@/shared/constants/metadata';

import landingPageImage from '../../../public/images/landing-page-image.png';

export const metadata = createPageMetadata('home');

export default function Page() {
  const features = [
    {
      icon: <FileText className="h-8 w-8 text-blue-600" />,
      title: 'AI 기반 생활기록부 작성',
      description: 'AI가 도와주는 스마트한 생활기록부 작성으로 시간을 절약하고 완성도를 높입니다.',
    },
    {
      icon: <Users className="h-8 w-8 text-green-600" />,
      title: '체계적인 학생 관리',
      description:
        '학생 정보를 한곳에서 관리하고, 필터링 기능으로 각 학생의 활동 기록을 쉽게 관리할 수 있습니다.',
    },
    {
      icon: <Clock className="h-8 w-8 text-purple-600" />,
      title: '시간 단축',
      description: '반복 작업을 자동화하여 교육에 더 집중할 수 있는 시간을 확보합니다.',
    },
    {
      icon: <Shield className="h-8 w-8 text-red-600" />,
      title: '안전한 데이터 관리',
      description: '학생 정보를 안전하게 보호합니다.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <section className="relative mx-auto max-w-7xl px-4 pb-16 pt-20">
        <div className="flex flex-col items-center justify-center gap-5">
          <h1 className="text-4xl font-bold text-gray-900 md:text-6xl">
            교사를 위한 <span className="text-blue-600">AI 업무 도우미</span>
          </h1>

          <p className="mx-auto max-w-3xl text-xl text-gray-600 md:text-2xl">
            생활기록부 작성부터 학생 관리까지, AI가 도와주는 스마트한 교육 도구
          </p>

          <div className="flex justify-center">
            <Image src={landingPageImage} alt="랜딩 페이지 이미지" width={1000} />
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
              왜 Edukit을 선택해야 할까요?
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-gray-600">
              교육 현장의 실제 니즈를 반영한 실용적인 기능들로 선생님들의 업무를 지원합니다.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="rounded-xl bg-gray-50 p-6 transition-shadow hover:shadow-lg"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="mb-3 text-xl font-semibold text-gray-900">{feature.title}</h3>
                <p className="leading-relaxed text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">주요 서비스</h2>
          </div>

          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
            <div className="rounded-2xl bg-white p-8 shadow-lg transition-shadow hover:shadow-xl">
              <div className="mb-6">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="mb-4 text-2xl font-bold text-gray-900">나의 학생 관리</h3>
                <p className="mb-6 leading-relaxed text-gray-600">
                  학생 정보를 체계적으로 관리하고, 학업 성취도, 교내외 활동, 봉사활동 기록 등을
                  한눈에 파악할 수 있습니다.
                </p>
              </div>

              <div className="mb-6 space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700">엑셀 파일로 일괄 학생 등록</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700">
                    학년, 반, 번호별 필터링 기능을 통한 체계적 관리
                  </span>
                </div>
              </div>
              <Link href="/manage-student">
                <div className="w-full rounded-lg bg-green-600 py-3 text-center font-semibold text-white transition-colors hover:bg-green-700">
                  학생 관리 시작하기
                </div>
              </Link>
            </div>

            <div className="rounded-2xl bg-white p-8 shadow-lg transition-shadow hover:shadow-xl">
              <div className="mb-6">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                  <FileText className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="mb-4 text-2xl font-bold text-gray-900">생활기록부 작성</h3>
                <p className="mb-6 leading-relaxed text-gray-600">
                  학생 정보만 입력하면 3가지의 AI 추천 문구를 제공하여, 쉽고 빠르게 완성도 높은
                  생활기록부를 작성할 수 있습니다.
                </p>
              </div>

              <div className="mb-6 space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-blue-500" />
                  <span className="text-gray-700">AI 기반 문구 추천</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-blue-500" />
                  <span className="text-gray-700">항목별 작성 가이드</span>
                </div>
              </div>

              <Link href="/write-subject">
                <div className="w-full rounded-lg bg-blue-600 py-3 text-center font-semibold text-white transition-colors hover:bg-blue-700">
                  학생 관리 시작하기
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 py-12 text-center text-gray-4">
        <p>&copy; 2025 Edukit. All rights reserved.</p>
      </footer>
    </div>
  );
}
