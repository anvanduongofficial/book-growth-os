interface DayHeaderProps {
  dayIndex: number;
  title: string;
  summary: string;
}

export const DayHeader = ({ dayIndex, title, summary }: DayHeaderProps) => {
  return (
    <div className="p-6 pb-2">
      <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
        Ngày {dayIndex}
      </div>
      <h1 className="text-2xl font-bold leading-tight mb-2 text-slate-900">{title}</h1>
      <p className="text-slate-500 italic text-sm">{summary}</p>
    </div>
  );
};