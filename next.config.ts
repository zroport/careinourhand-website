import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Using webpack bundler for Next.js 16.2.3 production builds.
  // Turbopack has a known bug (E1068) where workStore is not initialized
  // during static prerendering of /_global-error, causing build failures.
  // This can be revisited once the upstream Next.js bug is fixed.

  // Empty turbopack config silences the "webpack config but no turbopack config" warning
  // when running `next dev` (which uses Turbopack by default in Next.js 16).
  turbopack: {},

  webpack(config) {
    // On Windows, the project directory path can appear in two casing variants
    // (e.g. D:\careinhandwebsite vs D:\Careinhandwebsite). Webpack on a
    // case-insensitive filesystem treats these as distinct modules, producing
    // duplicate React instances. One instance can end up null in the SSG worker,
    // causing "Cannot read properties of null (reading 'useContext')".
    // Aliasing React and React-DOM to their resolved paths deduplicates them.
    config.resolve.alias = {
      ...config.resolve.alias,
      react: path.resolve(__dirname, "node_modules/react"),
      "react-dom": path.resolve(__dirname, "node_modules/react-dom"),
    };
    return config;
  },
};

export default nextConfig;
