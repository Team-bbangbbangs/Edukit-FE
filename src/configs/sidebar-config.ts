import { Home, Inbox, Calendar } from 'lucide-react';

interface SidebarChildConfig {
  title: string;
  url: string;
}

interface CollapsibleSidebarItem {
  type: 'collapsible';
  title: string;
  icon: React.ElementType;
  children: SidebarChildConfig[];
}

interface LinkSidebarItem {
  type: 'link';
  title: string;
  icon: React.ElementType;
  url: string;
}

export type SidebarItem = CollapsibleSidebarItem | LinkSidebarItem;

export const SIDEBAR_CONFIG: SidebarItem[] = [
  {
    type: 'collapsible',
    title: '나의 학생 관리',
    icon: Home,
    children: [
      { title: '세부능력 및 특기사항', url: '/manage-subject' },
      { title: '행동특성 및 종합의견', url: '/manage-behavior' },
      { title: '창의적 체험활동 - 진로', url: '/manage-career' },
      { title: '창의적 체험활동 - 자율', url: '/manage-free' },
      { title: '창의적 체험활동 - 동아리', url: '/manage-club' },
    ],
  },
  {
    type: 'collapsible',
    title: '학교생활기록부 작성',
    icon: Inbox,
    children: [
      { title: '세부능력 및 특기사항', url: '/write-subject' },
      { title: '행동특성 및 종합의견', url: '/write-behavior' },
      { title: '창의적 체험활동 - 진로', url: '/write-career' },
      { title: '창의적 체험활동 - 자율', url: '/write-free' },
      { title: '창의적 체험활동 - 동아리', url: '/write-club' },
    ],
  },
  {
    type: 'link',
    title: '공지사항',
    url: '/notice',
    icon: Calendar,
  },
];
