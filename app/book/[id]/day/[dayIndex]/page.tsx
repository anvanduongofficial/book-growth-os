"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase"; // Gọi client
import { Book } from "@/types/roadmap";    // Gọi type

// Import các components con (Giữ nguyên)
import ActionHeader from "@/components/action/ActionHeader";
import InsightCard from "@/components/action/InsightCard";
import ToolList from "@/components/action/ToolList";
import CompleteFooter from "@/components/action/CompleteFooter";

export default function DayActionPage() {
  const params = useParams();
  const router = useRouter();

  // State
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);

  // 1. Fetch dữ liệu từ Supabase
  useEffect(() => {
    async function fetchBook() {
      // Gọi DB lấy cuốn sách theo ID trên URL
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) {
        console.error("Lỗi:", error);
      } else {
        setBook(data as Book);
      }
      setLoading(false);
    }

    if (params.id) fetchBook();
  }, [params.id]);

  // 2. Màn hình chờ
  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400">Đang tải bài học...</div>;
  if (!book) return <div className="p-10 text-center">Không tìm thấy sách!</div>;

  // 3. Logic tìm ngày học
  // Ép kiểu dayIndex từ URL (string) sang số để so sánh
  const dayIndex = Number(params.dayIndex);
  const dayData = book.roadmap.find((d) => d.day_index === dayIndex);

  if (!dayData) return <div className="p-10 text-center">Ngày học này không tồn tại!</div>;

  return (
    <main className="flex justify-center min-h-screen bg-[#F8FAFC]">
      <div className="w-full max-w-[420px] bg-white min-h-screen flex flex-col relative">
        
        {/* Header */}
        <ActionHeader dayIndex={dayIndex} title={dayData.title} />

        {/* Nội dung chính */}
        <div className="p-6 flex-1 overflow-y-auto pb-32">
            <InsightCard summary={dayData.summary} />
            {/* Truyền tools lấy từ Supabase vào Component */}
            <ToolList tools={dayData.tools || []} />
        </div>

        {/* Footer */}
        <CompleteFooter />

      </div>
    </main>
  );
}