/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@shared/database', '@shared/components'],
  typescript: {
    ignoreBuildErrors: true
  }
}

module.exports = nextConfig
