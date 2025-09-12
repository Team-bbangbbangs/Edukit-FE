export default function EmailSent() {
  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <div className="space-y-2 text-center">
        <p className="text-title-18 text-gray-black">비밀번호 재설정을 위한 이메일을 보냈습니다.</p>
        <p className="text-body-14-m text-gray-4">
          이메일의 링크를 클릭하여 비밀번호를 재설정해주세요.
        </p>
      </div>
    </div>
  );
}
