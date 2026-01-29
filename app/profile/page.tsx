"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { LogOut, User as UserIcon, ShieldCheck } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
      } else {
        setUser(user);
      }
    };
    getUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login"); // Đăng xuất xong đá về login
    router.refresh();      // Refresh để xóa các state cũ
  };

  if (!user) return null;

  return (
    <main className="flex justify-center min-h-screen bg-[#F8FAFC]">
      <div className="w-full max-w-[420px] bg-[#F8FAFC] min-h-screen flex flex-col">
        
        {/* Header đơn giản */}
        <div className="bg-white p-6 pb-8 rounded-b-[30px] shadow-sm mb-6">
            <h1 className="font-bold text-2xl text-gray-900 mb-6">Hồ sơ cá nhân</h1>
            
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 border-4 border-white shadow-lg">
                    <UserIcon size={32} />
                </div>
                <div>
                    <p className="text-xs text-gray-400 font-bold uppercase">Tài khoản học viên</p>
                    <h2 className="font-bold text-gray-900 text-lg truncate max-w-[200px]">
                        {user.email}
                    </h2>
                </div>
            </div>
        </div>

        {/* Nội dung cài đặt */}
        <div className="px-6 space-y-4">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="bg-green-50 p-3 rounded-xl text-green-600">
                    <ShieldCheck size={20} />
                </div>
                <div className="flex-1">
                    <h3 className="font-bold text-gray-900">Trạng thái tài khoản</h3>
                    <p className="text-xs text-green-600 font-medium">Đã xác thực & Bảo mật</p>
                </div>
            </div>

            {/* Nút Đăng xuất */}
            <button 
                onClick={handleLogout}
                className="w-full bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 text-red-500 hover:bg-red-50 transition-colors"
            >
                <div className="bg-red-50 p-3 rounded-xl">
                    <LogOut size={20} />
                </div>
                <span className="font-bold">Đăng xuất</span>
            </button>

            <p className="text-center text-xs text-gray-400 pt-10">
                Book Growth OS v1.0.0
            </p>
        </div>

      </div>
    </main>
  );
}