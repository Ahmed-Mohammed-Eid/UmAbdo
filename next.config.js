/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    API_URL: `https://umabdo.kportals.net/api/v1`,
  },
  images: {
    domains: ['picsum.photos', "unsplash.com", "images.unsplash.com", "source.unsplash.com", "images.pexels.com", "localhost", "umabdo.kportals.net", "vacademy.kportals.net"]
  },
}

module.exports = nextConfig
