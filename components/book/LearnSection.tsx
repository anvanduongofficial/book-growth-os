import { SandwichCard } from "./SandwichCard";
import { parseSandwichContent } from "@/lib/book-utils";

interface LearnSectionProps {
  htmlContent: string;
  onGoToAction: () => void;
}

export const LearnSection = ({ htmlContent, onGoToAction }: LearnSectionProps) => {
  const content = parseSandwichContent(htmlContent);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <SandwichCard type="TRAP" content={content.trap} />
      <SandwichCard type="SHIFT" content={content.shift} />
      <SandwichCard type="PROOF" content={content.proof} />
      {/* Riêng thẻ Action có nút bấm chuyển Tab */}
      <SandwichCard type="ACTION" content={content.action} onActionClick={onGoToAction} />
    </div>
  );
};