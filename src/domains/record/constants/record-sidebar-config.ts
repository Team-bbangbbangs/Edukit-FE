interface SidebarChildConfig {
  title: string;
  url: string;
}

interface CollapsibleSidebarItem {
  type: 'collapsible';
  title: string;
  children: SidebarChildConfig[];
}

interface LinkSidebarItem {
  type: 'link';
  title: string;
  url: string;
}

export type RecordSidebarItem = CollapsibleSidebarItem | LinkSidebarItem;

export const RECORD_SIDEBAR_CONFIG: RecordSidebarItem[] = [
  {
    type: 'link',
    title: '학생 관리',
    url: '/manage-student',
  },
  {
    type: 'collapsible',
    title: '생활기록부 작성',
    children: [
      { title: '세부능력 및 특기사항', url: '/write-subject' },
      { title: '행동특성 및 종합의견', url: '/write-behavior' },
      { title: '창의적 체험활동 - 진로', url: '/write-career' },
      { title: '창의적 체험활동 - 자율', url: '/write-free' },
      { title: '창의적 체험활동 - 동아리', url: '/write-club' },
    ],
  },
  {
    type: 'collapsible',
    title: '생활기록부 관리',
    children: [
      { title: '세부능력 및 특기사항', url: '/manage-subject' },
      { title: '행동특성 및 종합의견', url: '/manage-behavior' },
      { title: '창의적 체험활동 - 진로', url: '/manage-career' },
      { title: '창의적 체험활동 - 자율', url: '/manage-free' },
      { title: '창의적 체험활동 - 동아리', url: '/manage-club' },
    ],
  },
];
