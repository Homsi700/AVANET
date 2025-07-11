import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  // This allows the Next.js dev server to accept requests from the
  // Firebase Studio development environment.
  allowedDevOrigins: ['*'],
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Ignore watching the db.json file to prevent reload loops in development
  webpack: (config, { isServer }) => {
    if (!isServer) {
        config.watchOptions = {
            ...config.watchOptions,
            ignored: [
                ...((config.watchOptions?.ignored as string[]) || []),
                '**/db.json',
            ],
        };
    }
    return config;
  }
};

export default nextConfig;
