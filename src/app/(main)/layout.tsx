import Header from '@/shared/components/layout/header/header';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen overflow-hidden">
      <Header />
      <div className={`relative top-[72px] h-[calc(100vh-72px)] w-full overflow-y-auto`}>
        {children}
      </div>
    </main>
  );
}
