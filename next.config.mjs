/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      defaultRuntime: "edge",
    },
  },
};

export default nextConfig;
