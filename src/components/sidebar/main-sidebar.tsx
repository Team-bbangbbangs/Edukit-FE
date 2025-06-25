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
import { cn } from '@/lib/utils';

import { Collapsible, CollapsibleTrigger, CollapsibleContent } from './collapsible';

export default function MainSidebar() {
  const pathname = usePathname();

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
                            <Link href={child.url}>
                              <span
                                className={cn(
                                  'pt-[2px] text-[14px] transition-colors duration-200',
                                  isActive(child.url) && 'font-semibold',
                                )}
                              >
                                {child.title}
                              </span>
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
