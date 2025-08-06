/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'localhost',
      'estospaces-backend.vercel.app',
      'estospaces-images.s3.amazonaws.com',
      'images.unsplash.com'
    ]
  }
}

module.exports = nextConfig
