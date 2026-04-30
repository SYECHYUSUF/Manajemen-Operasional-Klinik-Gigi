import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Fix Turbopack workspace root — ada package-lock.json di /Users/mochsyechyusufm/
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
