"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import confetti from "canvas-confetti"; // <--- 1. Import thư viện

interface Props {
  bookId: string;
  dayIndex: number;
}

export default function CompleteFooter({ bookId, dayIndex }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleComplete = async () => {
    setStatus('loading');

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert("Bạn cần đăng nhập để lưu tiến độ!");
      router.push('/login');
      return;
    }

    // === SỬA LOGIC TỪ ĐÂY ===
    
    // 1. Lấy tiến độ hiện tại trong DB trước
    const { data: currentProgress } = await supabase
        .from('user_progress')
        .select('current_day')
        .eq('user_id', user.id)
        .eq('book_id', bookId)
        .maybeSingle();

    // 2. Tính toán ngày sẽ lưu
    const nextDay = dayIndex + 1;
    const existingDay = currentProgress?.current_day || 0;

    // Chỉ lưu số lớn hơn (Nếu đang ở bài 5, học lại bài 1 thì vẫn giữ là 5)
    const dayToSave = Math.max(nextDay, existingDay);

    // 3. Ghi vào Database
    const { error } = await supabase
      .from('user_progress')
      .upsert(
        { 
          user_id: user.id, 
          book_id: bookId, 
          current_day: dayToSave, // Dùng số đã tính toán
          updated_at: new Date().toISOString()
        },
        { onConflict: 'user_id, book_id' }
      );
    // ========================

    if (error) {
      console.error("Lỗi lưu tiến độ:", error);
      alert("Có lỗi xảy ra, vui lòng thử lại!");
      setStatus('idle');
    } else {
      setStatus('success');
      
      // ... (Code bắn pháo hoa giữ nguyên) ...
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 50 };
      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);
        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);

      setTimeout(() => {
        router.push(`/book/${bookId}`); 
        router.refresh();
      }, 2000); 
    }
  };

  return (
    <div className="fixed bottom-0 w-full max-w-[420px] p-5 bg-white border-t border-gray-100 z-20">
        <button 
            onClick={handleComplete}
            disabled={status !== 'idle'}
            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg
            ${status === 'success'
                ? "bg-green-600 text-white shadow-green-200 cursor-default scale-105" // Thêm hiệu ứng phóng to
                : "bg-gray-900 text-white shadow-gray-300 hover:bg-gray-800"}`}
        >
            {status === 'loading' && <Loader2 className="animate-spin" />}
            {status === 'success' && <CheckCircle size={20} />}
            
            {status === 'idle' && "Hoàn thành bài học"}
            {status === 'loading' && "Đang lưu..."}
            {status === 'success' && "Xuất sắc!"} {/* Đổi chữ cho sướng */}
        </button>
    </div>
  );
}