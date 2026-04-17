import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  output: "standalone",

  typescript: {
    ignoreBuildErrors: true,
  },

  turbopack: {},

  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      react: path.resolve(__dirname, "node_modules/react"),
      "react-dom": path.resolve(__dirname, "node_modules/react-dom"),
    };
    return config;
  },
};

export default nextConfig;