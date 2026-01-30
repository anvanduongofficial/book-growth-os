"use client";

import { useState, useEffect, useCallback } from "react"; // Thêm useCallback

export type TabType = "LEARN" | "ACTION";

export interface QuizState {
  selected: number | null;
  isSubmitted: boolean;
}

export function useBookProgress(bookId: string, dayIndex: number) {
  const storageKey = `book_progress_${bookId}_day_${dayIndex}`;
  
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // 🔥 1. THÊM CỜ ĐIỀU KHIỂN AUTO-SAVE (Mặc định là True)
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);

  const [activeTab, setActiveTabState] = useState<TabType>("LEARN");
  const [workbookAnswers, setWorkbookAnswers] = useState<Record<string, string>>({});
  const [quizState, setQuizState] = useState<QuizState>({ selected: null, isSubmitted: false });

  // 1. LOAD DATA
  useEffect(() => {
    setIsLoaded(false);
    // Reset state
    setWorkbookAnswers({});
    setQuizState({ selected: null, isSubmitted: false });

    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.workbookAnswers) setWorkbookAnswers(parsed.workbookAnswers);
        if (parsed.quizState) setQuizState(parsed.quizState);
        if (parsed.activeTab) setActiveTabState(parsed.activeTab);
      } catch (e) {
        console.error("Lỗi parse data:", e);
      }
    }
    setIsLoaded(true);
  }, [storageKey]);

  // 🔥 2. TÁCH LOGIC LƯU RA THÀNH HÀM RIÊNG (để có thể gọi thủ công)
  const persistData = useCallback(() => {
      const dataToSave = { workbookAnswers, quizState, activeTab };
      localStorage.setItem(storageKey, JSON.stringify(dataToSave));
      
      // Hiệu ứng "Đang lưu..."
      setIsSaving(true);
      setTimeout(() => setIsSaving(false), 500);
  }, [workbookAnswers, quizState, activeTab, storageKey]);

  // 3. AUTO-SAVE EFFECT
  useEffect(() => {
    if (!isLoaded) return;
    
    // 🔥 CHỈ LƯU TỰ ĐỘNG NẾU ĐƯỢC PHÉP
    if (autoSaveEnabled) {
        persistData();
    }
  }, [persistData, isLoaded, autoSaveEnabled]); // Chạy khi data thay đổi

  // ... (Các hàm update giữ nguyên)
  const updateWorkbook = (fieldId: string, value: string) => {
    setWorkbookAnswers(prev => ({ ...prev, [fieldId]: value }));
  };

  const updateQuiz = (selected: number | null, isSubmitted: boolean) => {
    setQuizState(prev => ({ ...prev, selected, isSubmitted }));
  };

  const setActiveTab = (tab: TabType) => {
    setActiveTabState(tab);
  };

  const resetData = () => {
    console.log(`🧹 Đang xóa toàn bộ dữ liệu của sách: ${bookId}`);
    
    // BƯỚC 1: Tìm và diệt tất cả key liên quan đến cuốn sách này
    // Key có dạng: book_progress_7-thoi-quen_day_1, book_progress_7-thoi-quen_day_2...
    const prefix = `book_progress_${bookId}`;
    const keysToRemove: string[] = [];

    // Duyệt qua toàn bộ LocalStorage để tìm kẻ địch
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        // Nếu key bắt đầu bằng prefix của sách này -> Đưa vào danh sách tử hình
        if (key && key.startsWith(prefix)) {
            keysToRemove.push(key);
        }
    }

    // Thực thi án tử (Xóa key)
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    // BƯỚC 2: Reset State của trang hiện tại về rỗng (để UI cập nhật ngay)
    setWorkbookAnswers({});
    setQuizState({ selected: null, isSubmitted: false });
    
    console.log(`✅ Đã xóa ${keysToRemove.length} bản ghi tiến độ.`);
  };

  return {
    isLoaded,
    isSaving,
    activeTab,
    setActiveTab,
    workbookAnswers,
    updateWorkbook,
    quizState,
    updateQuiz,
    resetData,
    
    // 🔥 XUẤT 2 MÓN MỚI RA NGOÀI
    setAutoSaveEnabled, // Hàm tắt auto-save
    saveNow: persistData // Hàm ép buộc lưu ngay lập tức
  };
}