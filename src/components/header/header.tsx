'use client';

import { useEffect, useRef, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { useAuth } from '@/contexts/auth/use-auth';

import { ProfileDropDown } from './profile-dropdown';
import ProfileImage from '../../../public/images/profile-image.png';

export default function Header() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { accessToken } = useAuth();

  const isLogIn = !!accessToken;

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
    <header className="fixed top-0 z-40 flex h-16 w-full justify-between border-b bg-white px-2 py-3 md:px-10">
      <Link href="/" className="ml-10 pt-1 text-2xl font-bold text-black md:ml-0">
        EduMate
      </Link>
      <div className="flex items-center gap-1 md:gap-4">
        <a
          href="https://walla.my/survey/tBoiYaly9xugPKLhAyRx"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-blue-600 px-4 py-2 text-white hover:bg-blue-800"
        >
          피드백 작성하기
        </a>
        <div className="relative">
          {isLogIn ? (
            <>
              <Image
                src={ProfileImage}
                alt="profile image"
                className="hover:cursor-pointer"
                onClick={() => setOpen((prev) => !prev)}
                width={40}
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
              className="flex h-10 items-center justify-center rounded-full bg-black px-6 text-white"
            >
              로그인
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
