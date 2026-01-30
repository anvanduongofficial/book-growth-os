"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, Wand2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { generateBookContent } from "@/app/actions/generate-book";
import { publishBookAction } from "@/app/actions/publish-book"; 

export default function CreateBookPage() {
  const router = useRouter();
  
  // State Input
  const [title, setTitle] = useState("");
  const [coverUrl, setCoverUrl] = useState("https://placehold.co/400x600?text=Book+Cover");
  
  // State Loading
  const [loading, setLoading] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  
  // State Data
  const [generatedData, setGeneratedData] = useState<any>(null); 
  
  // 🔥 FIX LỖI JSON: Thêm state riêng để lưu chuỗi JSON trong Textarea
  const [roadmapString, setRoadmapString] = useState("");

  // --- 1. GỌI AI GENERATE ---
  const handleGenerate = async () => {
    if (!title) return alert("Vui lòng nhập tên sách!");
    setLoading(true);
    setGeneratedData(null); 
    setRoadmapString(""); // Reset chuỗi cũ

    try {
      const data = await generateBookContent(title);
      
      if (data) {
        setGeneratedData(data);
        // 🔥 FIX: Lưu chuỗi JSON vào state riêng để user sửa thoải mái
        setRoadmapString(JSON.stringify(data.roadmap, null, 2));
      } else {
        alert("AI đang bận, vui lòng thử lại!");
      }
    } catch (e) {
      console.error(e);
      alert("Lỗi hệ thống khi gọi AI");
    } finally {
      setLoading(false);
    }
  };

  // --- 2. LƯU DATABASE ---
  const handleSave = async () => {
    if (!generatedData) return;
    
    // 🔥 FIX: Kiểm tra cú pháp JSON trước khi lưu
    let finalRoadmap;
    try {
        finalRoadmap = JSON.parse(roadmapString);
    } catch (e) {
        alert("❌ Lỗi cú pháp JSON! Bạn đang gõ sai format ở đâu đó (thiếu dấu ngoặc, dấu phẩy...). Vui lòng kiểm tra lại.");
        return;
    }

    setIsPublishing(true);

    try {
      const finalData = {
        title: generatedData.title,
        author: generatedData.author,
        total_days: generatedData.total_days,
        roadmap: finalRoadmap, // Dùng roadmap đã parse từ chuỗi user sửa
      };
      const result = await publishBookAction(finalData);

      if (result.success) {
        alert("🎉 Xuất bản thành công!");
        router.push("/admin");
      } else {
        alert("Lỗi khi lưu: " + result.message);
      }
    } catch (e) {
      console.error(e);
      alert("Lỗi hệ thống không xác định.");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 pb-24">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
            <Link href="/admin" className="p-2 bg-white rounded-xl shadow-sm hover:bg-gray-100 transition-colors">
                <ArrowLeft size={20} className="text-gray-600" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Thêm sách mới (AI Agent)</h1>
        </div>

        {/* INPUT FORM */}
        <div className="bg-white p-6 rounded-2xl shadow-sm space-y-4 mb-6 border border-gray-100">
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Chủ đề / Tên sách</label>
                <div className="flex gap-2">
                    <input 
                        type="text" 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="VD: Đắc Nhân Tâm, Kỹ năng quản lý thời gian..."
                        className="flex-1 p-4 bg-gray-50 border-transparent focus:bg-white border focus:border-blue-500 rounded-xl outline-none transition-all font-medium"
                        onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                    />
                    <button 
                        onClick={handleGenerate}
                        disabled={loading || !title}
                        className="bg-blue-600 text-white px-6 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-200"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <Wand2 size={20} />}
                        {loading ? "Đang viết..." : "Tạo ngay"}
                    </button>
                </div>
            </div>
        </div>

        {/* KẾT QUẢ PREVIEW */}
        {generatedData && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                
                {/* 1. Tổng quan */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-green-100 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
                    <h2 className="text-lg font-bold text-green-700 mb-4 flex items-center gap-2">
                        <Save size={20} /> Kết quả từ AI (Review kỹ nhé!)
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tên sách chuẩn</label>
                            <input 
                                value={generatedData.title} 
                                onChange={(e) => setGeneratedData({...generatedData, title: e.target.value})}
                                className="w-full p-2 border border-gray-200 rounded-lg font-bold text-gray-800 focus:border-green-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tác giả</label>
                            <input 
                                value={generatedData.author}
                                onChange={(e) => setGeneratedData({...generatedData, author: e.target.value})} 
                                className="w-full p-2 border border-gray-200 rounded-lg text-gray-800 focus:border-green-500 outline-none"
                            />
                        </div>
                        <div className="col-span-full">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Ảnh bìa (URL)</label>
                            <input 
                                value={coverUrl}
                                onChange={(e) => setCoverUrl(e.target.value)} 
                                className="w-full p-2 border border-gray-200 rounded-lg text-blue-600 text-sm focus:border-green-500 outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* 2. Chi tiết JSON (Editor thô) */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="font-bold text-gray-900 text-sm uppercase">Chi tiết nội dung (JSON)</h3>
                        <span className="text-[10px] bg-yellow-100 text-yellow-800 px-2 py-1 rounded font-bold">⚠️ EDIT MODE ON</span>
                    </div>
                    <div className="relative">
                        {/* 🔥 FIX: Textarea bind vào roadmapString chứ không phải generatedData */}
                        <textarea 
                            rows={15}
                            className="w-full font-mono text-xs p-4 bg-slate-900 text-green-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                            value={roadmapString}
                            onChange={(e) => setRoadmapString(e.target.value)}
                            spellCheck={false}
                        />
                    </div>
                    <p className="text-xs text-gray-400 mt-2 italic">
                        *Lưu ý: Hãy cẩn thận với các dấu ngoặc nhọn {'{}'} và dấu phẩy. Nếu sai cú pháp, bạn sẽ không thể lưu được.
                    </p>
                </div>

                {/* NÚT LƯU */}
                <button 
                    onClick={handleSave}
                    disabled={isPublishing}
                    className="sticky bottom-6 w-full py-4 bg-green-600 text-white font-bold text-lg rounded-xl shadow-xl shadow-green-200 hover:bg-green-700 active:scale-95 transition-all flex items-center justify-center gap-2 z-50"
                >
                    {isPublishing ? (
                        <>
                            <Loader2 className="animate-spin" /> Đang lưu vào Database...
                        </>
                    ) : (
                        <>
                            🚀 Xuất bản lên App ngay
                        </>
                    )}
                </button>

            </div>
        )}

      </div>
    </div>
  );
}