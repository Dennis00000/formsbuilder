/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove serverActions since it's now enabled by default
}

const withNextIntl = require('next-intl/plugin')(
  './i18n.ts'
)

module.exports = withNextIntl(nextConfig) 