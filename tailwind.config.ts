import { type Config } from 'tailwindcss';
import tailwindcssAnimate from 'tailwindcss-animate';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/domains/**/*.{js,ts,jsx,tsx}',
    './src/shared/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: 'hsl(var(--primary))',
        'primary-foreground': 'hsl(var(--primary-foreground))',
        secondary: 'hsl(var(--secondary))',
        'secondary-foreground': 'hsl(var(--secondary-foreground))',
        muted: 'hsl(var(--muted))',
        'muted-foreground': 'hsl(var(--muted-foreground))',
        accent: 'hsl(var(--accent))',
        'accent-foreground': 'hsl(var(--accent-foreground))',
        destructive: 'hsl(var(--destructive))',
        'destructive-foreground': 'hsl(var(--destructive-foreground))',
        card: 'hsl(var(--card))',
        'card-foreground': 'hsl(var(--card-foreground))',
        popover: 'hsl(var(--popover))',
        'popover-foreground': 'hsl(var(--popover-foreground))',
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
        gray: {
          white: '#ffffff',
          1: '#f9fafb',
          2: '#dedede',
          3: '#868686',
          4: '#464646',
          black: '#121212',
        },
        blue: {
          400: '#5484f2',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        suit: ['var(--font-suit)'],
      },

      fontSize: {
        'heading-48': ['48px', { lineHeight: '72px', letterSpacing: '-0.02em', fontWeight: '700' }],
        'heading-40': ['40px', { lineHeight: '60px', letterSpacing: '-0.02em', fontWeight: '700' }],
        'heading-32': ['32px', { lineHeight: '48px', letterSpacing: '-0.02em', fontWeight: '700' }],
        'heading-28': ['28px', { lineHeight: '42px', letterSpacing: '-0.02em', fontWeight: '700' }],
        'heading-24': ['24px', { lineHeight: '36px', letterSpacing: '-0.02em', fontWeight: '700' }],
        'heading-20': ['20px', { lineHeight: '30px', letterSpacing: '-0.02em', fontWeight: '700' }],
        'heading-18': ['18px', { lineHeight: '28px', letterSpacing: '-0.02em', fontWeight: '700' }],
        'heading-16': [
          '16px',
          { lineHeight: '24px', letterSpacing: '-0.015em', fontWeight: '700' },
        ],

        'title-32': ['32px', { lineHeight: '48px', letterSpacing: '-0.02em', fontWeight: '600' }],
        'title-28': ['28px', { lineHeight: '42px', letterSpacing: '-0.02em', fontWeight: '600' }],
        'title-24': ['24px', { lineHeight: '36px', letterSpacing: '-0.02em', fontWeight: '600' }],
        'title-20': ['20px', { lineHeight: '30px', letterSpacing: '-0.02em', fontWeight: '600' }],
        'title-18': ['18px', { lineHeight: '28px', letterSpacing: '-0.02em', fontWeight: '600' }],
        'title-16': ['16px', { lineHeight: '24px', letterSpacing: '-0.015em', fontWeight: '600' }],
        'title-14': ['14px', { lineHeight: '20px', letterSpacing: '-0.015em', fontWeight: '600' }],

        'body-18-m': ['18px', { lineHeight: '30px', letterSpacing: '-0.015em', fontWeight: '500' }],
        'body-16-m': ['16px', { lineHeight: '26px', letterSpacing: '-0.015em', fontWeight: '500' }],
        'body-16-r': ['16px', { lineHeight: '26px', letterSpacing: '-0.015em', fontWeight: '400' }],
        'body-14-m': ['14px', { lineHeight: '22px', letterSpacing: '-0.015em', fontWeight: '500' }],
        'body-14-r': ['14px', { lineHeight: '22px', letterSpacing: '-0.015em', fontWeight: '400' }],
        'body-14-l': ['14px', { lineHeight: '22px', letterSpacing: '-0.015em', fontWeight: '300' }],
        'body-13-m': ['13px', { lineHeight: '20px', letterSpacing: '-0.015em', fontWeight: '500' }],
        'body-13-r': ['13px', { lineHeight: '20px', letterSpacing: '-0.015em', fontWeight: '400' }],
        'body-13-l': ['13px', { lineHeight: '20px', letterSpacing: '-0.015em', fontWeight: '300' }],

        'label-18': ['18px', { lineHeight: '24px', letterSpacing: '-0.02em', fontWeight: '600' }],
        'label-16': ['16px', { lineHeight: '22px', letterSpacing: '-0.02em', fontWeight: '600' }],
        'label-14': ['14px', { lineHeight: '18px', letterSpacing: '-0.02em', fontWeight: '600' }],
        'label-12': ['12px', { lineHeight: '16px', letterSpacing: '-0.02em', fontWeight: '600' }],
        'label-11': ['11px', { lineHeight: '14px', letterSpacing: '-0.02em', fontWeight: '600' }],
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
