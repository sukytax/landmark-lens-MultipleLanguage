/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    // Ensure API Key is available if needed on client, but we are moving to server actions/api
  },
};

export default nextConfig;
