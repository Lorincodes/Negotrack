import type { NextConfig } from "next";

// Vercel sets VERCEL=1 during its builds.
const isVercel = Boolean(process.env.VERCEL);

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Standalone output targets self-hosted Node deployments (see
  // docs/namecheap-deployment.md). Vercel runs its own build pipeline and
  // fails on the standalone trace step, so it stays off there.
  ...(isVercel ? {} : { output: "standalone" as const }),
  // Hide the on-screen development indicator so the rendered interface is never
  // overlaid by tooling chrome in reviews, screenshots, or demonstrations.
  devIndicators: false,
};

export default nextConfig;
