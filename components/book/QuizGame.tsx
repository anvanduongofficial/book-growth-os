"use client";

import { CheckCircle, Trophy, XCircle } from "lucide-react"; // Thêm icon

interface QuizProps {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  // State từ cha
  selectedOption: number | null;
  isSubmitted: boolean;
  onSelect: (idx: number) => void;
  onSubmit: () => void;
}

export const QuizGame = ({ 
  question, options, correctAnswer, explanation,
  selectedOption, isSubmitted, onSelect, onSubmit 
}: QuizProps) => {
  
  // Hàm làm sạch text (bỏ các ký tự đánh dấu nếu có)
  const cleanOptionText = (text: string) => text.replace(/^\s*[A-D]\.\s*/i, "").trim();
  return (
    <div className="space-y-4">
      {/* HEADER QUIZ */}
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-lg flex items-center gap-2 text-slate-800">
          <Trophy className="text-purple-500" size={20}/> 
          Check nhanh tư duy
        </h3>

        {/* INDICATOR TRẠNG THÁI */}
        {isSubmitted && (
             <span className="text-xs font-medium text-green-600 flex items-center gap-1 bg-green-50 px-2 py-1 rounded-full border border-green-100">
                <CheckCircle size={12} /> Đã hoàn thành
            </span>
        )}
      </div>

      <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
        <p className="font-medium mb-5 text-slate-800 text-base leading-relaxed">{question}</p>
        
        <div className="space-y-3">
          {options.map((opt, idx) => {
            const isCorrect = idx === correctAnswer;
            const isSelected = idx === selectedOption;
            const displayText = cleanOptionText(opt);
            
            // Logic Class UI
            let btnClass = "w-full text-left p-4 rounded-xl border text-sm transition-all duration-200 relative ";
            
            if (isSubmitted) {
              if (isCorrect) {
                  // Đáp án ĐÚNG (khi đã nộp)
                  btnClass += "bg-green-100 border-green-500 text-green-800 font-bold shadow-sm";
              } else if (isSelected) {
                  // Đáp án User chọn SAI (khi đã nộp)
                  btnClass += "bg-red-50 border-red-300 text-red-700 opacity-70";
              } else {
                  // Các đáp án khác
                  btnClass += "bg-white border-slate-200 opacity-50 grayscale";
              }
            } else {
              // Chưa nộp bài
              if (isSelected) {
                  // Đang chọn
                  btnClass += "bg-blue-50 border-blue-500 text-blue-800 ring-1 ring-blue-500 shadow-sm font-medium";
              } else {
                  // Bình thường
                  btnClass += "bg-white border-slate-200 hover:bg-white hover:border-blue-300 hover:shadow-sm text-slate-600";
              }
            }

            return (
              <button 
                key={idx} 
                disabled={isSubmitted} // Khoá không cho chọn lại khi đã nộp
                onClick={() => onSelect(idx)} 
                className={btnClass}
              >
                <div className="flex items-center gap-3">
                    {/* Icon A, B, C giả lập */}
                    <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold border ${
                        isSubmitted && isCorrect ? "bg-green-200 border-green-400 text-green-800" :
                        isSubmitted && isSelected ? "bg-red-200 border-red-400 text-red-800" :
                        isSelected ? "bg-blue-100 border-blue-400 text-blue-700" :
                        "bg-slate-100 border-slate-300 text-slate-500"
                    }`}>
                        {String.fromCharCode(65 + idx)}
                    </span>
                    {displayText}
                    
                    {/* Icon check đúng sai */}
                    {isSubmitted && isCorrect && <CheckCircle size={18} className="ml-auto text-green-600" />}
                    {isSubmitted && isSelected && !isCorrect && <XCircle size={18} className="ml-auto text-red-500" />}
                </div>
              </button>
            )
          })}
        </div>
        
        {/* BUTTON KIỂM TRA / GIẢI THÍCH */}
        {!isSubmitted ? (
            <button 
            onClick={onSubmit} 
            disabled={selectedOption === null}
            className="mt-6 w-full py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed text-sm transition-all shadow-lg shadow-slate-200 active:scale-[0.98]">
            KIỂM TRA ĐÁP ÁN
            </button>
        ) : (
            <div className="mt-6 p-4 bg-blue-50 text-blue-900 text-sm rounded-xl border border-blue-100 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex gap-2">
                    <span className="font-bold shrink-0">💡 Giải thích:</span> 
                    <span className="opacity-90 leading-relaxed">{explanation}</span>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};