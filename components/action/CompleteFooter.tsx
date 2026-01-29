"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";

export default function CompleteFooter() {
  const router = useRouter();
  const [isCompleted, setIsCompleted] = useState(false);

  const handleComplete = () => {
    setIsCompleted(true);
    // Giả lập lưu dữ liệu và delay chuyển trang
    setTimeout(() => {
        router.back(); 
    }, 1000);
  };

  return (
    <div className="fixed bottom-0 w-full max-w-[420px] p-5 bg-white border-t border-gray-100 z-20">
        <button 
            onClick={handleComplete}
            disabled={isCompleted}
            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg
            ${isCompleted 
                ? "bg-green-600 text-white shadow-green-200 cursor-default" 
                : "bg-gray-900 text-white shadow-gray-300 hover:bg-gray-800"}`}
        >
            {isCompleted ? (
                <>
                    <CheckCircle size={20} /> Đã hoàn thành!
                </>
            ) : (
                "Hoàn thành bài học"
            )}
        </button>
    </div>
  );
}