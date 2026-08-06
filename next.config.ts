import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  output: "standalone",
  // Hide the on-screen development indicator so the rendered interface is never
  // overlaid by tooling chrome in reviews, screenshots, or demonstrations.
  devIndicators: false,
};

export default nextConfig;
