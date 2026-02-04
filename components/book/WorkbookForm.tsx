"use client";
import { Clock, CheckCircle, Save, AlertCircle, Calculator } from "lucide-react";
import { useState, useMemo, useEffect } from "react";

export const WorkbookForm = ({ fields, answers, onAnswerChange, calculationLogic, onConfirm, hasChanges }: any) => {
  // Trạng thái Confirmed chỉ true khi hasChanges = false (tức là vừa nhấn Save xong)
  const [isConfirmed, setIsConfirmed] = useState(!hasChanges);

  useEffect(() => {
    if (hasChanges) setIsConfirmed(false);
  }, [hasChanges]);

  const result = useMemo(() => {
    if (!calculationLogic?.formula) return null;
    try {
      let formula = calculationLogic.formula;
      fields.forEach((f: any) => {
        const val = parseFloat(answers[f.id]) || 0;
        formula = formula.replace(new RegExp(f.id, 'g'), val.toString());
      });
      return eval(formula);
    } catch (e) { return 0; }
  }, [calculationLogic, fields, answers]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest flex items-center gap-2">
          <Clock size={16} className="text-orange-500" /> Thực hành thực tế
        </h3>
        {isConfirmed ? (
          <span className="text-[10px] font-black text-emerald-600 flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100 uppercase">
            <CheckCircle size={12} /> Đã xác nhận
          </span>
        ) : (
          <span className="text-[10px] font-black text-amber-600 flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-full border border-amber-100 uppercase">
            <AlertCircle size={12} /> Chờ xác nhận
          </span>
        )}
      </div>

      <div className="space-y-5">
        {fields.map((field: any) => (
          <div key={field.id}>
            <label className="text-[11px] font-black text-slate-400 uppercase mb-2 block ml-1 tracking-wider">{field.label}</label>
            <input 
              type={field.type === 'number' ? 'number' : 'text'} 
              value={answers[field.id] || ""}
              onChange={(e) => onAnswerChange(field.id, e.target.value)}
              className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none text-slate-900 font-bold transition-all"
            />
          </div>
        ))}

        {calculationLogic && (
          <div className="p-6 bg-slate-900 rounded-[2rem] text-white shadow-xl">
            <div className="text-3xl font-black">{result?.toLocaleString()} <span className="text-sm text-slate-500">{calculationLogic.unit}</span></div>
          </div>
        )}

        <button 
          onClick={() => { setIsConfirmed(true); onConfirm(); }}
          disabled={isConfirmed}
          className={`w-full py-4 rounded-xl font-black text-xs tracking-widest flex items-center justify-center gap-2 transition-all ${isConfirmed ? "bg-emerald-100 text-emerald-600" : "bg-blue-600 text-white shadow-lg"}`}
        >
          {isConfirmed ? "DỮ LIỆU ĐÃ ĐƯỢC CHỐT" : "XÁC NHẬN & LƯU KẾT QUẢ"}
        </button>
      </div>
    </div>
  );
};