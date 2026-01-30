import { AlertTriangle, Lightbulb, BookOpen, Zap } from "lucide-react";

type CardType = "TRAP" | "SHIFT" | "PROOF" | "ACTION";

interface SandwichCardProps {
  type: CardType;
  content: string;
  onActionClick?: () => void; // Chỉ dùng cho thẻ Action
}

export const SandwichCard = ({ type, content, onActionClick }: SandwichCardProps) => {
  // Cấu hình Style dựa trên loại thẻ
  const config = {
    TRAP: {
      color: "red",
      icon: <AlertTriangle size={16} />,
      label: "The Trap",
      bg: "bg-red-50",
      border: "border-red-500",
      text: "text-red-700",
    },
    SHIFT: {
      color: "blue",
      icon: <Lightbulb size={16} />,
      label: "The Shift",
      bg: "bg-blue-50",
      border: "border-blue-500",
      text: "text-blue-700",
    },
    PROOF: {
      color: "slate",
      icon: <BookOpen size={16} />,
      label: "The Proof",
      bg: "bg-slate-50",
      border: "border-slate-400",
      text: "text-slate-600",
    },
    ACTION: {
      color: "green",
      icon: <Zap size={16} fill="currentColor" />,
      label: "Micro-Action",
      bg: "bg-green-50",
      border: "border-green-500", // Thẻ Action viền mỏng hơn chút cũng được hoặc giữ nguyên
      text: "text-green-700",
    },
  };

  const style = config[type];

  return (
    <div className={`${style.bg} border-l-4 ${style.border} p-4 rounded-r-lg shadow-sm`}>
      <div className={`flex items-center gap-2 mb-2 ${style.text} font-bold uppercase text-xs tracking-wider`}>
        {style.icon} {style.label}
      </div>
      
      <div 
        className="text-slate-700 leading-relaxed text-sm md:text-base" 
        dangerouslySetInnerHTML={{ __html: content }} 
      />

      {/* Nút bấm đặc biệt chỉ dành cho thẻ Action */}
      {type === "ACTION" && onActionClick && (
        <button 
          onClick={onActionClick}
          className="mt-4 w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg text-sm shadow-md transition-all active:scale-95">
          ĐI ĐẾN BÀI TẬP NGAY
        </button>
      )}
    </div>
  );
};