import RecordSidebar from '@/domains/record/components/sidebar/record-sidebar';
import { SidebarProvider } from '@/shared/components/layout/sidebar/base-sidebar';

export default function RecordLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <RecordSidebar />
      {children}
    </SidebarProvider>
  );
}
