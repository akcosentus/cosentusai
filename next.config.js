/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        // Apply headers to all embed routes
        source: '/embed/:path*',
        headers: [
          {
            key: 'Permissions-Policy',
            value: 'microphone=*',
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig

