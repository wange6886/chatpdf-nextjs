import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 解决 pdfjs-dist 在 Vercel 上找不到文件的 Bug
  // 关键：将 pdfjs-dist/legacy 声明为外部包
  serverExternalPackages: ['pdfjs-dist/legacy', 'pdfjs-dist'],
};

export default nextConfig;
