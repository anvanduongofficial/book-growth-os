"use client";

// Định nghĩa kiểu dữ liệu tool ngay tại đây hoặc import từ types
interface ToolItem {
    id: string;
    label: string;
}
interface Tool {
    id: string;
    type: string;
    title: string;
    description: string;
    items?: ToolItem[]; // Dành cho checklist
}

export default function ToolList({ tools }: { tools: any[] }) {
  if (!tools || tools.length === 0) {
    return <p className="text-gray-500 text-sm italic">Chưa có bài tập cho ngày này.</p>;
  }

  return (
    <div>
        <h3 className="font-bold text-gray-900 mb-4 text-lg">Nhiệm vụ hôm nay</h3>
        
        {tools.map((tool) => (
            <div key={tool.id} className="border border-gray-100 rounded-2xl p-5 mb-4 shadow-sm bg-white">
                <h4 className="font-bold text-gray-800 mb-1">{tool.title}</h4>
                <p className="text-xs text-gray-500 mb-4">{tool.description}</p>
                
                {/* LOGIC RENDER CHECKLIST */}
                {tool.type === 'checklist' && (
                    <div className="space-y-3">
                        {tool.items?.map((item: any) => (
                            <label key={item.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200">
                                <input type="checkbox" className="w-5 h-5 mt-0.5 text-blue-600 rounded focus:ring-blue-500 border-gray-300 accent-blue-600" />
                                <span className="text-sm text-gray-700 leading-snug select-none">{item.label}</span>
                            </label>
                        ))}
                    </div>
                )}

                {/* LOGIC RENDER CALCULATOR (Placeholder) */}
                {tool.type === 'calculator' && (
                    <div className="bg-gray-50 p-4 rounded-xl text-center border border-dashed border-gray-300">
                        <p className="text-sm text-gray-500">🧮 Máy tính sẽ hiện ở đây</p>
                    </div>
                )}
            </div>
        ))}
    </div>
  );
}