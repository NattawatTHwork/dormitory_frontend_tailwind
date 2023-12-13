/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    API_URL: 'http://localhost:3000'
    // API_URL: 'https://calm-jade-clam-ring.cyclic.app'
  },
  images: {
    domains: ['localhost'], // Add your domain(s) here
  },
}

module.exports = nextConfig
