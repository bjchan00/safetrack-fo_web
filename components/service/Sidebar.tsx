"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Users, CreditCard, Settings, Bell, MapPin } from "lucide-react";
import type { SessionMember } from "@/lib/auth";

const ALL_MENUS = [
  { href: "/dashboard", label: "대시보드", icon: LayoutDashboard, types: ["main_viewer", "sub_viewer"] },
  { href: "/group", label: "그룹 관리", icon: Users, types: ["main_viewer", "sub_viewer", "location"] },
  { href: "/subscription", label: "구독 관리", icon: CreditCard, types: ["main_viewer"] },
  { href: "/notices", label: "공지사항", icon: Bell, types: ["main_viewer", "sub_viewer", "location"] },
  { href: "/settings", label: "계정", icon: Settings, types: ["main_viewer", "sub_viewer", "location"] },
];

export function Sidebar({ member }: { member: SessionMember }) {
  const pathname = usePathname();

  const menus = ALL_MENUS.filter((m) => m.types.includes(member.member_type));

  return (
    <aside className="w-56 bg-white border-r border-gray-200 flex-shrink-0 hidden md:flex flex-col">
      <div className="flex-1 py-4 px-3 space-y-1">
        {menus.map((menu) => {
          const isActive = pathname.startsWith(menu.href);
          return (
            <Link
              key={menu.href}
              href={menu.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <menu.icon className={`w-5 h-5 ${isActive ? "text-blue-600" : "text-gray-500"}`} />
              {menu.label}
            </Link>
          );
        })}
      </div>
      {/* 위치 공유 모드인 경우 위치 공유 ON/OFF */}
      {member.member_type === "location" && (
        <div className="p-4 border-t border-gray-100">
          <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center">
            <MapPin className="w-5 h-5 text-green-600 mx-auto mb-1" />
            <p className="text-xs font-semibold text-green-700">위치 공유 중</p>
          </div>
        </div>
      )}
    </aside>
  );
}
