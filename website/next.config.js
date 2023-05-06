/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["source.boringavatars.com"],
    formats: ["image/webp"],

  }
}

module.exports = nextConfig
