import React from 'react';

import { cn } from '@/shared/lib/utils';

import CheckIcon from '../../../../../public/svgs/ic_16_check.svg';
import AddIcon from '../../../../../public/svgs/ic_18_add.svg';
import ChevronUpIcon from '../../../../../public/svgs/ic_18_chevron-up.svg';
import CloseIcon from '../../../../../public/svgs/ic_18_close.svg';
import ChevronDownIcon from '../../../../../public/svgs/ic_20_chevron-down.svg';
import FilterIcon from '../../../../../public/svgs/ic_20_filter.svg';
import SearchIcon from '../../../../../public/svgs/ic_20_search.svg';
import BoxCheckedIcon from '../../../../../public/svgs/ic_24_box_checked.svg';
import BoxDefaultIcon from '../../../../../public/svgs/ic_24_box_default.svg';
import CopyIcon from '../../../../../public/svgs/ic_24_copy.svg';
import DownloadIcon from '../../../../../public/svgs/ic_24_download.svg';
import SidebarCloseIcon from '../../../../../public/svgs/ic_24_sidebar_close.svg';
import UploadIcon from '../../../../../public/svgs/ic_24_upload.svg';
import LogoIcon from '../../../../../public/svgs/logo.svg';

type IconType = 'fill' | 'stroke';

export type IconColor =
  | 'text-gray-white'
  | 'text-gray-1'
  | 'text-gray-2'
  | 'text-gray-3'
  | 'text-gray-4'
  | 'text-gray-5'
  | 'text-gray-black'
  | 'text-blue-50'
  | 'text-blue-100'
  | 'text-blue-200'
  | 'text-blue-300'
  | 'text-blue-400'
  | 'text-blue-500'
  | 'text-blue-600'
  | 'text-blue-700'
  | 'text-blue-800'
  | 'text-blue-900'
  | 'text-blue-950'
  | 'text-brand-skyblue'
  | 'text-brand-pink'
  | 'text-brand-orange'
  | 'text-brand-green'
  | 'text-brand-purple'
  | 'text-brand-dim'
  | 'text-brand-red';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  color?: IconColor;
  hoverColor?: IconColor;
  className?: string;
}

const COLOR_MAP: Record<string, string> = {
  'text-gray-white': '#ffffff',
  'text-gray-1': '#f9fafb',
  'text-gray-2': '#dedede',
  'text-gray-3': '#C2C2C2',
  'text-gray-4': '#868686',
  'text-gray-5': '#464646',
  'text-gray-black': '#121212',
  'text-blue-50': '#F0F4FE',
  'text-blue-100': '#DCE5FD',
  'text-blue-200': '#C2D3F8',
  'text-blue-300': '#98B7F8',
  'text-blue-400': '#5484f2',
  'text-blue-500': '#436BEE',
  'text-blue-600': '#2D4CE3',
  'text-blue-700': '#2539D0',
  'text-blue-800': '#2430A9',
  'text-blue-900': '#232E85',
  'text-blue-950': '#1A1E51',
  'text-brand-skyblue': '#D8EEFF',
  'text-brand-pink': '#FFDEEE',
  'text-brand-orange': '#FDE3D2',
  'text-brand-green': '#D9F4D7',
  'text-brand-purple': '#F0E4FC',
  'text-brand-dim': '#121212',
  'text-brand-red': '#F25454',
};

const getColorValue = (colorClass?: string) =>
  colorClass ? COLOR_MAP[colorClass] || 'currentColor' : 'currentColor';

const BaseIcon = React.forwardRef<
  SVGSVGElement,
  IconProps & { IconComponent: React.ComponentType<any>; iconType: IconType }
>(({ IconComponent, size, color, hoverColor, iconType, className, style, ...props }, ref) => {
  const normalColor = getColorValue(color);
  const hoverColorValue = getColorValue(hoverColor) || normalColor;

  const styleProps =
    iconType === 'fill' ? { fill: normalColor } : { stroke: normalColor, fill: 'none' };

  const hoverStyleProps =
    iconType === 'fill' ? { fill: hoverColorValue } : { stroke: hoverColorValue, fill: 'none' };

  return (
    <IconComponent
      ref={ref}
      width={size}
      height={size}
      className={className}
      style={{ ...styleProps, ...style }}
      onMouseEnter={
        hoverColor
          ? (e: React.MouseEvent<SVGSVGElement>) => {
              Object.assign(e.currentTarget.style, hoverStyleProps);
            }
          : undefined
      }
      onMouseLeave={
        hoverColor
          ? (e: React.MouseEvent<SVGSVGElement>) => {
              Object.assign(e.currentTarget.style, styleProps);
            }
          : undefined
      }
      {...props}
    />
  );
});
BaseIcon.displayName = 'BaseIcon';

const createIcon = (
  IconComponent: React.ComponentType<any>,
  defaultSize: number,
  iconType: IconType = 'fill',
  displayName?: string,
) => {
  const IconWrapper = React.forwardRef<SVGSVGElement, IconProps>(
    ({ size = defaultSize, ...props }, ref) => (
      <BaseIcon
        ref={ref}
        IconComponent={IconComponent}
        size={size}
        iconType={iconType}
        {...props}
      />
    ),
  );

  IconWrapper.displayName = displayName || 'IconWrapper';

  return IconWrapper;
};

export const Add = createIcon(AddIcon, 18, 'fill', 'Add');
export const Close = createIcon(CloseIcon, 18, 'fill', 'Close');
export const Check = createIcon(CheckIcon, 16, 'fill', 'Check');
export const BoxDefault = createIcon(BoxDefaultIcon, 24, 'fill', 'BoxDefault');
export const BoxChecked = createIcon(BoxCheckedIcon, 24, 'fill', 'BoxChecked');
export const Upload = createIcon(UploadIcon, 24, 'fill', 'Upload');
export const Download = createIcon(DownloadIcon, 24, 'fill', 'Download');
export const Search = createIcon(SearchIcon, 20, 'fill', 'Search');
export const SidebarClose = createIcon(SidebarCloseIcon, 24, 'fill', 'SidebarClose');
export const Copy = createIcon(CopyIcon, 24, 'fill', 'Copy');

export const ChevronUp = createIcon(ChevronUpIcon, 18, 'stroke', 'ChevronUp');
export const ChevronDown = createIcon(ChevronDownIcon, 20, 'stroke', 'ChevronDown');
export const Filter = createIcon(FilterIcon, 20, 'stroke', 'Filter');

export const Logo = React.forwardRef<SVGSVGElement, IconProps>(
  ({ size, color, className, style, ...props }, ref) => (
    <LogoIcon
      ref={ref}
      width={size}
      height={size}
      className={cn(className)}
      style={color ? { color: getColorValue(color), ...style } : style}
      {...props}
    />
  ),
);
Logo.displayName = 'Logo';

export const Icons = {
  Add,
  Close,
  Check,
  BoxDefault,
  BoxChecked,
  Upload,
  Download,
  ChevronUp,
  ChevronDown,
  Filter,
  Logo,
  Search,
  SidebarClose,
  Copy,
} as const;

export type IconName = keyof typeof Icons;
export type IconComponent = React.ForwardRefExoticComponent<
  IconProps & React.RefAttributes<SVGSVGElement>
>;
