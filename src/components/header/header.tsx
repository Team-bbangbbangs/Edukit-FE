'use client';

import { useEffect, useRef, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { ProfileDropDown } from './profile-dropdown';
import ProfileImage from '../../../public/images/profile-image.png';

export default function Header() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    <header className="fixed top-0 z-50 flex h-16 w-full justify-between border-b bg-white px-10 py-3">
      <Link href="/" className="pt-1 text-2xl font-bold text-black">
        EduMate
      </Link>
      {/* 로그인 연동 후 ui 수정 예정 */}
      <div className="relative flex">
        <Image
          src={ProfileImage}
          alt="profile image"
          className="hover:cursor-pointer"
          onClick={() => setOpen((prev) => !prev)}
        />
        {open ? (
          <div ref={dropdownRef}>
            <ProfileDropDown />
          </div>
        ) : null}
        <Link href="/login" className="rounded-full bg-black px-4 py-2 text-white">
          로그인
        </Link>
      </div>
    </header>
  );
}
