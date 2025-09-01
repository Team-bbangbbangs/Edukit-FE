'use client';

import { usePathname } from 'next/navigation';

import { RECORD_SIDEBAR_CONFIG } from '@/domains/record/constants/record-sidebar-config';
import {
  Sidebar,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from '@/shared/components/layout/sidebar/base-sidebar';
import { trackEvent } from '@/shared/lib/amplitude';

const eventMap: Record<string, string> = {
  '/manage-student': 'click_manageStudent',
  '/manage-subject': 'click_manageSubject',
  '/manage-behavior': 'click_manageBehavior',
  '/manage-career': 'click_manageCareer',
  '/manage-free': 'click_manageFree',
  '/manage-club': 'click_manageClub',
  '/write-subject': 'click_writeSubject',
  '/write-behavior': 'click_writeBehavior',
  '/write-career': 'click_writeCareer',
  '/write-free': 'click_writeFree',
  '/write-club': 'click_writeClub',
};

const handleMenuClick = (url: string) => {
  const eventName = eventMap[url];
  if (eventName) {
    trackEvent(eventName);
  }
};

export default function RecordSidebar() {
  const pathname = usePathname();

  const isActive = (url: string) => {
    return pathname === url || pathname.startsWith(url + '/');
  };

  const isParentActive = (children: Array<{ url: string }>) => {
    return children.some((child) => isActive(child.url));
  };

  return (
    <Sidebar className="bg-white">
      <SidebarMenu>
        {RECORD_SIDEBAR_CONFIG.map((item) =>
          item.type === 'collapsible' ? (
            <SidebarMenuSub
              key={item.title}
              title={item.title}
              isActive={isParentActive(item.children)}
            >
              {item.children.map((child) => (
                <SidebarMenuSubItem
                  key={child.title}
                  url={child.url}
                  isActive={isActive(child.url)}
                  onClick={() => handleMenuClick(child.url)}
                >
                  {child.title}
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          ) : (
            <SidebarMenuItem
              key={item.title}
              url={item.url}
              isActive={isActive(item.url)}
              onClick={() => handleMenuClick(item.url)}
            >
              {item.title}
            </SidebarMenuItem>
          ),
        )}
      </SidebarMenu>
    </Sidebar>
  );
}
