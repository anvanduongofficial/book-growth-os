import { ChevronLeft } from "lucide-react";
import Link from "next/link";

interface Props {
  title: string;
  cover?: string | null; // Cho phép null hoặc undefined
  totalDays?: number;
  currentDay?: number;
}

export default function RoadmapHeader({ title, cover, totalDays = 0, currentDay = 1 }: Props) {
  
  // 🔥 FIX LỖI Ở ĐÂY:
  // Nếu không có cover hoặc cover là chuỗi rỗng -> Dùng ảnh mặc định
  const safeCoverUrl = (cover && cover.trim() !== "") 
    ? cover 
    : "https://placehold.co/400x600?text=No+Cover";

  // Tính phần trăm tiến độ (để làm thanh progress bar cho đẹp)
  const progressPercent = totalDays > 0 ? Math.min((currentDay / totalDays) * 100, 100) : 0;

  return (
    <div className="bg-white p-5 pt-8 pb-6 shadow-sm sticky top-0 z-20">
      
      {/* Nút Back */}
      <Link href="/" className="inline-flex items-center text-slate-400 hover:text-slate-800 transition-colors mb-4">
        <ChevronLeft size={20} /> <span className="text-sm font-bold ml-1">Quay lại</span>
      </Link>

      <div className="flex gap-4">
        {/* Ảnh bìa sách */}
        <div className="w-20 h-28 shrink-0 rounded-lg shadow-md overflow-hidden bg-slate-100 border border-slate-100 relative">
          <img 
            src={safeCoverUrl} // <-- Dùng biến đã xử lý
            alt={title} 
            className="w-full h-full object-cover"
            // Thêm onError để nếu link ảnh chết thì tự đổi về placeholder
            onError={(e) => {
              e.currentTarget.src = "https://placehold.co/400x600?text=Error";
            }}
          />
        </div>

        {/* Thông tin bên cạnh */}
        <div className="flex-1 flex flex-col justify-center">
          <h1 className="text-xl font-bold text-slate-900 leading-tight mb-1 line-clamp-2">
            {title}
          </h1>
          <p className="text-xs text-slate-500 font-medium mb-3">
            Lộ trình {totalDays} ngày
          </p>

          {/* Thanh tiến độ nhỏ */}
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <p className="text-[10px] text-blue-600 font-bold mt-1 text-right">
            Đã học {Math.round(progressPercent)}%
          </p>
        </div>
      </div>
    </div>
  );
}