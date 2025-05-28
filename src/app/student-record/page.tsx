import { SidebarProvider, SidebarTrigger } from '@/components/sidebar/base-sidebar';
import MainSidebar from '@/components/sidebar/main-sidebar';

export default function Page() {
  return (
    <SidebarProvider>
      <MainSidebar />
      <SidebarTrigger />
    </SidebarProvider>
  );
}
