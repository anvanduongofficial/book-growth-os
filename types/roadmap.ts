// src/types/roadmap.ts

export type ToolType = 'checklist' | 'calculator';

// 1. Cấu trúc cho Checklist
export interface ChecklistItem {
  id: string;
  label: string;
}

// 2. Cấu trúc cho Calculator
export interface CalculatorConfig {
  input_label: string;
  result_label: string;
  suffix?: string;
}

// 3. Cấu trúc Tool đa hình (Polymorphic)
export interface ActionTool {
  id: string;
  type: ToolType;
  title: string;
  description?: string;
  
  // Dữ liệu tuỳ chọn cho từng loại tool
  items?: ChecklistItem[];
  config?: CalculatorConfig;
}

// 4. Cấu trúc 1 Ngày
export interface DayRoadmap {
  day_index: number;
  title: string;
  summary: string;
  tools: ActionTool[];
}

// Định nghĩa cấu trúc cho "Workbook" (Bài tập điền vào chỗ trống)
export interface WorkbookField {
  id: string;
  label: string;      // Ví dụ: "Hành động cụ thể"
  placeholder: string; // Ví dụ: "Đọc sách 2 trang..."
  type: 'text' | 'time' | 'location'; // Để hiện đúng bàn phím nhập
}

// Định nghĩa cấu trúc cho "Quiz" (Trắc nghiệm nhanh)
export interface Quiz {
  question: string;
  options: string[];  // ["A. 1%", "B. 50%", "C. 100%"]
  correctAnswer: number; // Index của câu đúng (0, 1, hoặc 2)
  explanation: string;   // Giải thích tại sao đúng (User rất thích cái này)
}

// Định nghĩa cấu trúc cho "Quà tặng" (Asset)
export interface Asset {
  type: 'audio' | 'image' | 'pdf';
  url: string;        // Link file trên Supabase Storage
  title: string;      // Ví dụ: "Audio tóm tắt (3 phút)"
}

// Cấu trúc MỚI của một Ngày học
export interface RoadmapDay {
  day_index: number;      // Ngày 1, 2, 3
  title: string;          // Tên bài
  summary: string;        // Mô tả ngắn (hiện ở card bên ngoài)
  
  // --- PHẦN PREMIUM CONTENT ---
  content: string;        // Nội dung chính (Markdown/HTML)
  audioUrl?: string;      // Link file nghe (Option)
  
  // --- PHẦN TƯƠNG TÁC (INTERACTIVE) ---
  workbook?: {
    title: string;        // Ví dụ: "Thiết kế thói quen của bạn"
    fields: WorkbookField[];
  };
  
  // --- PHẦN GAMIFICATION ---
  quiz?: Quiz;            // Câu hỏi kiểm tra
  xp: number;             // Điểm thưởng (vd: 50 XP)
  
  // --- PHẦN QUÀ TẶNG ---
  gift?: {
    title: string;        // "Hình nền điện thoại Quote hay nhất"
    imageUrl: string;
  };
}

// Cấu trúc sách tổng thể
export interface Book {
  id: string;
  title: string;
  author: string;
  cover: string;
  totalDays: number;
  description: string;
  category: string[];
  roadmap: RoadmapDay[]; // Mảng các ngày học theo cấu trúc mới
}