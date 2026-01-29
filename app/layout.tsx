import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Load font Inter (Font chuẩn quốc tế cho UI)
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Book Growth OS",
  description: "Biến tri thức sách thành hành động thực tế",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={inter.className}>{children}</body>
    </html>
  );
}