'use client';

import { useEffect, useRef, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { ProfileDropDown } from '@/domains/profile/components/profile-dropdown';
import { useAuth } from '@/shared/providers/auth-provider';

import ProfileImage from '../../../../../public/images/profile-image.png';
import Logo from '../../../../../public/svgs/logo.svg';

const tabStyle = 'flex pt-6 mx-5 flex-col justify-between items-center whitespace-nowrap';

const tabs = [
  { label: 'AI 생활기록부 작성', path: '/manage-student' },
  { label: '커뮤니티', path: '/' },
  { label: '공지사항', path: '/notice' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { accessToken } = useAuth();
  const pathname = usePathname();

  const isLogIn = !!accessToken;

  const isActiveTab = (tabPath: string) => {
    if (tabPath === '/ai-record') {
      const recordPaths = [
        '/manage-subject',
        '/manage-behavior',
        '/manage-career',
        '/manage-free',
        '/manage-club',
        '/write-subject',
        '/write-behavior',
        '/write-career',
        '/write-free',
        '/write-club',
      ];
      return recordPaths.some((path) => pathname === path || pathname.startsWith(path + '/'));
    }
    return pathname === tabPath || pathname.startsWith(tabPath + '/');
  };

  const handleCloseDropdown = () => {
    setOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [open]);

  return (
    <header className="fixed top-0 z-30 flex h-[72px] w-full justify-center border-b border-b-gray-2 bg-white">
      <div className="flex w-[1440px] justify-between px-10">
        <div className="flex gap-4 lg:gap-40">
          <Link href="/" className="flex items-center">
            <Image
              src={Logo}
              alt="logo"
              width={126}
              height={28}
              className="h-[28px] w-[126px] object-contain"
            />
          </Link>
          <div className="flex">
            {tabs.map((tab, index) => {
              const isActive = isActiveTab(tab.path);

              return (
                <Link key={tab.path} href={tab.path} className={`${tabStyle} gap-1`}>
                  {index === 0 ? (
                    <div className="flex gap-1">
                      <span className="text-heading-18 text-blue-400">AI</span>
                      <span className="mt-[2px] text-label-18">생활기록부 작성</span>
                    </div>
                  ) : (
                    <span className="mt-[2px] text-label-18">{tab.label}</span>
                  )}

                  {isActive ? <div className="h-1 w-full bg-black" /> : null}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-1 md:gap-4">
          <a
            href="https://walla.my/survey/tBoiYaly9xugPKLhAyRx"
            target="_blank"
            rel="noopener noreferrer"
            className="whitespace-nowrap rounded-full bg-blue-600 px-4 py-2 text-white hover:bg-blue-800"
          >
            피드백 작성하기
          </a>
          <div className="relative">
            {isLogIn ? (
              <>
                <Image
                  src={ProfileImage}
                  alt="profile image"
                  onClick={() => setOpen((prev) => !prev)}
                  width={48}
                  height={48}
                  className="h-[48px] w-[48px] rounded-full object-cover hover:cursor-pointer"
                />
                {open ? (
                  <div ref={dropdownRef}>
                    <ProfileDropDown onClose={handleCloseDropdown} />
                  </div>
                ) : null}
              </>
            ) : (
              <Link
                href="/login"
                className="flex h-10 items-center justify-center whitespace-nowrap rounded-full bg-black px-6 text-white"
              >
                로그인
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
