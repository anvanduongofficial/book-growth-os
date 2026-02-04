"use client";

import { useState, useEffect } from "react";
import { WorkbookForm } from "./WorkbookForm";
import { QuizGame } from "./QuizGame";
import { Gift, Quote } from "lucide-react";

export const ActionSection = ({ practice, progress, isSaving, onReadyChange, giftContent }: any) => {
  // 🔥 FIX: Kiểm tra xem dữ liệu trong Database đã hoàn thiện chưa ngay từ lúc load
  const hasWorkbookInitial = !practice?.workbook || 
    (practice.workbook.fields.every((f: any) => progress.answers[f.id]?.trim().length > 0));
  
  const hasQuizInitial = !practice?.quiz || progress.quizState.isSubmitted;

  // Trạng thái xác nhận
  const [wbConfirmed, setWbConfirmed] = useState(hasWorkbookInitial);
  const [quizConfirmed, setQuizConfirmed] = useState(hasQuizInitial);

  // 🔥 Đảm bảo luôn báo cáo trạng thái Sẵn sàng cho DayPage
  useEffect(() => {
    const isReady = wbConfirmed && quizConfirmed;
    onReadyChange(isReady);
  }, [wbConfirmed, quizConfirmed, onReadyChange]);

  return (
    <div className="space-y-10 pb-12">
      {practice?.workbook && (
        <WorkbookForm 
            fields={practice.workbook.fields}
            answers={progress.answers}
            onAnswerChange={(id: string, val: string) => {
              progress.updateWorkbook(id, val);
              // Khi gõ thay đổi, bắt buộc phải nhấn Xác nhận lại
              setWbConfirmed(false);
            }}
            isSaving={isSaving}
            calculationLogic={practice.workbook.calculation_logic}
            onConfirm={() => setWbConfirmed(true)}
            initialConfirmed={wbConfirmed}
        />
      )}

      {practice?.quiz && (
        <div className="pt-4 border-t border-slate-100">
          <QuizGame 
              {...practice.quiz}
              selectedOption={progress.quizState.selected}
              isSubmitted={progress.quizState.isSubmitted}
              onSelect={(idx: number) => {
                progress.updateQuiz(idx, false);
                setQuizConfirmed(false);
              }}
              onSubmit={() => {
                progress.updateQuiz(progress.quizState.selected, true);
                setQuizConfirmed(true);
              }}
          />
        </div>
      )}

      {giftContent && (
        <div className="pt-8">
           <div className="w-full aspect-[3/4] rounded-[2.5rem] bg-slate-900 flex flex-col items-center justify-center p-10 text-center relative overflow-hidden">
             <Quote size={32} className="text-white/20 mb-6" />
             <p className="text-white font-serif text-lg italic leading-relaxed">"{giftContent}"</p>
          </div>
        </div>
      )}
    </div>
  );
};