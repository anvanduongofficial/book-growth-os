"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase"; 
import { Book } from "@/types/roadmap";

import RoadmapHeader from "@/components/roadmap/RoadmapHeader";
import RoadmapDayItem from "@/components/roadmap/RoadmapDayItem";
import ContinueButton from "@/components/roadmap/ContinueButton";

export default function BookRoadmapPage() {
  const params = useParams();
  
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  
  // State mới: Lưu ngày hiện tại của User (Mặc định là 1)
  const [currentDay, setCurrentDay] = useState(1);

  useEffect(() => {
    async function fetchData() {
      // 1. Lấy thông tin User
      const { data: { user } } = await supabase.auth.getUser();

      // 2. Lấy thông tin Sách
      const { data: bookData, error: bookError } = await supabase
        .from('books')
        .select('*')
        .eq('id', params.id)
        .single();

      if (bookError) {
        console.error("Lỗi tải sách:", bookError);
        setLoading(false);
        return;
      }

      setBook(bookData as Book);

      // 3. Lấy Tiến độ của User (Nếu đã đăng nhập)
      if (user) {
        const { data: progressData } = await supabase
          .from('user_progress')
          .select('current_day')
          .eq('user_id', user.id)
          .eq('book_id', params.id)
          .single();

        // Nếu có tiến độ thì cập nhật, không thì vẫn là 1
        if (progressData) {
          setCurrentDay(progressData.current_day);
        }
      }
      
      setLoading(false);
    }

    if (params.id) fetchData();
  }, [params.id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400">Đang tải...</div>;
  if (!book) return <div className="p-10 text-center">Không tìm thấy sách!</div>;

  // Tìm tiêu đề ngày hiện tại cho nút Continue
  const currentDayData = book.roadmap.find(d => d.day_index === currentDay);
  console.log("currentDay", currentDay)
  console.log("book", book)

  return (
    <main className="flex justify-center min-h-screen bg-[#F8FAFC]">
      <div className="w-full max-w-[420px] bg-[#F8FAFC] min-h-screen flex flex-col relative">
        
        <RoadmapHeader 
          title={book.title} 
          cover={book.cover} 
          totalDays={book.totalDays}
          currentDay={currentDay}
        />

        <div className="flex-1 px-5 py-8 pb-32 relative overflow-hidden">
          <div className="absolute left-[39px] top-8 bottom-0 w-[2px] bg-gray-200 z-0"></div>

          <div className="space-y-8 relative z-10">
            {book.roadmap.map((day) => (
              <RoadmapDayItem 
                key={day.day_index}
                day={day}
                bookId={book.id}
                currentDay={currentDay} // Truyền state thật vào đây
              />
            ))}
          </div>
        </div>

        {/* Chỉ hiện nút Continue nếu chưa học hết */}
        {currentDayData && (
          <ContinueButton 
            bookId={book.id}
            dayIndex={currentDay}
            dayTitle={currentDayData.title}
          />
        )}
         
         {/* Nếu học hết rồi (currentDay > totalDays) thì có thể hiện thông báo chúc mừng ở đây */}

      </div>
    </main>
  );
}