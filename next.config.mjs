/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  serverExternalPackages: ["mongoose", "bcryptjs", "jsonwebtoken"],
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "api.maptiler.com",
        pathname: "**",
      },
    ],
  },
  // rewrites: [
  //   {
  //     source: "/api/:path*",
  //     destination: "/api/:path*",
  //   },
  // ],
};

export default nextConfig;
