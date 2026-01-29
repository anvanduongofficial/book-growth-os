// src/components/roadmap/RoadmapDayItem.tsx
"use client";

import Link from "next/link";
import { Lock, CheckCircle, Clock, Zap } from "lucide-react";
import { DayRoadmap } from "@/types/roadmap"; // Nhớ import type

interface Props {
  day: DayRoadmap;
  bookId: string;
  currentDay: number; // Ngày người dùng đang học đến
}

export default function RoadmapDayItem({ day, bookId, currentDay }: Props) {
  // Logic kiểm tra trạng thái
  const isUnlocked = day.day_index <= currentDay;
  const isCompleted = day.day_index < currentDay;

  return (
    <div className="flex gap-4 group relative z-10">
      
      {/* 1. CỘT MỐC (Circle) */}
      <div className={`w-10 h-10 rounded-full border-4 border-[#F8FAFC] flex items-center justify-center font-bold shadow-sm flex-shrink-0 transition-transform group-active:scale-95
        ${isUnlocked 
          ? "bg-blue-600 text-white shadow-blue-200" 
          : "bg-gray-200 text-gray-400"}`}>
        {isUnlocked 
            ? (isCompleted ? <CheckCircle size={18} /> : day.day_index) 
            : <Lock size={14} />
        }
      </div>

      {/* 2. THẺ NỘI DUNG (Card) */}
      {isUnlocked ? (
        // TRƯỜNG HỢP MỞ: Có Link bấm được
        <Link href={`/book/${bookId}/day/${day.day_index}`} className="block flex-1">
          <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm hover:border-blue-300 hover:shadow-md transition-all cursor-pointer relative overflow-hidden">
             
             {/* Badge Hôm nay */}
             {!isCompleted && (
                <div className="absolute top-0 right-0 bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-1 rounded-bl-lg">
                   Hôm nay
                </div>
             )}

             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">
                Ngày {day.day_index}
             </p>
             <h3 className="font-bold text-gray-900 text-lg mb-1 leading-tight">
                {day.title}
             </h3>
             <p className="text-xs text-gray-500 line-clamp-2 mb-3">
                {day.summary}
             </p>

             {/* Metadata */}
             <div className="flex items-center gap-3 pt-3 border-t border-gray-50">
                <div className="flex items-center gap-1 text-[10px] text-gray-500 bg-gray-50 px-2 py-1 rounded">
                    <Clock size={10} /> 15 phút
                </div>
                <div className="flex items-center gap-1 text-[10px] text-orange-600 bg-orange-50 px-2 py-1 rounded font-bold">
                    <Zap size={10} /> +50 XP
                </div>
             </div>
          </div>
        </Link>
      ) : (
        // TRƯỜNG HỢP KHÓA: Mờ đi
        <div className="flex-1 bg-white/60 p-4 rounded-xl border border-gray-100 grayscale opacity-70 cursor-not-allowed">
           <h3 className="font-bold text-gray-400 text-base mb-1">{day.title}</h3>
           <p className="text-xs text-gray-400 flex items-center gap-1">
              <Lock size={10} /> Hoàn thành ngày trước để mở
           </p>
        </div>
      )}
    </div>
  );
}