const { i18n } = require("./next-i18next.config");
const webpack = require("webpack");

const securityHeaders = [
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  {
    key: "Content-Security-Policy",
    value:
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://api.coingecko.com http://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js https://www.google-analytics.com https://www.googletagmanager.com/ https://*.google.com https://cdn.usefathom.com https://*.hcaptcha.com https://*.freshworks.com https://www.gstatic.com;",
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack(config, { buildId }) {
    config.module.rules.push({ test: /\.svg$/, use: ["@svgr/webpack"] });
    config.plugins.push(
      new webpack.DefinePlugin({ "process.env.BUILD_ID": JSON.stringify(buildId) })
    );
    return config;
  },
  images: {
    domains: [
      "catalog-images.s3.ap-south-1.amazonaws.com",
      "d2mj1no4zi8uvs.cloudfront.net",
      "tokens.1inch.io",
      "assets.coingecko.com",
    ],
  },
  async headers() {
    return [
      {
        // Apply these headers to all routes in your application.
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },

  async redirects() {
    return [
      {
        source: "/",
        destination: "/explorerHome",
        permanent: false,
      },
    ];
  },
  staticPageGenerationTimeout: 240000,
  i18n,
};

module.exports = nextConfig;
