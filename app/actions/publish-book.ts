"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

// ⚠️ Đảm bảo dùng SERVICE_ROLE_KEY để Bypass RLS (Quyền Admin)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_SUPABASE_SERVICE_KEY!, 
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

interface RoadmapData {
  title: string;
  author: string;
  total_days: number;
  roadmap: Array<{
    day_index: number;
    title: string;
    summary: string;
    content: string;
    workbook: any;
    quiz: any;
    gift: any;
  }>;
}

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .replace(/đ/g, "d") // 🔥 QUAN TRỌNG: Biến đ thành d trước khi xử lý
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Bỏ dấu
    .replace(/\s+/g, "-") // Space thành gạch ngang
    .replace(/[^\w\-]+/g, "") // Bỏ ký tự lạ
    .replace(/\-\-+/g, "-") // Bỏ gạch ngang kép
    .trim();
}

export async function publishBookAction(data: RoadmapData) {
  try {
    const bookId = slugify(data.title);

    console.log(`🚀 Publishing: [${bookId}] ${data.title}`);

    // --- BƯỚC 1: LƯU BẢNG BOOKS ---
    const { error: bookError } = await supabase
      .from("books")
      .upsert({
        id: bookId,
        title: data.title,
        author: data.author,
        total_days: data.total_days,
        cover: "", 
        // 🔥 FIX LỖI 23502 Ở ĐÂY:
        // Database của bạn yêu cầu cột 'roadmap' không được null
        // Nên ta ném luôn cục JSON roadmap vào đây để thỏa mãn điều kiện.
        roadmap: data.roadmap 
      })
      .select();

    if (bookError) {
      console.error("❌ Lỗi lưu bảng books:", bookError);
      return { success: false, message: `Lỗi books: ${bookError.message}` };
    }

    // --- BƯỚC 2: LƯU BẢNG BOOK_DAYS (Chi tiết) ---
    // Vẫn lưu vào đây để sau này truy vấn từng ngày cho nhanh
    const daysData = data.roadmap.map((day) => ({
      book_id: bookId,
      day_index: day.day_index,
      title: day.title,
      summary: day.summary,
      content: day.content,
      workbook: day.workbook,
      quiz: day.quiz,
      gift: day.gift,
    }));

    const { error: daysError } = await supabase
      .from("book_days")
      .upsert(daysData, { onConflict: "book_id, day_index" });

    if (daysError) {
      console.error("❌ Lỗi lưu bảng book_days:", daysError);
      return { success: false, message: `Lỗi book_days: ${daysError.message}` };
    }

    console.log("✅ Xuất bản thành công!");

    revalidatePath("/"); 
    revalidatePath(`/book/${bookId}`);

    return { success: true, bookId: bookId };

  } catch (error: any) {
    console.error("Critical Error:", error);
    return { success: false, message: error.message || "Lỗi hệ thống" };
  }
}