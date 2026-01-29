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
 // 5. Cấu trúc Sách với lộ trình
export interface Book {
  id: string;          // ID định danh (vd: 'atomic-habits')
  title: string;       // Tên sách
  author: string;      // Tác giả
  cover: string;       // Link ảnh bìa
  totalDays: number;   // Tổng số ngày
  description: string; // Mô tả ngắn
  // Mảng chứa lộ trình chi tiết các ngày
  roadmap: DayRoadmap[]; 
}