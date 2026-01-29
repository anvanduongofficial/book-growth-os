// src/components/roadmap/ContinueButton.tsx
"use client";

import Link from "next/link";
import { Play, ChevronRight } from "lucide-react";

interface Props {
  bookId: string;
  dayIndex: number;
  dayTitle: string;
}

export default function ContinueButton({ bookId, dayIndex, dayTitle }: Props) {
  return (
    <div className="fixed bottom-8 left-0 w-full pointer-events-none z-30">
        <div className="w-full max-w-[420px] mx-auto px-6 flex justify-center pointer-events-auto">
            
            <Link href={`/book/${bookId}/day/${dayIndex}`}>
                <button className="group flex items-center gap-3 bg-gray-900 text-white pl-5 pr-6 py-3.5 rounded-full shadow-2xl shadow-blue-200 hover:scale-[1.02] active:scale-95 transition-all duration-300">
                    
                    {/* Icon Play */}
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                        <Play size={14} fill="currentColor" className="ml-0.5" />
                    </div>
                    
                    {/* Text */}
                    <div className="flex flex-col items-start">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Tiếp tục</span>
                        <span className="text-sm font-bold leading-none">Ngày {dayIndex}: {dayTitle}</span>
                    </div>

                    {/* Arrow */}
                    <ChevronRight size={16} className="text-gray-500 group-hover:text-white transition-colors ml-2" />
                </button>
            </Link>
        </div>
    </div>
  );
}