"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, User } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();

  // === SỬA ĐOẠN NÀY ===
  // 1. Ẩn menu ở trang Login
  if (pathname === "/login") return null;
  
  // 2. Ẩn menu ở trang Bài học (để nhường chỗ cho nút Hoàn thành)
  // Logic: Nếu đường dẫn chứa chữ "/day/" thì ẩn đi
  if (pathname.includes("/day/")) return null;
  // ====================

  // Hàm kiểm tra link nào đang Active
  const isActive = (path: string) => pathname === path;

  return (
    <div className="fixed bottom-0 left-0 w-full z-40 pointer-events-none">
      {/* ... (Phần code giao diện giữ nguyên không đổi) ... */}
       <div className="w-full max-w-[420px] mx-auto bg-white border-t border-gray-100 flex justify-around items-center px-2 pb-6 pt-3 pointer-events-auto shadow-[0_-5px_20px_rgba(0,0,0,0.03)]">
        
        {/* Nút TRANG CHỦ */}
        <Link href="/" className="flex flex-col items-center gap-1 min-w-[64px] group">
          <div className={`p-1.5 rounded-xl transition-colors ${isActive('/') ? 'bg-blue-50 text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`}>
            <Home size={24} strokeWidth={isActive('/') ? 2.5 : 2} />
          </div>
          <span className={`text-[10px] font-bold ${isActive('/') ? 'text-blue-600' : 'text-gray-400'}`}>
            Khám phá
          </span>
        </Link>

        {/* Nút CÁ NHÂN */}
        <Link href="/profile" className="flex flex-col items-center gap-1 min-w-[64px] group">
          <div className={`p-1.5 rounded-xl transition-colors ${isActive('/profile') ? 'bg-blue-50 text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`}>
            <User size={24} strokeWidth={isActive('/profile') ? 2.5 : 2} />
          </div>
          <span className={`text-[10px] font-bold ${isActive('/profile') ? 'text-blue-600' : 'text-gray-400'}`}>
            Cá nhân
          </span>
        </Link>

      </div>
    </div>
  );
}