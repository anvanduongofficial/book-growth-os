"use client";

import { useState, useEffect, useCallback, useMemo } from "react";

export type TabType = "LEARN" | "ACTION";

export interface QuizState {
  selected: number | null;
  isSubmitted: boolean;
}

export function useBookProgress(bookId: string, dayIndex: number) {
  const storageKey = `book_progress_${bookId}_day_${dayIndex}`;
  const draftKey = `${storageKey}_draft`; // Key riêng cho dữ liệu nháp

  const [isLoaded, setIsLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTabState] = useState<TabType>("LEARN");

  // 🔥 CHÌA KHÓA: Tách biệt dữ liệu Đã chốt và dữ liệu Nháp
  const [dbAnswers, setDbAnswers] = useState<Record<string, string>>({}); // Dữ liệu đã nhấn Save
  const [localAnswers, setLocalAnswers] = useState<Record<string, string>>({}); // Dữ liệu đang gõ
  const [quizState, setQuizState] = useState<QuizState>({ selected: null, isSubmitted: false });

  // 1. LOAD DATA: Ưu tiên dữ liệu đã chốt, nếu không có mới lấy nháp
  useEffect(() => {
    setIsLoaded(false);
    
    const savedConfirmed = localStorage.getItem(storageKey);
    const savedDraft = localStorage.getItem(draftKey);

    if (savedConfirmed) {
      const parsed = JSON.parse(savedConfirmed);
      setDbAnswers(parsed.workbookAnswers || {});
      setQuizState(parsed.quizState || { selected: null, isSubmitted: false });
      // Nếu có nháp, ưu tiên hiển thị nháp để người dùng gõ tiếp
      setLocalAnswers(savedDraft ? JSON.parse(savedDraft) : parsed.workbookAnswers);
    } else if (savedDraft) {
      setLocalAnswers(JSON.parse(savedDraft));
    }

    setIsLoaded(true);
  }, [storageKey, draftKey]);

  // 🔥 2. LOGIC KIỂM TRA THAY ĐỔI (So sánh Nháp và Thật)
  const hasChanges = useMemo(() => {
    return JSON.stringify(dbAnswers) !== JSON.stringify(localAnswers);
  }, [dbAnswers, localAnswers]);

  // 3. AUTO-SAVE NHÁP (Lưu vào LocalStorage để không mất khi thoát, nhưng không cập nhật dbAnswers)
  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem(draftKey, JSON.stringify(localAnswers));
  }, [localAnswers, draftKey, isLoaded]);

  // 4. HÀM XÁC NHẬN (Lưu chính thức) - Chốt chặn Tầng 2
  const saveNow = useCallback(() => {
    setIsSaving(true);
    
    const dataToSave = { 
      workbookAnswers: localAnswers, 
      quizState, 
      activeTab 
    };

    // Lưu vào Key chính thức
    localStorage.setItem(storageKey, JSON.stringify(dataToSave));
    
    // 🔥 Cập nhật dbAnswers để khớp với localAnswers -> hasChanges sẽ về false
    setDbAnswers(localAnswers);
    
    setTimeout(() => setIsSaving(false), 500);
  }, [localAnswers, quizState, activeTab, storageKey]);

  // Các hàm update
  const updateWorkbook = (fieldId: string, value: string) => {
    setLocalAnswers(prev => ({ ...prev, [fieldId]: value }));
  };

  const updateQuiz = (selected: number | null, isSubmitted: boolean) => {
    setQuizState(prev => ({ ...prev, selected, isSubmitted }));
  };

  const setActiveTab = (tab: TabType) => {
    setActiveTabState(tab);
  };

  const resetData = () => {
    const prefix = `book_progress_${bookId}`;
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(prefix)) {
            localStorage.removeItem(key);
        }
    }
    setLocalAnswers({});
    setDbAnswers({});
    setQuizState({ selected: null, isSubmitted: false });
  };

  return {
    isLoaded,
    isSaving,
    activeTab,
    setActiveTab,
    workbookAnswers: localAnswers, // UI luôn hiển thị những gì đang gõ (nháp)
    updateWorkbook,
    quizState,
    updateQuiz,
    resetData,
    saveNow,      // Hàm nhấn để Chốt dữ liệu
    hasChanges,   // Biến để biết có đang sửa đổi mà chưa chốt hay không
  };
}