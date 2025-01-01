/** @type {import('next').NextConfig} */

import path from "path";

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  experimental: {
    outputFileTracingRoot: path.join(__dirname, "../../"),
  },
  env: {
    NEXT_PUBLIC_AUTH_API_LOGIN: "/api/v1/auth/login",
    NEXT_PUBLIC_AUTH_API_REFRESH: "/api/v1/auth/refresh",
    NEXT_PUBLIC_AUTH_API_LOGOUT: "/api/v1/auth/logout",
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `http://${process.env.NODE_ENV === "development" ? "localhost" : "server"}:${process.env.SERVER_PORT || 3005}/:path*`,
      },
    ];
  },
};

export default nextConfig;
