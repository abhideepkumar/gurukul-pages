/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", 
  images: {
    unoptimized: true,
  },
  experimental: {
    serverActions: {
      defaultRuntime: "edge",
    },
  },
};

export default nextConfig;
