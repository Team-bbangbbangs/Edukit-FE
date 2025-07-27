import localFont from 'next/font/local';

export const suit = localFont({
  src: [
    {
      path: '../../../../public/fonts/SUIT-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../../../public/fonts/SUIT-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../../../public/fonts/SUIT-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../../../public/fonts/SUIT-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../../../public/fonts/SUIT-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-suit',
  display: 'swap',
});
