import Header from '@/components/header/header';
import { SidebarProvider, SidebarTrigger } from '@/components/sidebar/base-sidebar';
import MainSidebar from '@/components/sidebar/main-sidebar';

export default function RecordLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <SidebarProvider>
        <MainSidebar />
        <SidebarTrigger className="fixed left-2 top-[72px]" />
        <main className="h-[calc(100vh-64px)] w-full overflow-y-auto p-10">{children}</main>
      </SidebarProvider>
    </>
  );
}
