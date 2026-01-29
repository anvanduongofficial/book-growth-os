"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase"; // Gọi client Supabase
import { Book } from "@/types/roadmap";    // Gọi type chuẩn

// Import các components giao diện (Giữ nguyên không đổi)
import RoadmapHeader from "@/components/roadmap/RoadmapHeader";
import RoadmapDayItem from "@/components/roadmap/RoadmapDayItem";
import ContinueButton from "@/components/roadmap/ContinueButton";

export default function BookRoadmapPage() {
  const params = useParams();
  const router = useRouter();
  
  // State chứa dữ liệu sách tải từ Supabase
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);

  // 1. useEffect: Tải sách khi vào trang
  useEffect(() => {
    async function fetchBook() {
      // Gọi Supabase: Lấy 1 dòng (single) có id trùng với params.id
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) {
        console.error("Lỗi tải sách:", error);
        // Nếu không thấy sách thì có thể redirect hoặc hiện lỗi
      } else {
        setBook(data as Book); // Ép kiểu dữ liệu về Book
      }
      setLoading(false);
    }

    if (params.id) fetchBook();
  }, [params.id]);

  // 2. Hiển thị màn hình chờ (Loading Skeleton đơn giản)
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400">Đang tải lộ trình...</div>;
  }

  // 3. Xử lý nếu không tìm thấy sách (404)
  if (!book) {
    return <div className="p-10 text-center">Không tìm thấy sách!</div>;
  }

  // --- LOGIC TIẾN ĐỘ (Tạm thời giả lập, bài sau sẽ làm thật) ---
  const currentDay = 1; 
  const currentDayData = book.roadmap.find(d => d.day_index === currentDay);

  return (
    <main className="flex justify-center min-h-screen bg-[#F8FAFC]">
      <div className="w-full max-w-[420px] bg-[#F8FAFC] min-h-screen flex flex-col relative">
        
        {/* HEADER */}
        <RoadmapHeader 
          title={book.title} 
          cover={book.cover} 
          totalDays={book.totalDays}
          currentDay={currentDay}
        />

        {/* LIST LỘ TRÌNH */}
        <div className="flex-1 px-5 py-8 pb-32 relative overflow-hidden">
          {/* Đường kẻ dọc */}
          <div className="absolute left-[39px] top-8 bottom-0 w-[2px] bg-gray-200 z-0"></div>

          <div className="space-y-8 relative z-10">
            {/* Map qua mảng roadmap lấy từ Supabase */}
            {book.roadmap.map((day) => (
              <RoadmapDayItem 
                key={day.day_index}
                day={day}
                bookId={book.id}
                currentDay={currentDay}
              />
            ))}
          </div>
        </div>

        {/* NÚT CONTINUE */}
        {currentDayData && (
          <ContinueButton 
            bookId={book.id}
            dayIndex={currentDay}
            dayTitle={currentDayData.title}
          />
        )}

      </div>
    </main>
  );
}