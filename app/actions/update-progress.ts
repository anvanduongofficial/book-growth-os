"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_SUPABASE_SERVICE_KEY!
);

export async function completeDayAction(
  bookId: string, 
  dayIndex: number, 
  userId: string,
  answers: Record<string, string> // 🔥 THÊM THAM SỐ THỨ 4 Ở ĐÂY
) {
  try {
    // 1. Lấy tiến độ hiện tại của user
    const { data: currentProgress } = await supabase
      .from('user_progress')
      .select('answers, current_day')
      .eq('user_id', userId)
      .eq('book_id', bookId)
      .maybeSingle();

    // 2. Cập nhật mảng answers: Giữ lại câu trả lời các ngày cũ, cập nhật ngày hiện tại
    const updatedAnswers = {
      ...(currentProgress?.answers || {}),
      [dayIndex]: answers // Lưu answers theo key là số ngày
    };

    // 3. Tính toán ngày tiếp theo nếu là bài học mới nhất
    const nextDay = Math.max(currentProgress?.current_day || 1, dayIndex + 1);

    const { error } = await supabase
      .from('user_progress')
      .upsert({
        user_id: userId,
        book_id: bookId,
        current_day: nextDay,
        answers: updatedAnswers,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id, book_id' });

    if (error) throw error;

    revalidatePath(`/book/${bookId}`);
    return { success: true };
  } catch (error: any) {
    console.error("Lỗi completeDayAction:", error);
    return { success: false, message: error.message };
  }
}