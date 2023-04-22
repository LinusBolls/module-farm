/** @type {import('next').NextConfig} */
const nextConfig = {
  webpackDevMiddleware: config => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    }
    return config
  },
  // important for react-beautiful-dnd to work
  reactStrictMode: false,
}

module.exports = nextConfig