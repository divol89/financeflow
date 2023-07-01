

const { createProxyMiddleware } = require('http-proxy-middleware');
const withTM = require('next-transpile-modules')(['@lifi/widget']); // pasa el nombre del módulo en un array

module.exports = withTM({
  reactStrictMode: true,
  images: {
    domains: ["gateway.ipfscdn.io",'ipfs-2.thirdwebcdn.com','s2.coinmarketcap.com','dextool.io']
    
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



