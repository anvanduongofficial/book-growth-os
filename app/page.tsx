// src/app/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase"; // Import client vừa tạo
import { Book } from "@/types/roadmap";
import { Search, BookOpen, Flame } from "lucide-react";

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");
  // State để chứa sách lấy từ DB về
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  // useEffect chạy 1 lần khi mở trang để tải sách
  useEffect(() => {
    async function fetchBooks() {
      // Gọi Supabase: "Lấy hết các cột từ bảng books"
      const { data, error } = await supabase.from('books').select('*');
      
      if (error) {
        console.error("Lỗi tải sách:", error);
      } else {
        setBooks(data as Book[]); // Ép kiểu về Book
      }
      setLoading(false);
    }

    fetchBooks();
  }, []);

  // ... (Phần logic Search giữ nguyên, chỉ đổi BOOKS thành books) ...
  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-10 text-center">Đang tải thư viện...</div>;

  return (
    <main className="flex justify-center min-h-screen bg-[#F8FAFC]">
      {/* Mobile Container */}
      <div className="w-full max-w-[420px] bg-[#F8FAFC] min-h-screen flex flex-col pb-20">
        
        {/* 1. HEADER & GREETING */}
        <div className="bg-white px-6 pt-12 pb-6 rounded-b-[30px] shadow-sm mb-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Book Growth OS</p>
                    <h1 className="font-bold text-gray-900 text-xl">Thư viện Thực chiến</h1>
                </div>
                {/* Streak giả định */}
                <div className="flex items-center gap-1 bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
                    <Flame size={14} className="text-orange-500 fill-orange-500" />
                    <span className="text-xs font-bold text-orange-700">0 Ngày</span>
                </div>
            </div>

            {/* 2. SEARCH BAR */}
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="text-gray-400 w-5 h-5" />
                </div>
                <input 
                    type="text" 
                    className="block w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-medium" 
                    placeholder="Tìm sách (VD: Atomic...)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>

        {/* 3. BOOK LIST */}
        <div className="px-6 flex-1">
            <h2 className="font-bold text-gray-800 text-lg mb-4">
                {searchTerm ? "Kết quả tìm kiếm" : "Kho sách tuyển chọn"}
            </h2>

            <div className="space-y-4">
                {filteredBooks.length > 0 ? (
                    filteredBooks.map((book) => (
                        <Link href={`/book/${book.id}`} key={book.id}>
                            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4 active:scale-[0.98] transition-transform cursor-pointer hover:border-blue-200">
                                {/* Ảnh bìa */}
                                <div className="w-16 h-24 flex-shrink-0 rounded-lg overflow-hidden shadow-sm bg-gray-200">
                                    <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
                                </div>
                                
                                {/* Thông tin sách */}
                                <div className="flex flex-col justify-center flex-1">
                                    <h3 className="font-bold text-gray-900 text-base leading-tight mb-1">{book.title}</h3>
                                    <p className="text-xs text-gray-500 mb-2">{book.author}</p>
                                    
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-1 text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                            <BookOpen size={12} />
                                            <span>{book.totalDays} Ngày</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))
                ) : (
                    // Empty State
                    <div className="text-center py-10 opacity-60">
                        <p>Không tìm thấy sách này.</p>
                    </div>
                )}
            </div>
        </div>

      </div>
    </main>
  );
}