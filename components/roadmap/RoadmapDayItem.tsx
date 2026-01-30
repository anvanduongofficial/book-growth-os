import Link from "next/link";
import { CheckCircle, Lock, Circle } from "lucide-react"; // Ví dụ icon
import { RoadmapDay } from "@/types/roadmap";

interface Props {
  day: RoadmapDay;
  bookId: string;
  currentDay: number;
}

export default function RoadmapDayItem({ day, bookId, currentDay }: Props) {
  // Logic trạng thái
  const isCompleted = day.day_index < currentDay;
  const isCurrent = day.day_index === currentDay;
  const isLocked = day.day_index > currentDay;

  // URL đích: /book/atomic-habits/day/1
  const href = `/book/${bookId}/day/${day.day_index}`;

  const Content = () => (
    <div className={`flex items-center gap-4 p-4 rounded-xl border mb-4 transition-all ${
      isCurrent ? "bg-white border-blue-500 shadow-md scale-[1.02]" : 
      isLocked ? "bg-slate-50 border-slate-100 opacity-60" : "bg-white border-slate-200"
    }`}>
      {/* Icon trạng thái */}
      <div className="shrink-0">
        {isCompleted ? <CheckCircle className="text-green-500" /> : 
         isLocked ? <Lock className="text-slate-400" /> : 
         <Circle className="text-blue-500" />}
      </div>

      {/* Thông tin bài */}
      <div>
        <p className="text-xs text-slate-400 font-bold uppercase">Ngày {day.day_index}</p>
        <h4 className="font-bold text-slate-800">{day.title}</h4>
      </div>
      
      {/* XP Badge (Ví dụ) */}
      <div className="ml-auto text-xs font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded-full">
        +{day.xp} XP
      </div>
    </div>
  );

  // Nếu bị khóa thì không cho click Link
  if (isLocked) {
    return <Content />;
  }

  // Nếu mở thì bọc trong Link
  return (
    <Link href={href}>
      <Content />
    </Link>
  );
}