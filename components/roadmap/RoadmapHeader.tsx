// src/components/roadmap/RoadmapHeader.tsx
"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface Props {
  title: string;
  cover: string;
  totalDays: number;
  currentDay: number;
}

export default function RoadmapHeader({ title, cover, totalDays, currentDay }: Props) {
  const router = useRouter();

  // Tính phần trăm tiến độ để hiển thị thanh bar
  // Ví dụ: Đang học ngày 1 thì coi như xong 0% (hoặc logic tùy bạn)
  const progressPercent = Math.round(((currentDay - 1) / totalDays) * 100);

  return (
    <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex items-center gap-3 shadow-sm transition-all">
      <button 
        onClick={() => router.push('/')} 
        className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
      >
        <ArrowLeft size={20} className="text-gray-600"/>
      </button>
      
      <div className="flex-1 min-w-0">
        <h1 className="font-bold text-gray-900 text-sm truncate">{title}</h1>
        <div className="flex items-center gap-2 mt-0.5">
           <div className="h-1 w-20 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 transition-all duration-500" 
                style={{ width: `${progressPercent}%` }}
              ></div>
           </div>
           <span className="text-[10px] text-gray-400 font-medium">
             Ngày {currentDay}/{totalDays}
           </span>
        </div>
      </div>

      <img src={cover} className="w-8 h-8 rounded-full border border-gray-200 object-cover" alt="cover" />
    </div>
  );
}