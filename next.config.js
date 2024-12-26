/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'alexawriters.s3.eu-north-1.amazonaws.com',
        port: '',
        pathname: '/profile-images/**',
      },
      {
        protocol: 'https',
        hostname: 'api.sapienvault.com',
        port: '',
        pathname: '/storage/**',
      },
    ],
  },
};

module.exports = nextConfig;
