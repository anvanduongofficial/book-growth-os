"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_SUPABASE_SERVICE_KEY!, 
  { auth: { autoRefreshToken: false, persistSession: false } }
);

function slugify(text: string) {
  return text.toString().toLowerCase().replace(/đ/g, "d").normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "").replace(/\-\-+/g, "-").trim();
}

export async function publishBookAction(data: any) {
  try {
    const bookId = slugify(data.title);

    // 1. Upsert vào bảng books
    const { error: bookError } = await supabase.from("books").upsert({
      id: bookId,
      title: data.title,
      author: data.author,
      cover: data.cover || "",
      description: data.description || "",
      category: data.category || [],
      total_days: data.roadmap.length,
      dna: data.dna, // 🔥 Đã có cột này sau khi chạy SQL
      roadmap: data.roadmap 
    });

    if (bookError) throw new Error(`Lỗi bảng books: ${bookError.message}`);

    // 2. Mapping bài học vào book_days
    const daysData = data.roadmap.map((day: any) => ({
      book_id: bookId,
      day_index: day.day_index,
      title: day.title,
      summary: day.lesson.summary_highlight, // Hiện dưới tiêu đề bài học
      lesson: day.lesson,     // Chứa Trap, Shift, Proof, Micro-action
      practice: day.practice, // Chứa Workbook, Quiz
      xp: day.xp || 100,
      gift: day.gift || null
    }));

    const { error: daysError } = await supabase
      .from("book_days")
      .upsert(daysData, { onConflict: "book_id, day_index" });

    if (daysError) throw new Error(`Lỗi bảng book_days: ${daysError.message}`);

    revalidatePath("/");
    revalidatePath(`/book/${bookId}`);
    return { success: true, bookId };
  } catch (error: any) {
    console.error("Critical Error:", error.message);
    return { success: false, message: error.message };
  }
}