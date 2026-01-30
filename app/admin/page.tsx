"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Plus, Edit, Trash2, BookOpen, Search, Lock } from "lucide-react";
import { Book } from "@/types/roadmap";

const ADMIN_EMAIL = "anvanduongofficial@gmail.com"; 

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState(""); // Thêm state tìm kiếm

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || user.email !== ADMIN_EMAIL) {
        router.push("/");
        return;
      }
      fetchBooks();
    };
    checkAdmin();
  }, [router]);

  const fetchBooks = async () => {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) setBooks(data as Book[]);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Xóa là mất vĩnh viễn! Bạn chắc chưa?")) return;
    const { error } = await supabase.from('books').delete().eq('id', id);
    if (!error) {
      fetchBooks();
    } else {
      alert("Lỗi: " + error.message);
    }
  };

  // Logic lọc sách theo từ khóa
  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-3">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-gray-500 font-medium">Đang vào tổng hành dinh...</p>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#F8FAFC] pb-24"> {/* pb-24 để tránh bị menu đáy che mất */}
      
      {/* 1. Header & Search Area */}
      <div className="bg-white px-5 pt-8 pb-6 shadow-sm sticky top-0 z-30">
        <div className="max-w-5xl mx-auto space-y-4">
            
            {/* Title & Greeting */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Lock size={20} className="text-blue-600" /> Admin
                    </h1>
                    <p className="text-xs text-gray-500">Quản lý nội dung ứng dụng</p>
                </div>
                {/* Avatar Admin nhỏ (Optional) */}
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs">
                    AD
                </div>
            </div>

            {/* Search Bar & Add Button */}
            <div className="flex gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Tìm tên sách..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                </div>
                
                {/* Nút thêm sách: Trên mobile chỉ hiện Icon + , Desktop hiện chữ */}
                <Link 
                    href="/admin/create" 
                    className="bg-blue-600 text-white px-4 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 active:scale-95 transition-all"
                >
                    <Plus size={24} />
                    <span className="hidden md:block ml-2 font-bold">Thêm mới</span>
                </Link>
            </div>
        </div>
      </div>

      {/* 2. Book List */}
      <div className="max-w-5xl mx-auto px-4 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {filteredBooks.map((book) => (
            <div key={book.id} className="bg-white rounded-2xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-gray-100">
              
              {/* Info Row */}
              <div className="flex gap-4 mb-4">
                <img src={book.cover} alt={book.title} className="w-16 h-24 object-cover rounded-lg shadow-sm bg-gray-100 flex-shrink-0" />
                <div className="flex-1 min-w-0"> {/* min-w-0 giúp text truncate hoạt động */}
                  <div className="flex justify-between items-start">
                      <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded mb-1">
                        {book.totalDays} ngày
                      </span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm leading-tight line-clamp-2 mb-1">
                    {book.title}
                  </h3>
                  <p className="text-xs text-gray-400 truncate">{book.author}</p>
                </div>
              </div>

              {/* Action Buttons Row (To, dễ bấm) */}
              <div className="grid grid-cols-3 gap-2 border-t border-gray-50 pt-3">
                <Link 
                    href={`/book/${book.id}`} 
                    className="flex flex-col items-center justify-center py-2 rounded-lg bg-gray-50 text-gray-600 text-[10px] font-medium active:bg-gray-100"
                >
                  <BookOpen size={18} className="mb-1" />
                  Xem thử
                </Link>
                
                <button 
                    className="flex flex-col items-center justify-center py-2 rounded-lg bg-blue-50 text-blue-600 text-[10px] font-medium active:bg-blue-100"
                >
                  <Edit size={18} className="mb-1" />
                  Chỉnh sửa
                </button>
                
                <button 
                  onClick={() => handleDelete(book.id)}
                  className="flex flex-col items-center justify-center py-2 rounded-lg bg-red-50 text-red-500 text-[10px] font-medium active:bg-red-100"
                >
                  <Trash2 size={18} className="mb-1" />
                  Xóa
                </button>
              </div>

            </div>
          ))}

          {/* Empty State */}
          {filteredBooks.length === 0 && (
            <div className="col-span-full py-16 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                <Search size={32} />
              </div>
              <p className="text-gray-500 font-medium">Không tìm thấy cuốn sách nào.</p>
              <p className="text-xs text-gray-400 mt-1">Thử từ khóa khác xem sao?</p>
            </div>
          )}

        </div>
      </div>

    </main>
  );
}