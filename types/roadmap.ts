// 1. Cấu trúc DNA (Xương sống tri thức)
export interface HardLogic {
  concept: string;
  logic_path: string;
  benchmarks?: string;
  formula?: string;
}

export interface ShadowTrap {
  name: string;
  description: string;
  consequence: string;
}

export interface SummaryDNA {
  proprietary_system: string;
  core_philosophy: string;
  hard_logics: HardLogic[];
  shadow_traps: ShadowTrap[];
  expert_quotes: string[];
}

// 2. Cấu trúc Bài học (Tab 1)
export interface DailyLesson {
  summary_highlight: string; // Câu dưới tiêu đề (Vd: Mỗi phút trôi qua...)
  trap: string;              // Card Đỏ
  shift: string;             // Card Xanh Dương
  proof: string;             // Card Xám
  micro_action: string;      // Card Xanh Lá
}

// 3. Cấu trúc Thực hành (Tab 2)
export type FieldType = 'text' | 'number' | 'checkbox' | 'time' | 'location';

export interface WorkbookField {
  id: string;
  label: string;
  placeholder: string;
  type: FieldType;
}

export interface DailyPractice {
  workbook?: {
    title: string;
    fields: WorkbookField[];
    calculation_logic?: {
      formula: string;      // Ví dụ: "f1 - f2"
      result_label: string;
      unit: string;
    };
  };
  quiz?: {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  };
}

// 4. Cấu trúc một Ngày học hoàn chỉnh
export interface RoadmapDay {
  day_index: number;
  title: string;
  lesson: DailyLesson;
  practice: DailyPractice;
  xp: number;
  gift?: {
    title: string;
    imageUrl: string;
  };
}

// 5. Cấu trúc Sách tổng thể để lưu Database
export interface Book {
  id: string;
  title: string;
  author: string;
  cover: string;
  description: string;
  category: string[];
  total_days: number;
  dna: SummaryDNA;
  roadmap: RoadmapDay[];
  isPublished: boolean;
  createdAt: string;
}