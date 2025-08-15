import { cn } from '@/shared/lib/utils';

export type ButtonVariant = 'fill' | 'stroke';
export type ButtonColor = 'primary' | 'secondary';
export type ButtonShape = 'pill' | 'rect';
export type ButtonSize = 'large' | 'medium' | 'small';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  color?: ButtonColor;
  shape?: ButtonShape;
  size?: ButtonSize;
  asChild?: boolean;
}

const baseStyles = 'inline-flex items-center justify-center cursor-pointer';

const shapeStyles: Record<ButtonShape, string> = {
  pill: 'rounded-[36px]',
  rect: 'rounded-[20px]',
};

const sizeStyles: Record<ButtonSize, string> = {
  large: 'px-7 py-6 !text-label-18',
  medium: 'px-5 py-3 !text-label-16',
  small: 'px-3 py-2 !text-label-16',
};

const getColorVariantStyles = (color: ButtonColor, variant: ButtonVariant): string => {
  const combinations = {
    'primary-fill': 'bg-blue-400 text-white hover:bg-blue-600 disabled:bg-blue-200',
    'primary-stroke':
      'bg-transparent border border-blue-400 text-blue-400 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-300 disabled:bg-blue-50',
    'secondary-fill':
      'bg-black text-white hover:bg-gray-5 disabled:bg-gray-5 disabled:border-2 disabled:border-gray-4',
    'secondary-stroke':
      'bg-transparent border border-gray-2 text-gray-4 hover:bg-gray-1 hover:text-gray-3 disabled:bg-gray-1 disabled:text-gray-3',
  };

  return combinations[`${color}-${variant}`] || '';
};

export default function Button({
  className,
  variant = 'fill',
  color = 'primary',
  shape = 'rect',
  size = 'medium',
  children,
  ...props
}: ButtonProps) {
  const buttonClass = cn(
    baseStyles,
    shapeStyles[shape],
    sizeStyles[size],
    getColorVariantStyles(color, variant),
    className,
  );

  return (
    <button className={buttonClass} {...props}>
      {children}
    </button>
  );
}

Button.displayName = 'Button';
