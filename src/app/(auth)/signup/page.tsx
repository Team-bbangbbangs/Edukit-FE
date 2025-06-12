import Signup from '@/components/signup/signup';

export default function Page() {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-4">
      <h2 className="text-[26px] font-bold">회원가입</h2>
      <Signup />
    </div>
  );
}
