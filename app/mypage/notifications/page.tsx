"use client";

import { useState, useEffect, useCallback } from "react";
import { Bell, Users, UserMinus, MessageSquare, Info, Loader2, CheckCheck } from "lucide-react";
import { showToast } from "@/components/ui/Toast";

interface Notification {
  id: string;
  type: "group_joined" | "group_removed" | "group_left" | "inquiry_answered" | "system";
  title: string;
  body: string | null;
  is_read: boolean;
  created_at: string;
}

const TYPE_CONFIG: Record<Notification["type"], { icon: React.ElementType; color: string; bg: string }> = {
  group_joined:      { icon: Users,        color: "text-blue-600",  bg: "bg-blue-100"  },
  group_removed:     { icon: UserMinus,    color: "text-red-500",   bg: "bg-red-100"   },
  group_left:        { icon: UserMinus,    color: "text-amber-500", bg: "bg-amber-100" },
  inquiry_answered:  { icon: MessageSquare,color: "text-green-600", bg: "bg-green-100" },
  system:            { icon: Info,         color: "text-gray-500",  bg: "bg-gray-100"  },
};

function timeAgo(dateStr: string) {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60)   return "방금 전";
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400)return `${Math.floor(diff / 3600)}시간 전`;
  return new Date(dateStr).toLocaleDateString("ko-KR", { month: "long", day: "numeric" });
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [marking,  setMarking]  = useState(false);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/mypage/notifications");
    if (res.ok) setNotifications(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

  const handleMarkAllRead = async () => {
    setMarking(true);
    const res = await fetch("/api/mypage/notifications", { method: "PATCH" });
    if (res.ok) {
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      showToast("모든 알림을 읽음 처리했습니다.", "success");
    } else {
      showToast("처리에 실패했습니다.", "error");
    }
    setMarking(false);
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">알림</h1>
          <p className="text-gray-500 mt-1">서비스 활동 알림을 확인하세요.</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            disabled={marking}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            {marking
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : <CheckCheck className="w-4 h-4" />
            }
            전체 읽음
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Bell className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p className="text-sm font-medium">알림이 없습니다</p>
            <p className="text-xs mt-1">그룹 참여, 문의 답변 등 활동 알림이 여기 표시됩니다.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-50">
            {notifications.map((n) => {
              const cfg = TYPE_CONFIG[n.type] ?? TYPE_CONFIG.system;
              const Icon = cfg.icon;
              return (
                <li
                  key={n.id}
                  className={`flex items-start gap-4 px-6 py-4 transition-colors ${
                    n.is_read ? "bg-white" : "bg-blue-50/40"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${cfg.bg}`}>
                    <Icon className={`w-5 h-5 ${cfg.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm font-semibold leading-snug ${n.is_read ? "text-gray-700" : "text-gray-900"}`}>
                        {n.title}
                      </p>
                      {!n.is_read && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5" />
                      )}
                    </div>
                    {n.body && (
                      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{n.body}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">{timeAgo(n.created_at)}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
