import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Using webpack bundler for Next.js 16.2.3 production builds.
  // Turbopack has a known bug (E1068) where workStore is not initialized
  // during static prerendering of /_global-error, causing build failures.
  // This can be revisited once the upstream Next.js bug is fixed.
};

export default nextConfig;
