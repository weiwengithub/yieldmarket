/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  distDir: 'out',
  images: {
    unoptimized: true
  },
  async rewrites() {
    return [
      {
        source: '/app/:path*',
        destination: 'http://8.219.95.68:3333/app/:path*', // 你的本地服务器地址
      },
    ]
  },
};

export default nextConfig;
