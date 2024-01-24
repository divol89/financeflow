

const withTM = require('next-transpile-modules')(['rc-picker', '@lifi/widget', '@ant-design/icons', 'rc-util', 'rc-pagination']); // pasa el nombre del módulo en un array


// el resto de tu configuración...
module.exports = withTM({
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { hostname: 'ipfs-3.thirdwebcdn.com' },
      { hostname: 'gateway.ipfscdn.io' },
      { hostname: 'ipfs-2.thirdwebcdn.com' },
      { hostname: 's2.coinmarketcap.com' },
      { hostname: 'dextool.io' },
      { hostname: 'bafybeia4c2wd7v4cddgbwfusevcjo4inep3weh63glfyvbx36qi6ijwmh4.ipfs.cf-ipfs.com' }
    ]
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