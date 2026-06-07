const isDev = process.env.NODE_ENV === "development";

const nextConfig = {
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
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(self)",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "img-src 'self' data: https://res.cloudinary.com https://lh3.googleusercontent.com https://api.maptiler.com",
              `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://upload-widget.cloudinary.com`,
              "style-src 'self' 'unsafe-inline'",
              "connect-src 'self' https://*.cloudinary.com https://api.maptiler.com https://api.opencagedata.com https://*.upstash.io",
              "frame-src https://upload-widget.cloudinary.com",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join("; "),
          },
        ],
      },
    ];
  },
  // rewrites: [
  //   {
  //     source: "/api/:path*",
  //     destination: "/api/:path*",
  //   },
  // ],
};

export default nextConfig;
