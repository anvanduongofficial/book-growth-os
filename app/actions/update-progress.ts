"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_SUPABASE_SERVICE_KEY!,
  { auth: { persistSession: false } }
);

export async function completeDayAction(bookId: string, dayIndex: number, userId: string) {
  console.log(`🚀 [START] Check Progress: User=${userId}, Book=${bookId}, Day=${dayIndex}`);

  try {
    // 1. Lấy tiến độ hiện tại trong DB
    const { data: currentProgress } = await supabase
      .from('user_progress')
      .select('current_day')
      .eq('user_id', userId)
      .eq('book_id', bookId)
      .maybeSingle();

    // Nếu chưa có record, mặc định đang ở ngày 1
    const currentDbDay = currentProgress?.current_day || 1;
    console.log(`ℹ️ [DB STATE] User đang ở Day: ${currentDbDay}. Request hoàn thành Day: ${dayIndex}`);

    // --- 🔥 LOGIC FIX NGHIÊM NGẶT TẠI ĐÂY ---
    
    // TRƯỜNG HỢP 1: User hoàn thành đúng ngày đang học -> HỢP LỆ
    if (dayIndex === currentDbDay) {
        const nextDay = currentDbDay + 1;
        console.log(`✅ [VALID] Hoàn thành đúng lộ trình. Mở khóa Day ${nextDay}...`);
        
        const { error } = await supabase
            .from('user_progress')
            .upsert({
                user_id: userId,
                book_id: bookId,
                current_day: nextDay, // Luôn tăng dựa trên DB Day, không dựa trên Client Day
                updated_at: new Date().toISOString()
            }, { onConflict: 'user_id, book_id' });

        if (error) throw error;
    } 
    // TRƯỜNG HỢP 2: User cố tình nhảy cóc (Ví dụ đang Day 1 mà request Day 7) -> CHẶN
    else if (dayIndex > currentDbDay) {
        console.warn(`⛔ [BLOCK] User cố tình nhảy cóc từ Day ${currentDbDay} lên Day ${dayIndex}. Từ chối update.`);
        return { success: false, message: "Bạn chưa hoàn thành các bài học trước đó!" };
    } 
    // TRƯỜNG HỢP 3: User học lại bài cũ (Day 1, request Day 1 lại hoặc Day 0) -> BỎ QUA
    else {
        console.log(`⚠️ [SKIP] User học lại bài cũ (Day ${dayIndex} < Day ${currentDbDay}). Không thay đổi tiến độ.`);
    }

    // 2. Revalidate
    revalidatePath(`/book/${bookId}`);
    return { success: true };

  } catch (error: any) {
    console.error("❌ [ERROR]", error);
    return { success: false, message: error.message };
  }
}