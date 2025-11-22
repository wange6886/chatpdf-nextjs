import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 告诉 Next.js：这个包是给后台用的，不要强行打包到前端去
  serverExternalPackages: ['pdfjs-dist'],
};

export default nextConfig;