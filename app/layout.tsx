import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// Import component vừa tạo
import BottomNav from "@/components/layout/BottomNav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Book Growth OS",
  description: "Biến sách thành hành động",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        {children}
        
        {/* Menu đáy sẽ nằm đè lên trên tất cả các trang */}
        <BottomNav />
      </body>
    </html>
  );
}