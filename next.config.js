/** @type {import('next').NextConfig} */
const nextConfig = {

  // ✅ FORCE NON-WWW → WWW (CRITICAL SEO FIX)
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "mmmiles.com",
          },
        ],
        destination: "https://www.mmmiles.com/:path*",
        permanent: true,
      },
    ];
  },

  // Existing configs (UNCHANGED)
  serverExternalPackages: ['jsonwebtoken', 'google-spreadsheet'],

  eslint: {
    ignoreDuringBuilds: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tktfsjtlfjxbqfvbcoqr.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },

  experimental: {
    serverActions: {
      bodySizeLimit: '20mb',
    },
  },

  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;