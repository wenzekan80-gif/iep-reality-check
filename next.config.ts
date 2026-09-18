import type { NextConfig } from "next";

const config: NextConfig = {
  // Keep the demo recording free of framework chrome; runtime errors still surface.
  devIndicators: false,
};

export default config;
