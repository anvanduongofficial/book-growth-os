"use client";

import Link from "next/link";
import { ChevronLeft, MoreHorizontal } from "lucide-react";

interface Props {
    title: string;
    cover: string;
    totalDays: number;
    currentDay: number;
}

export default function RoadmapHeader({ title, cover, totalDays, currentDay }: Props) {
    // Tính phần trăm hoàn thành
    // Ví dụ: Đang ở ngày 1, nhưng chưa xong ngày 1 -> progress tính theo số ngày ĐÃ xong (currentDay - 1)
    const progress = Math.min(100, Math.round(((currentDay - 1) / totalDays) * 100));
    console.log("currentDay", currentDay)
    console.log("totalDays", totalDays)
    return (
      <div className="bg-white p-5 pb-6 shadow-sm sticky top-0 z-20">
          {/* Top Bar */}
          <div className="flex justify-between items-center mb-6">
              <Link href="/" className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                  <ChevronLeft size={24} className="text-gray-700" />
              </Link>
              <button className="text-gray-400">
                  <MoreHorizontal size={24} />
              </button>
          </div>
  
          {/* Info Sách */}
          <div className="flex gap-4 items-center mb-4">
              <img src={cover} alt={title} className="w-16 h-24 object-cover rounded shadow-md" />
              <div>
                  <h1 className="font-bold text-xl text-gray-900 leading-tight mb-1">{title}</h1>
                  <p className="text-sm text-gray-500">{totalDays} ngày hành động</p>
              </div>
          </div>

          {/* === THANH TIẾN ĐỘ === */}
          <div>
            <div className="flex justify-between text-xs font-bold text-gray-500 mb-1.5">
                <span>Tiến độ của bạn</span>
                <span className="text-blue-600">{progress}%</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-blue-600 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
          </div>

      </div>
    );
  }