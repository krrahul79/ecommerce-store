/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    domains: ["tailwindui.com", "res.cloudinary.com"],
  },
};

module.exports = nextConfig;
