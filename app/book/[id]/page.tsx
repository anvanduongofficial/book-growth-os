"use client";

import { useEffect, useState, use } from "react";
import { supabase } from "@/lib/supabase"; 
import { Book } from "@/types/roadmap";
import RoadmapHeader from "@/components/roadmap/RoadmapHeader";
import RoadmapDayItem from "@/components/roadmap/RoadmapDayItem";
import ContinueButton from "@/components/roadmap/ContinueButton";
import { Loader2 } from "lucide-react";

export default function BookRoadmapPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: bookId } = use(params);
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentDay, setCurrentDay] = useState(1);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        // 1. Fetch Book Metadata & Roadmap
        const { data: bookData, error: bookError } = await supabase
          .from('books')
          .select('*')
          .eq('id', bookId)
          .single();

        if (bookError) throw bookError;
        setBook(bookData as Book);

        // 2. Fetch User Progress (MaybeSingle để tránh lỗi 406)
        if (user) {
          const { data: progressData } = await supabase
            .from('user_progress')
            .select('current_day')
            .eq('user_id', user.id)
            .eq('book_id', bookId)
            .maybeSingle();

          if (progressData) setCurrentDay(progressData.current_day);
        }
      } catch (error) {
        console.error("❌ Roadmap Load Error:", error);
      } finally {
        setLoading(false);
      }
    }
    if (bookId) fetchData();
  }, [bookId]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="animate-spin text-blue-600" /></div>;
  if (!book) return <div className="p-10 text-center font-bold text-slate-400">KHÔNG TÌM THẤY DỮ LIỆU SÁCH!</div>;

  const currentDayData = book.roadmap?.find(d => d.day_index === currentDay);

  return (
    <main className="flex justify-center min-h-screen bg-slate-50 font-sans">
      <div className="w-full max-w-[420px] bg-white min-h-screen flex flex-col relative shadow-2xl shadow-slate-200">
        
        <RoadmapHeader 
          title={book.title} 
          cover={book.cover} 
          totalDays={book.total_days}
          currentDay={currentDay}
        />

        <div className="flex-1 px-5 py-10 pb-40 relative">
          {/* Giao diện đường kẻ Roadmap chuẩn Atomic */}
          <div className="absolute left-[39px] top-10 bottom-20 w-[2px] bg-slate-100 z-0"></div>

          <div className="space-y-10 relative z-10">
            {book.roadmap?.sort((a,b) => a.day_index - b.day_index).map((day) => (
              <RoadmapDayItem 
                key={day.day_index}
                day={day}
                bookId={book.id}
                currentDay={currentDay}
              />
            ))}
          </div>
        </div>

        {/* Nút hành động nổi (Floating Action Button) */}
        {currentDayData && (
          <div className="fixed bottom-0 w-full max-w-[420px] p-6 bg-gradient-to-t from-white via-white to-transparent z-50">
            <ContinueButton 
              bookId={book.id}
              dayIndex={currentDay}
              dayTitle={currentDayData.title}
            />
          </div>
        )}
      </div>
    </main>
  );
}