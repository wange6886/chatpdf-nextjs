import "./globals.css";

export const metadata = {
  title: "ChatPDF 复刻版",
  description: "Made by DeepSeek & Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      {/* 直接用 body 标签，不再引用任何谷歌字体变量 */}
      <body style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}