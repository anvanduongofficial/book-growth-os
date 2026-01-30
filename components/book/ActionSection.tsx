import { QuizGame } from "./QuizGame";
import { Gift, Quote } from "lucide-react";
import { WorkbookForm } from "./WorkbookForm";
import { useMemo } from "react";

// Định nghĩa lại type cho gọn (hoặc import từ file types chung)
interface ActionSectionProps {
  workbook: any; // Type chi tiết giống schema
  quiz: any;
  giftContent: string;
  progress: any; 
  isSaving: boolean; 
}

const formatQuote = (text: string) => {
  if (!text) return "Hành động nhỏ tạo nên thay đổi lớn.";
  
  // Nếu AI lỡ trả về dấu gạch dưới thì vẫn xử lý, còn không thì thôi
  const cleanText = text.replace(/_/g, " ").trim();
  
  // Viết hoa chữ cái đầu, các chữ sau giữ nguyên (để tôn trọng tên riêng nếu có)
  // Lưu ý: Bỏ .toLowerCase() đi để tránh biến tên riêng thành chữ thường
  return cleanText.charAt(0).toUpperCase() + cleanText.slice(1);
};

const GIFT_GRADIENTS = [
  "bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900",
  "bg-gradient-to-br from-fuchsia-900 via-purple-900 to-fuchsia-900",
  "bg-gradient-to-br from-teal-900 via-emerald-900 to-teal-900",
  "bg-gradient-to-br from-rose-900 via-red-900 to-rose-900",
  "bg-gradient-to-br from-amber-900 via-orange-900 to-amber-900",
  "bg-gradient-to-br from-indigo-900 via-violet-900 to-indigo-900",
];

export const ActionSection = ({ workbook, quiz, giftContent, progress, isSaving }: ActionSectionProps) => {
  const randomGradient = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * GIFT_GRADIENTS.length);
    return GIFT_GRADIENTS[randomIndex];
  }, []);
  
  const formattedQuote = useMemo(() => formatQuote(giftContent), [giftContent]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {workbook && (
        <WorkbookForm 
            fields={workbook.fields}
            answers={progress.answers}
            onAnswerChange={progress.updateWorkbook}
            isSaving={isSaving} // 👈 TRUYỀN VÀO ĐÂY
        />
      )}
      <hr className="border-slate-100" />
      {quiz && (
        <QuizGame 
            question={quiz.question}
            options={quiz.options}
            correctAnswer={quiz.correctAnswer} // Nhớ check xem data là index (0) hay số (1) để chỉnh
            explanation={quiz.explanation}
            
            // 👇 STATE QUAN TRỌNG
            selectedOption={progress.quizState.selected}
            isSubmitted={progress.quizState.isSubmitted}
            
            // 👇 ACTION QUAN TRỌNG
            onSelect={(idx) => progress.updateQuiz(idx, false)} // Chọn nhưng chưa nộp
            onSubmit={() => progress.updateQuiz(progress.quizState.selected, true)} // Nộp bài
        />
    )}
      
      {/* PHẦN QUÀ TẶNG MỚI - DÙNG CSS CARD VỚI GRADIENT NGẪU NHIÊN */}
      <div>
        <div className="flex items-center justify-center gap-2 text-purple-600 mb-4">
          <Gift size={20} />
          <h3 className="font-bold text-base uppercase tracking-wider">Quà tặng tâm hồn</h3>
        </div>
        
        {/* Card Quote đẹp mắt với gradient ngẫu nhiên */}
        <div className={`relative w-full aspect-[9/16] rounded-3xl overflow-hidden shadow-2xl ring-1 ring-slate-900/5 ${randomGradient} flex flex-col items-center justify-center p-8 text-center`}>
          
          {/* Trang trí background mờ */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
          
          <Quote size={40} className="text-white/20 mb-6" />
          
          {/* Nội dung quote đã được format */}
          <p className="text-white font-serif text-xl md:text-2xl leading-relaxed italic relative z-10 drop-shadow-md">
            "{formattedQuote}"
          </p>
          
          <div className="w-12 h-1 bg-white/20 mt-6 rounded-full"></div>
          
          <p className="text-white/40 text-xs mt-4 uppercase tracking-[0.2em]">Daily Reminder</p>
        </div>

        <p className="text-center text-xs text-slate-500 mt-3 font-medium">
          ✨ Chụp màn hình để lưu làm hình nền
        </p>
      </div>
    </div>
  );
};