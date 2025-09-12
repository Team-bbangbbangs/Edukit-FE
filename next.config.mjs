import { withSentryConfig } from '@sentry/nextjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {},
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            svgoConfig: {
              plugins: [
                {
                  name: 'preset-default',
                  params: {
                    overrides: {
                      removeViewBox: false,
                    },
                  },
                },
                {
                  name: 'convertColors',
                  params: {
                    currentColor: true,
                  },
                },
                {
                  name: 'removeAttrs',
                  params: { attrs: '(fill|stroke)' },
                },
              ],
            },
            typescript: true,
            expandProps: 'end',
            svgProps: {
              fill: 'currentColor',
              width: '{props.width || 24}',
              height: '{props.height || 24}',
            },
          },
        },
      ],
    });

    return config;
  },
};

export default withSentryConfig(nextConfig, {
  org: 'hanyang-universityerica',
  project: 'javascript-nextjs',
  silent: !process.env.CI,
  widenClientFileUpload: true,
  disableLogger: true,
  automaticVercelMonitors: true,
});
