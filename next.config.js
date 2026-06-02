/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/matrix-dashboard/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store, no-cache, must-revalidate" },
          { key: "Pragma", value: "no-cache" },
        ],
      },
      {
        source: "/matrix",
        headers: [
          { key: "Cache-Control", value: "no-store, no-cache, must-revalidate" },
          { key: "Pragma", value: "no-cache" },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      { hostname: "ipfs-3.thirdwebcdn.com" },
      { hostname: "gateway.ipfscdn.io" },
      { hostname: "ipfs-2.thirdwebcdn.com" },
      { hostname: "s2.coinmarketcap.com" },
      { hostname: "dextool.io" },
      { hostname: "v2.akord.com" },
      { hostname: "arweave.net" },
      {
        hostname:
          "bafybeia4c2wd7v4cddgbwfusevcjo4inep3weh63glfyvbx36qi6ijwmh4.ipfs.cf-ipfs.com",
      },
    ],
  },
  swcMinify: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
    }
    config.resolve.alias = {
      ...config.resolve.alias,
      ethers5: "ethers",
    };
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
  transpilePackages: [
    "rc-picker",
    "@ant-design", // Add this line
    "rc-util",
    "rc-pagination",
    "@web3modal",
    "shadcn-ui",
    "@walletconnect",
  ],
};

module.exports = nextConfig;
