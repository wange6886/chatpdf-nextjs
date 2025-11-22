import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 最终配置：解决 pdfjs-dist 找不到文件的问题
  serverExternalPackages: ['pdfjs-dist/legacy', 'pdfjs-dist'],
};

export default nextConfig;