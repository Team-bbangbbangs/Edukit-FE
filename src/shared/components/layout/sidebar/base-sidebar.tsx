'use client';

import * as React from 'react';

import { PanelLeft } from 'lucide-react';

import Link from 'next/link';

import { Icons } from '@/shared/components/ui/icon/icon';
import { cn } from '@/shared/lib/utils';

import { Collapsible, CollapsibleTrigger, CollapsibleContent } from './collapsible';

const SIDEBAR_WIDTH = '325px';

type SidebarContextProps = {
  state: 'expanded' | 'collapsed';
  open: boolean;
  setOpen: (open: boolean) => void;
};

const SidebarContext = React.createContext<SidebarContextProps | null>(null);

function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider.');
  }

  return context;
}

const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & {
    defaultOpen?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
  }
>(
  (
    {
      defaultOpen = true,
      open: openProp,
      onOpenChange: setOpenProp,
      className,
      style,
      children,
      ...props
    },
    ref,
  ) => {
    const [_open, _setOpen] = React.useState(defaultOpen);
    const open = openProp ?? _open;

    const setOpen = React.useCallback(
      (value: boolean | ((value: boolean) => boolean)) => {
        const openState = typeof value === 'function' ? value(open) : value;
        if (setOpenProp) {
          setOpenProp(openState);
        } else {
          _setOpen(openState);
        }
      },
      [setOpenProp, open],
    );
    const state = open ? 'expanded' : 'collapsed';

    const contextValue = React.useMemo<SidebarContextProps>(
      () => ({
        state,
        open,
        setOpen,
      }),
      [state, open, setOpen],
    );

    return (
      <SidebarContext.Provider value={contextValue}>
        <div
          style={
            {
              '--sidebar-width': SIDEBAR_WIDTH,
              ...style,
            } as React.CSSProperties
          }
          className={cn(
            'group/sidebar-wrapper flex w-full has-[[data-variant=inset]]:bg-sidebar',
            className,
          )}
          ref={ref}
          {...props}
        >
          {children}
        </div>
      </SidebarContext.Provider>
    );
  },
);
SidebarProvider.displayName = 'SidebarProvider';

const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & {
    side?: 'left' | 'right';
  }
>(({ side = 'left', className, children, ...props }, ref) => {
  const { state, open } = useSidebar();

  return (
    <div
      ref={ref}
      className="group peer text-sidebar-foreground"
      data-state={state}
      data-side={side}
    >
      <div
        className={cn(
          'relative bg-transparent transition-[width] duration-200 ease-linear',
          open ? 'w-[--sidebar-width]' : 'w-0',
          side === 'right' && 'order-2',
        )}
      />
      <div
        className={cn(
          'fixed z-10 flex h-svh w-[--sidebar-width] transition-[left,right,transform] duration-200 ease-linear',
          side === 'left'
            ? cn('left-0', open ? 'translate-x-0' : '-translate-x-full')
            : cn('right-0', open ? 'translate-x-0' : 'translate-x-full'),
          className,
        )}
        {...props}
      >
        <div data-sidebar="sidebar" className="relative flex h-full w-full flex-col pt-[60px]">
          {children}
        </div>
      </div>
    </div>
  );
});
Sidebar.displayName = 'Sidebar';

const SidebarTrigger = React.forwardRef<HTMLButtonElement, React.ComponentProps<'button'>>(
  ({ className, onClick, children, ...props }, ref) => {
    const { open, setOpen } = useSidebar();

    return (
      <button
        ref={ref}
        data-sidebar="trigger"
        className={cn('flex items-center justify-center', className)}
        onClick={(event) => {
          setOpen(!open);
          onClick?.(event);
        }}
        {...props}
      >
        {children || (
          <>
            <PanelLeft />
            <span className="sr-only">Toggle Sidebar</span>
          </>
        )}
      </button>
    );
  },
);
SidebarTrigger.displayName = 'SidebarTrigger';

const SidebarMenu = React.forwardRef<HTMLUListElement, React.ComponentProps<'ul'>>(
  ({ className, ...props }, ref) => (
    <ul
      ref={ref}
      data-sidebar="menu"
      className={cn('flex w-full min-w-0 flex-col', className)}
      {...props}
    />
  ),
);
SidebarMenu.displayName = 'SidebarMenu';

const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<'li'> & {
    url?: string;
    isActive?: boolean;
    onClick?: () => void;
  }
>(({ className, url, isActive, onClick, children, ...props }, ref) => {
  const content = (
    <div
      className={cn(
        'w-full cursor-pointer rounded-lg px-5 py-3 text-left text-label-18 transition-colors duration-200 hover:bg-gray-1',
        isActive && 'bg-gray-1',
      )}
    >
      <span>{children}</span>
    </div>
  );

  return (
    <li
      ref={ref}
      data-sidebar="menu-item"
      className={cn('group/menu-item relative', className)}
      {...props}
    >
      {url ? (
        <Link href={url} className="flex w-full items-center px-6 py-2" onClick={onClick}>
          {content}
        </Link>
      ) : (
        <div className="flex w-full items-center px-6 py-2" onClick={onClick}>
          {content}
        </div>
      )}
    </li>
  );
});
SidebarMenuItem.displayName = 'SidebarMenuItem';

const SidebarMenuSub = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<'ul'> & {
    title: string;
    isActive?: boolean;
    children: React.ReactNode;
  }
>(({ title, isActive, children, className, ...props }, ref) => {
  const [isOpen, setIsOpen] = React.useState(true);

  return (
    <li className="group/menu-item relative">
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="group/collapsible">
        <div className="flex w-full items-center px-6 py-2">
          <CollapsibleTrigger asChild>
            <button
              className={cn(
                'flex w-full items-center justify-between rounded-lg px-5 py-3 text-left text-label-18 transition-colors duration-200 hover:bg-gray-1',
                isActive && 'bg-gray-1',
              )}
            >
              <span>{title}</span>
              <Icons.ChevronDown
                color="text-gray-black"
                size={20}
                className={cn(
                  'transition-transform duration-200',
                  isOpen ? 'rotate-180' : 'rotate-0',
                )}
              />
            </button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent>
          <ul
            ref={ref}
            data-sidebar="menu-sub"
            className={cn('flex w-full flex-col', className)}
            {...props}
          >
            {children}
          </ul>
        </CollapsibleContent>
      </Collapsible>
    </li>
  );
});

SidebarMenuSub.displayName = 'SidebarMenuSub';

const SidebarMenuSubItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<'li'> & {
    url?: string;
    isActive?: boolean;
    onClick?: () => void;
  }
>(({ url, isActive, onClick, children, ...props }, ref) => {
  const contentClasses = cn(
    'rounded-lg px-5 py-3 text-left text-body-18-m text-gray-4 transition-colors duration-200 hover:bg-gray-1 hover:text-black',
    isActive && 'text-black',
  );

  const wrapperClasses = 'flex items-center pl-8 pr-4';

  return (
    <li ref={ref} {...props}>
      <div className={wrapperClasses}>
        {url ? (
          <Link href={url} onClick={onClick} className={contentClasses}>
            <span>{children}</span>
          </Link>
        ) : (
          <div onClick={onClick} className={contentClasses}>
            <span>{children}</span>
          </div>
        )}
      </div>
    </li>
  );
});
SidebarMenuSubItem.displayName = 'SidebarMenuSubItem';

export {
  Sidebar,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
};
