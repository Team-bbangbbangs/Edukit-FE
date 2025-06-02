import Link from 'next/link';

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

import { Collapsible, CollapsibleTrigger, CollapsibleContent } from './collapsible';

export default function MainSidebar() {
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
                    <SidebarMenuButton>
                      <item.icon />
                      <span className="pt-1 text-[16px]">{item.title}</span>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.children.map((child) => (
                        <SidebarMenuSubItem key={child.title}>
                          <SidebarMenuSubButton asChild>
                            <Link href={child.url}>
                              <span className="pt-[2px] text-[14px]">{child.title}</span>
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
                <SidebarMenuButton asChild>
                  <Link href={item.url}>
                    <item.icon />
                    <span className="pt-1 text-[16px]">{item.title}</span>
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
