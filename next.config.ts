import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  images: { unoptimized: true },
  transpilePackages: ['remotion', '@remotion/player'],
};

export default nextConfig;
