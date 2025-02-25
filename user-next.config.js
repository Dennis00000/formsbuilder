const withNextIntl = require("next-intl/plugin")()

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: true,
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/en",
        permanent: true,
      },
    ]
  },
}

module.exports = withNextIntl(nextConfig)

