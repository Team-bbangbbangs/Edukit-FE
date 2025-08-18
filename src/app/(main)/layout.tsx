import Header from '@/shared/components/layout/header/header';
import { SidebarProvider, SidebarTrigger } from '@/shared/components/layout/sidebar/base-sidebar';
import MainSidebar from '@/shared/components/layout/sidebar/main-sidebar';

export default function RecordLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen overflow-hidden">
      <SidebarProvider>
        <SidebarTrigger className="fixed left-1 top-[10px] z-20 md:left-2 md:top-[72px]" />
        <Header />
        <MainSidebar />
        <div className={`h-[calc(100vh-64px)] w-full overflow-y-auto p-2 md:p-10`}>{children}</div>
      </SidebarProvider>
    </main>
  );
}
