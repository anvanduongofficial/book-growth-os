"use client";

import { useState } from "react";
import { BookOpen, ListTree, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { publishBookAction } from "@/app/actions/publish-book"; // Bạn sẽ tạo file này ở bước 3

export default function AdminCreateBook() {
  const [dnaJson, setDnaJson] = useState("");
  const [roadmapJson, setRoadmapJson] = useState("");
  const [metadata, setMetadata] = useState({ title: "", author: "", cover: "", description: "", category: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    setLoading(true);
    setError("");
    try {
      const dna = JSON.parse(dnaJson);
      const roadmap = JSON.parse(roadmapJson);
      
      const payload = {
        ...metadata,
        category: metadata.category.split(",").map(c => c.trim()),
        total_days: roadmap.length,
        dna,
        roadmap,
        isPublished: true,
        createdAt: new Date().toISOString()
      };

      const res = await publishBookAction(payload as any);
      if (res.success) alert("Đã xuất bản thành công!");
    } catch (e: any) {
      setError("Lỗi định dạng JSON hoặc Database: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen text-slate-900">
      <h1 className="text-2xl font-black mb-8">KNOWLEDGE FOUNDRY (ADMIN)</h1>
      
      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-1 space-y-4 bg-white p-6 rounded-3xl shadow-sm border">
          <h2 className="font-bold text-slate-400 uppercase text-xs tracking-widest">Metadata</h2>
          <input placeholder="Tên sách" className="w-full p-3 bg-slate-100 rounded-xl font-bold" onChange={e => setMetadata({...metadata, title: e.target.value})} />
          <input placeholder="Tác giả" className="w-full p-3 bg-slate-100 rounded-xl" onChange={e => setMetadata({...metadata, author: e.target.value})} />
          <input placeholder="Link ảnh bìa" className="w-full p-3 bg-slate-100 rounded-xl" onChange={e => setMetadata({...metadata, cover: e.target.value})} />
          <textarea placeholder="Mô tả ngắn" className="w-full p-3 bg-slate-100 rounded-xl" rows={4} onChange={e => setMetadata({...metadata, description: e.target.value})} />
          <input placeholder="Category (cách nhau bởi dấu phẩy)" className="w-full p-3 bg-slate-100 rounded-xl" onChange={e => setMetadata({...metadata, category: e.target.value})} />
        </div>

        <div className="col-span-2 space-y-6">
          <div>
            <label className="flex items-center gap-2 font-bold text-blue-600 mb-2"><BookOpen size={16}/> INPUT 1: SUMMARY DNA (JSON)</label>
            <textarea className="w-full font-mono text-xs p-4 bg-slate-900 text-blue-300 rounded-3xl h-64 border-4 border-transparent focus:border-blue-500" value={dnaJson} onChange={e => setDnaJson(e.target.value)} />
          </div>
          <div>
            <label className="flex items-center gap-2 font-bold text-emerald-600 mb-2"><ListTree size={16}/> INPUT 2: ACTION ROADMAP (JSON)</label>
            <textarea className="w-full font-mono text-xs p-4 bg-slate-900 text-emerald-300 rounded-3xl h-96 border-4 border-transparent focus:border-emerald-500" value={roadmapJson} onChange={e => setRoadmapJson(e.target.value)} />
          </div>
          
          {error && <div className="p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-2 font-bold"><AlertCircle size={20}/> {error}</div>}
          
          <button onClick={handleSave} disabled={loading} className="w-full py-4 bg-blue-600 text-white font-black rounded-3xl shadow-xl hover:bg-blue-700 transition-all flex justify-center items-center gap-2">
            {loading ? <Loader2 className="animate-spin" /> : <CheckCircle2 />} XUẤT BẢN LÊN APP
          </button>
        </div>
      </div>
    </div>
  );
}