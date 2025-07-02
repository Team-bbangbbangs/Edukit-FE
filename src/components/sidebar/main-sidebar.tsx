'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarTrigger,
  SidebarHeader,
} from '@/components/sidebar/base-sidebar';
import { SIDEBAR_CONFIG } from '@/configs/sidebar-config';
import { useAuth } from '@/contexts/auth/use-auth';
import { trackEvent } from '@/lib/amplitude/amplitude';
import { cn } from '@/lib/utils';

import { Collapsible, CollapsibleTrigger, CollapsibleContent } from './collapsible';

const eventMap: Record<string, string> = {
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

export default function MainSidebar() {
  const pathname = usePathname();
  const { accessToken } = useAuth();

  const isActive = (url: string) => {
    return pathname === url || pathname.startsWith(url + '/');
  };

  const isParentActive = (children: Array<{ url: string }>) => {
    return children.some((child) => isActive(child.url));
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarTrigger />
      </SidebarHeader>
      <SidebarContent>
        {SIDEBAR_CONFIG.map((item) => (
          <SidebarMenu key={item.title}>
            {item.type === 'collapsible' ? (
              <Collapsible defaultOpen className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      className={cn(
                        'transition-colors duration-200',
                        isParentActive(item.children) &&
                          'bg-slate-100 text-slate-700 hover:bg-slate-200',
                      )}
                    >
                      <item.icon
                        className={cn(
                          'transition-colors duration-200',
                          isParentActive(item.children) && 'text-slate-600',
                        )}
                      />
                      <span
                        className={cn(
                          'pt-1 text-[16px] transition-colors duration-200',
                          isParentActive(item.children) && 'font-semibold',
                        )}
                      >
                        {item.title}
                      </span>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.children.map((child) => (
                        <SidebarMenuSubItem key={child.title}>
                          <SidebarMenuSubButton
                            asChild
                            className={cn(
                              'transition-colors duration-200',
                              isActive(child.url) &&
                                'bg-slate-200 text-slate-800 hover:bg-slate-200',
                            )}
                          >
                            <Link
                              href={child.url}
                              onClick={() => {
                                const eventName = eventMap[child.url];
                                if (eventName) {
                                  trackEvent(eventName, accessToken);
                                }
                              }}
                            >
                              <span>{child.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ) : (
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className={cn(
                    'transition-colors duration-200',
                    isActive(item.url) && 'bg-slate-200 text-slate-700 hover:bg-slate-200',
                  )}
                >
                  <Link href={item.url}>
                    <item.icon
                      className={cn(
                        'transition-colors duration-200',
                        isActive(item.url) && 'text-slate-600',
                      )}
                    />
                    <span
                      className={cn(
                        'pt-1 text-[16px] transition-colors duration-200',
                        isActive(item.url) && 'font-semibold',
                      )}
                    >
                      {item.title}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
          </SidebarMenu>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
