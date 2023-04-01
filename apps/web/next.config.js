/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@shared/database', '@shared/components']
}

module.exports = nextConfig
