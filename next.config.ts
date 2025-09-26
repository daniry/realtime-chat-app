import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  	typescript: {
		ignoreBuildErrors: true,
	},
	eslint: {
		dirs: ['src'],
		ignoreDuringBuilds: true,
	},
};

export default nextConfig;
