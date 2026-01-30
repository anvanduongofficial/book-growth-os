"use server";

import OpenAI from "openai";

// Khởi tạo client OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateBookContent(bookTitle: string) {
  try {
    const prompt = `
VAI TRÒ:
Bạn là một "Shadow Psychologist" và "Curriculum Architect".

NHIỆM VỤ:
Phân tích cuốn sách "${bookTitle}" và tạo ra một Action Roadmap đánh trực diện vào động cơ tâm lý sâu kín của người đọc.

====================
STEP 1 — QUYẾT ĐỊNH THỜI LƯỢNG (BẮT BUỘC)
====================
- Dựa trên độ sâu và phạm vi của cuốn sách, hãy chọn một số nguyên total_days phù hợp.
- Áp dụng quy chuẩn:
  • Đơn giản/ngắn: 3-5 ngày
  • Self-help tiêu chuẩn: 7-14 ngày
  • Phức tạp/chuyên sâu: 15-21 ngày
- Sau khi chọn total_days, bạn PHẢI tạo đúng số lượng roadmap tương ứng.
- Không được tạo ít hơn hoặc nhiều hơn.

====================
STEP 2 — NGUYÊN TẮC VIẾT (SHADOW STYLE)
====================
- Micro-copy: mỗi phần tối đa 2-3 câu.
- Ngôn từ sắc, thẳng, không giáo điều.
- Không khuyên nhủ. Chỉ phơi bày sự thật khó chịu.
- Đánh vào sự mục ruỗng bên trong: sợ hãi, tự ti, né tránh, giả tạo.

====================
STEP 3 — CẤU TRÚC BẮT BUỘC MỖI NGÀY
====================
1. THE TRAP: Vạch trần động cơ sai lệch.
2. THE SHIFT: 1 insight duy nhất, dưới 20 từ.
3. THE PROOF: 1 khoảnh khắc thất bại hoặc xấu hổ rất cụ thể.
4. THE MICRO-ACTION: Hành động vật lý, làm ngay trong 5 phút.

====================
STEP 4 — RÀNG BUỘC KỸ THUẬT (CỰC QUAN TRỌNG)
====================
- Output MUST be valid JSON.
- roadmap.length MUST === total_days.
- day_index MUST chạy liên tục từ 1 → total_days.
- Không được kết thúc sớm.
- Output thiếu ngày được coi là SAI.

====================
OUTPUT JSON SCHEMA (BẮT BUỘC TUÂN THỦ)
====================
{
  "title": "Tên sách tiếng Việt chuẩn",
  "author": "Tên tác giả",
  "total_days": <number>,
  "roadmap": [
    {
      "day_index": 1,
      "title": "Tiêu đề ngắn, gây sốc (≤10 từ)",
      "summary": "1 câu tóm tắt tàn nhẫn.",
      "content": "<p><b>1. THE TRAP:</b> ...</p><p><b>2. THE SHIFT:</b> ...</p><p><b>3. THE PROOF:</b> ...</p><p><b>4. THE MICRO-ACTION:</b> ...</p>",
      "audioUrl": "",
      "xp": 50,
      "workbook": {
        "title": "Thực hành 24h",
        "fields": [
          {
            "id": "f1",
            "label": "Câu hỏi buộc người đọc tự thú",
            "placeholder": "Thú nhận đi...",
            "type": "text"
          },
          {
            "id": "f2",
            "label": "Mệnh lệnh hành động cụ thể",
            "placeholder": "Cam kết...",
            "type": "text"
          },
          {
            "id": "f3",
            "label": "Thời gian thực hiện?",
            "placeholder": "VD: 21:00",
            "type": "time"
          }
        ]
      },
      "quiz": {
        "question": "Tình huống bắt buộc phải chọn lựa",
        "options": [
          "Lựa chọn hèn nhát theo bản năng",
          "Lựa chọn dũng cảm đúng tinh thần sách",
          "Một lựa chọn sai khác"
        ],
        "correctAnswer": 1,
        "explanation": "1 câu ngắn."
      },
      "gift": {
        "title": "Thông điệp",
        "content": "Một câu quote tiếng Việt có dấu, sắc và sâu."
      }
    }
  ]
}

`;

    const completion = await openai.chat.completions.create({
      messages: [
        { 
          role: "system", 
          // SỬA LẠI SYSTEM PROMPT CHO KHỚP
          content: "Bạn là Shadow Psychologist. Bạn chuyên viết nội dung ngắn gọn, sắc bén, đánh trúng tâm lý đen tối của con người để giúp họ thay đổi. Output JSON only."
        },
        { role: "user", content: prompt }
      ],
      model: "gpt-4o-mini", // Mini là đủ thông minh và rẻ cho task này
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const content = completion.choices[0].message.content;
    
    if (!content) return null;

    return JSON.parse(content);

  } catch (error) {
    console.error("Lỗi OpenAI:", error);
    return null;
  }
}