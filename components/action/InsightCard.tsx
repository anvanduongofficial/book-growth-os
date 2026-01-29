"use client";
import { Lightbulb } from "lucide-react";

export default function InsightCard({ summary }: { summary: string }) {
  return (
    <div className="bg-blue-50 p-6 rounded-2xl mb-8 relative overflow-hidden shadow-sm border border-blue-100">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
            <Lightbulb size={64} className="text-blue-600" />
        </div>
        <h3 className="font-bold text-blue-800 mb-2 flex items-center gap-2 relative z-10">
            <Lightbulb size={18} /> Bài học cốt lõi
        </h3>
        <p className="text-blue-900/80 text-sm leading-relaxed font-medium relative z-10">
            "{summary}"
        </p>
    </div>
  );
}