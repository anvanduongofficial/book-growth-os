import { AlertTriangle, Lightbulb, BookOpen, Zap, ChevronRight } from "lucide-react";

type CardType = "TRAP" | "SHIFT" | "PROOF" | "ACTION";

interface SandwichCardProps {
  type: CardType;
  content: string;
  onActionClick?: () => void;
}

export const SandwichCard = ({ type, content, onActionClick }: SandwichCardProps) => {
  const config = {
    TRAP: {
      icon: <AlertTriangle size={16} />,
      label: "The Trap",
      bg: "bg-red-50",
      border: "border-red-500",
      text: "text-red-700",
    },
    SHIFT: {
      icon: <Lightbulb size={16} />,
      label: "The Shift",
      bg: "bg-blue-50",
      border: "border-blue-500",
      text: "text-blue-700",
    },
    PROOF: {
      icon: <BookOpen size={16} />,
      label: "The Proof",
      bg: "bg-slate-50",
      border: "border-slate-400",
      text: "text-slate-600",
    },
    ACTION: {
      icon: <Zap size={16} fill="currentColor" />,
      label: "Micro-Action",
      bg: "bg-emerald-50", // Đổi sang emerald cho tươi mới
      border: "border-emerald-500",
      text: "text-emerald-700",
    },
  };

  const style = config[type];

  return (
    <div className={`${style.bg} border-l-4 ${style.border} p-5 rounded-r-2xl shadow-sm transition-all hover:shadow-md`}>
      <div className={`flex items-center gap-2 mb-3 ${style.text} font-black uppercase text-[10px] tracking-[0.15em]`}>
        {style.icon} {style.label}
      </div>
      
      <div className="text-slate-800 leading-relaxed text-sm md:text-base font-medium">
        {content}
      </div>

      {type === "ACTION" && onActionClick && (
        <button 
          onClick={onActionClick}
          className="mt-5 w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-xs shadow-lg shadow-emerald-200 transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          ĐI ĐẾN BÀI TẬP NGAY <ChevronRight size={16} />
        </button>
      )}
    </div>
  );
};