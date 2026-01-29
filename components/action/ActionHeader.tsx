"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface Props {
  dayIndex: number;
  title: string;
}

export default function ActionHeader({ dayIndex, title }: Props) {
  const router = useRouter();
  
  return (
    <div className="px-4 py-4 flex items-center gap-3 border-b border-gray-50 sticky top-0 bg-white z-10 shadow-sm">
       <button onClick={() => router.back()} className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
         <ArrowLeft size={20} className="text-gray-600"/>
       </button>
       <div className="flex-1 min-w-0">
         <span className="text-xs font-bold text-blue-600 uppercase tracking-wide">Ngày {dayIndex}</span>
         <h1 className="font-bold text-gray-900 leading-none text-lg truncate">{title}</h1>
       </div>
    </div>
  );
}