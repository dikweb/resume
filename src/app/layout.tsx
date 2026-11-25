import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "丁凯 · 简历",
  description: "丁凯的个人简历：AI 应用开发工程师，持续深入 AI Agent 全栈。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  );
}
