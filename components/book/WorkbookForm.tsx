import { Clock, RotateCw, CheckCircle } from "lucide-react"; // 👈 Thêm icon RotateCw và CheckCircle

interface Field {
  id: string;
  label: string;
  placeholder: string;
  type: string;
}

interface WorkbookFormProps {
  fields: Field[];
  answers: Record<string, string>;
  onAnswerChange: (id: string, value: string) => void;
  isSaving: boolean; // 👈 1. THÊM PROP NÀY
}

export const WorkbookForm = ({ fields, answers, onAnswerChange, isSaving }: WorkbookFormProps) => {
  return (
    <div className="space-y-4">
      {/* Header + Indicator */}
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-lg flex items-center gap-2 text-slate-800">
          <Clock className="text-orange-500" size={20}/> 
          Bài tập 24h
        </h3>

        {/* 👈 2. HIỂN THỊ TRẠNG THÁI LƯU Ở ĐÂY */}
        <div className="text-xs font-medium transition-colors duration-300">
            {isSaving ? (
                <span className="text-blue-500 flex items-center gap-1">
                    <RotateCw size={14} className="animate-spin" /> Đang lưu...
                </span>
            ) : (
                <span className="text-green-600 flex items-center gap-1">
                    <CheckCircle size={14} /> Đã lưu
                </span>
            )}
        </div>
      </div>

      <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
        {fields.map((field) => (
          <div key={field.id} className="space-y-2">
            <label className="text-sm font-bold text-slate-700 block">{field.label}</label>
            {field.type === 'textarea' ? (
               <textarea
               rows={3}
               placeholder={field.placeholder}
               value={answers[field.id] || ""}
               // onChange ở đây đã chuẩn rồi (real-time)
               onChange={(e) => onAnswerChange(field.id, e.target.value)}
               className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-800 bg-white placeholder:text-slate-400 text-sm transition-all"
             />
            ) : (
              <input 
              type={field.type} 
              placeholder={field.placeholder}
              value={answers[field.id] || ""}
              onChange={(e) => onAnswerChange(field.id, e.target.value)}
              className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-800 bg-white placeholder:text-slate-400 text-sm transition-all"
            />
            )}
           
          </div>
        ))}
      </form>
    </div>
  );
};