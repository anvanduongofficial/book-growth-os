"use server";

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * PHASE 1: DNA EXTRACTION (Từ Text thuần)
 */
export async function extractBookDNA(text: string) {
  try {
    // Chúng ta chỉ lấy 15,000 ký tự đầu để đảm bảo không tràn context window và tối ưu token
    const cleanText = text.substring(0, 15000);

const prompt = `
VAI TRÒ: 
Bạn là một Forensic Content Auditor (Thanh tra nội dung pháp y). Nhiệm vụ của bạn là bóc tách "Bản thiết kế hệ thống" từ văn bản. 

NGUYÊN TẮC "THIẾT QUÂN LUẬT" (CẬP NHẬT):
1. CẤM ẢO GIÁC TOÁN HỌC (NO HALLUCINATED FORMALISM): Không tự chế ra các phép chia/nhân nếu tác giả không quy định. Nếu không có công thức toán học, hãy dùng "Logic Pipeline" (Ví dụ: A -> B -> C).
2. TRUY QUÉT DANH TỪ RIÊNG: Chỉ trích xuất các mô hình, quy tắc mà tác giả đặt tên riêng (Ví dụ: Mô hình 3 Lớp, Quy tắc 12-7). Cấm dùng ngôn ngữ Consulting chung chung.
3. CHI TIẾT NGÀNH (INDUSTRY-SPECIFIC): Bỏ qua "tư duy nghèo/giàu". Phải tìm bẫy đặc thù của ngành trong sách (Ví dụ: Bẫy tự làm một mình, Bẫy hoa hồng, Bẫy bận rộn giả tạo).
4. MỆNH LỆNH VẬT LÝ: Brutal Action phải là con số đo lường được hàng ngày (Daily Quota).

VĂN BẢN ĐỂ GIẢI PHẪU:
---
${cleanText}
---

OUTPUT JSON SCHEMA:
{
  "metadata": {
    "title": "Tên sách gốc",
    "author": "Tác giả",
    "proprietary_system": "Tên hệ thống cốt lõi của tác giả (Ví dụ: The 4 Models of MREA)."
  },
  "hard_logic": [
    {
      "concept": "Tên mô hình/quy trình độc quyền",
      "logic_path": "Chuỗi vận hành (Ví dụ: Tìm khách -> Hẹn gặp -> Ký gửi -> Chốt đơn)",
      "quantitative_benchmarks": "Các con số định chuẩn thực tế từ sách (Ví dụ: Tỷ lệ chốt 65%, 3 giờ tìm khách/ngày)",
      "formula_or_sequence": "Chỉ ghi công thức nếu ĐÚNG TRONG SÁCH, nếu không hãy ghi chuỗi logic liên hoàn."
    }
  ],
  "shadow_traps": [
    {
      "name": "Tên bẫy đặc thù ngành",
      "description": "Vạch trần sự bận rộn vô nghĩa hoặc cái tôi sai lầm của người làm nghề",
      "brutal_consequence": "Sự thất bại định lượng (Ví dụ: Kiệt sức sau 6 tháng, Pipeline rỗng tuếch)"
    }
  ],
  "brutal_actions": [
    {
      "task": "Mệnh lệnh thực thi hàng ngày (Phải có con số)",
      "friction_factor": "Tại sao người dùng sẽ cảm thấy 'nhục' hoặc sợ hãi khi phải nhấc máy/làm việc này?",
      "expected_outcome": "Sự thật trần trụi về năng lực thực tế sau khi làm"
    }
  ],
  "expert_quotes": ["Chỉ chọn quote signature của riêng tác giả này"],
  "forensic_audit_report": "Thú nhận trung thực: Phần nào là trích dẫn nguyên văn, phần nào là logic suy diễn từ hệ thống của tác giả?"
}
`;

    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "Bạn là Knowledge Architect. Trả về JSON nguyên khối." },
        { role: "user", content: prompt }
      ],
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    return JSON.parse(completion.choices[0].message.content || "{}");
  } catch (error) {
    console.error("Lỗi Phase 1:", error);
    return null;
  }
}

/**
 * PHASE 2: ROADMAP SYNTHESIS (Giữ nguyên logic chế tác)
 */
export async function synthesizeRoadmap(dnaData: any) {
  try {
    const prompt = `
Dựa trên DNA tri thức sau, hãy thiết kế Roadmap 10 ngày "Shadow Coach".
DNA: ${JSON.stringify(dnaData)}
Yêu cầu: 10 ngày, giọng văn tàn nhẫn, ép thực thi hành động. Output JSON Schema roadmap.
`;

    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "Bạn là Shadow Coach. Trả về JSON roadmap 10 ngày." },
        { role: "user", content: prompt }
      ],
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      temperature: 0.8,
    });

    return JSON.parse(completion.choices[0].message.content || "{}");
  } catch (error) {
    return null;
  }
}