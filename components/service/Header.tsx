"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, LogOut, Settings, User, Bell } from "lucide-react";
import type { SessionMember } from "@/lib/auth";

const MEMBER_TYPE_LABEL: Record<string, string> = {
  main_viewer: "메인 뷰어",
  sub_viewer: "서브 뷰어",
  location: "위치 공유",
};

export function ServiceHeader({ member }: { member: SessionMember }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  };

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center px-4 justify-between sticky top-0 z-40">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <MapPin className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold text-gray-900">SafeTrack</span>
      </div>

      <div className="flex items-center gap-2">
        <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
        </button>

        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-sm font-semibold text-gray-900">{member.name}</div>
              <div className="text-xs text-gray-500">{MEMBER_TYPE_LABEL[member.member_type]}</div>
            </div>
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
              <a
                href="/settings"
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                <Settings className="w-4 h-4" />
                설정
              </a>
              <hr className="my-1 border-gray-100" />
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                로그아웃
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
