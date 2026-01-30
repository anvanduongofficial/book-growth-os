import Link from "next/link";
import { Play } from "lucide-react";

interface Props {
  bookId: string;
  dayIndex: number;
  dayTitle: string;
}

export default function ContinueButton({ bookId, dayIndex, dayTitle }: Props) {
  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-slate-100 flex justify-center">
      <div className="w-full max-w-[420px]">
        <Link 
          href={`/book/${bookId}/day/${dayIndex}`} // <-- Link chuẩn đây
          className="flex items-center justify-between w-full p-4 bg-slate-900 text-white rounded-xl shadow-lg hover:bg-slate-800 transition-all active:scale-95"
        >
          <div className="text-left">
            <p className="text-xs text-slate-400 uppercase font-bold mb-1">Tiếp tục học</p>
            <p className="font-bold text-sm truncate max-w-[200px]">Ngày {dayIndex}: {dayTitle}</p>
          </div>
          
          <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
            <Play size={20} fill="currentColor" />
          </div>
        </Link>
      </div>
    </div>
  );
}