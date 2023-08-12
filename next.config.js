

const { createProxyMiddleware } = require('http-proxy-middleware');
const withTM = require('next-transpile-modules')(['@lifi/widget']); // pasa el nombre del módulo en un array

module.exports = withTM({
  reactStrictMode: true,
  images: {
    domains: ['ipfs-3.thirdwebcdn.com','gateway.ipfscdn.io','ipfs-2.thirdwebcdn.com','s2.coinmarketcap.com','dextool.io','bafybeia4c2wd7v4cddgbwfusevcjo4inep3weh63glfyvbx36qi6ijwmh4.ipfs.cf-ipfs.com']
    
  },
  swcMinify: true,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
  async rewrites() {
    return [
      {
        source: '/api/proxy/:path*',
        destination: 'https://api.geckoterminal.com/:path*',
      },
    ]
  },
});