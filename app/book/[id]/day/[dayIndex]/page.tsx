"use client";

import { use, useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { ChevronLeft, CheckCircle, Lock, Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import confetti from "canvas-confetti";

import { LearnSection } from "@/components/book/LearnSection";
import { ActionSection } from "@/components/book/ActionSection";
import { useBookProgress } from "@/hooks/use-book-progress";
import { completeDayAction } from "@/app/actions/update-progress";

export default function DayPage({ params }: { params: Promise<{ id: string; dayIndex: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const bookId = resolvedParams.id;
  
  const currentDayIndex = useMemo(() => {
    const val = parseInt(resolvedParams.dayIndex, 10);
    return isNaN(val) ? 0 : val;
  }, [resolvedParams.dayIndex]);

  const [dayData, setDayData] = useState<any>(null);
  const [userCurrentDay, setUserCurrentDay] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isCompleting, setIsCompleting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isReadyToFinish, setIsReadyToFinish] = useState(false);

  const progress = useBookProgress(bookId, currentDayIndex);

  const isPast = currentDayIndex < userCurrentDay;
  const isPresent = currentDayIndex === userCurrentDay;
  const isFuture = currentDayIndex > userCurrentDay;
  const hasChanges = progress.hasChanges;

  useEffect(() => {
    const fetchData = async () => {
      if (currentDayIndex === 0) return;
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        setUserId(user.id);

        const { data: lesson } = await supabase
          .from("book_days")
          .select("*")
          .eq("book_id", bookId)
          .eq("day_index", currentDayIndex)
          .single();

        setDayData(lesson);

        const { data: prog } = await supabase
          .from('user_progress')
          .select('current_day')
          .eq('user_id', user.id)
          .eq('book_id', bookId)
          .maybeSingle();
        
        if (prog) setUserCurrentDay(prog.current_day);
      } finally {
        setLoading(false);
      }
    };
    if (progress.isLoaded) fetchData();
  }, [bookId, currentDayIndex, progress.isLoaded]);

  const handleComplete = async () => {
    if (!userId || !isReadyToFinish) return;
    setIsCompleting(true);
    progress.saveNow();

    if (isPresent) {
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    }

    const result = await completeDayAction(bookId, currentDayIndex, userId, progress.workbookAnswers);
    if (result.success) {
      if (isPresent) {
        setTimeout(() => router.push(`/book/${bookId}`), 1500);
      } else {
        setIsCompleting(false);
      }
    } else {
      setIsCompleting(false);
    }
  };

  if (loading || !dayData) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" /></div>;

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen pb-32 relative text-slate-900 shadow-2xl">
      <div className="px-6 pt-8 pb-4">
        <Link href={`/book/${bookId}`} className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1 mb-6 hover:text-slate-900 transition-colors">
          <ChevronLeft size={14} /> Quay lại lộ trình
        </Link>
        <div className="flex items-center justify-between mb-2">
           <p className="text-blue-600 font-black text-[10px] uppercase tracking-[0.2em]">Ngày {dayData.day_index}</p>
           {isPast && !hasChanges && (
             <span className="bg-emerald-50 text-emerald-600 text-[9px] font-black px-2 py-1 rounded-md border border-emerald-100 uppercase">Hoàn thành tốt</span>
           )}
        </div>
        <h1 className="text-2xl font-black leading-tight mb-2 tracking-tight">{dayData.title}</h1>
        <p className="text-slate-500 text-sm font-medium italic">{dayData.summary}</p>
      </div>

      <div className="flex border-b border-slate-100 px-6 mt-4 sticky top-0 bg-white/90 backdrop-blur-md z-30">
        <button onClick={() => progress.setActiveTab("LEARN")} className={`flex-1 pb-4 text-[11px] font-black tracking-widest transition-all border-b-4 ${progress.activeTab === "LEARN" ? "text-blue-600 border-blue-600" : "text-slate-300 border-transparent"}`}>BÀI HỌC</button>
        <button onClick={() => progress.setActiveTab("ACTION")} className={`flex-1 pb-4 text-[11px] font-black tracking-widest transition-all border-b-4 ${progress.activeTab === "ACTION" ? "text-blue-600 border-blue-600" : "text-slate-300 border-transparent"}`}>THỰC HÀNH</button>
      </div>

      <div className="p-6">
        {progress.activeTab === "LEARN" ? (
          <LearnSection lessonData={dayData.lesson || dayData.content} onGoToAction={() => progress.setActiveTab("ACTION")} />
        ) : (
          <ActionSection 
            isSaving={progress.isSaving}
            practice={{ workbook: dayData.practice?.workbook, quiz: dayData.practice?.quiz }}
            giftContent={dayData.gift?.title || dayData.gift?.content} 
            progress={{
              answers: progress.workbookAnswers,
              updateWorkbook: progress.updateWorkbook,
              quizState: progress.quizState,
              updateQuiz: progress.updateQuiz
            }}
            onReadyChange={(ready: boolean) => setIsReadyToFinish(ready)}
          />
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 z-50 pointer-events-none">
        <div className="w-full max-w-sm mx-auto pointer-events-auto">
          {isFuture ? (
            <div className="w-full py-5 bg-slate-50 text-slate-400 font-black text-xs tracking-widest rounded-3xl flex items-center justify-center gap-2 border border-slate-200 shadow-sm">
              <Lock size={16} /> BÀI HỌC ĐANG KHÓA
            </div>
          ) : isPast && !hasChanges ? (
            /* 🔥 Trạng thái ĐÃ XONG: Render nhãn tĩnh */
            <div className="w-full py-5 bg-emerald-50 text-emerald-600 font-black text-[11px] tracking-[0.2em] rounded-3xl flex items-center justify-center gap-2 border-2 border-emerald-100 opacity-90 shadow-md">
              <CheckCircle size={18} /> NHIỆM VỤ ĐÃ HOÀN THÀNH
            </div>
          ) : (
            /* 🔥 Trạng thái CẦN LÀM / CẬP NHẬT: Render nút bấm */
            <button 
              onClick={handleComplete} 
              disabled={isCompleting || !isReadyToFinish} 
              className={`w-full py-5 rounded-3xl font-black text-xs tracking-[0.15em] flex items-center justify-center gap-3 transition-all active:scale-95 shadow-2xl ${
                !isReadyToFinish 
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none" 
                  : isPast && hasChanges ? "bg-blue-600 text-white shadow-blue-200" : "bg-slate-900 text-white shadow-slate-900/40"
              }`}
            >
              {isCompleting ? <Loader2 className="animate-spin" size={18} /> : (isPast && hasChanges ? <Save size={18} /> : <CheckCircle size={18} />)}
              {isPast && hasChanges ? "LƯU THAY ĐỔI MỚI" : "HOÀN THÀNH NGÀY " + currentDayIndex}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}