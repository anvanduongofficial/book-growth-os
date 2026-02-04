// components/book/LearnSection.tsx
import { SandwichCard } from "./SandwichCard";

export const LearnSection = ({ lessonData, onGoToAction }: { lessonData: any, onGoToAction: () => void }) => {
  if (!lessonData) return null;
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Cấu trúc 4 card "Sandwich" chuẩn Forensic */}
      <SandwichCard type="TRAP" content={lessonData.trap} />
      <SandwichCard type="SHIFT" content={lessonData.shift} />
      <SandwichCard type="PROOF" content={lessonData.proof} />
      <SandwichCard 
        type="ACTION" 
        content={lessonData.micro_action} 
        onActionClick={onGoToAction} 
      />
    </div>
  );
};