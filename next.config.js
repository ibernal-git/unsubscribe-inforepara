/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [process.env.IMAGES_HOST]
  }
}

module.exports = nextConfig
