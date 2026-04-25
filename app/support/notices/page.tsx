import { supabaseAdmin } from "@/lib/supabase-server";
import { Bell } from "lucide-react";

export const dynamic = "force-dynamic";

const NOTICE_TYPE_LABEL: Record<string, string> = {
  general: "일반",
  splash: "팝업",
  push: "푸시",
};

export default async function SupportNoticesPage() {
  const { data: notices } = await supabaseAdmin
    .from("notices")
    .select("id, title, content, notice_type, created_at")
    .order("created_at", { ascending: false })
    .limit(20);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <p className="text-sm text-blue-600 font-semibold mb-1">고객지원</p>
          <h1 className="text-2xl font-bold text-gray-900">공지사항</h1>
          <p className="text-gray-500 mt-1">SafeTrack의 최신 소식을 확인하세요.</p>
        </div>

        <div className="space-y-3">
          {notices && notices.length > 0 ? (
            notices.map((notice) => (
              <div key={notice.id} className="bg-white rounded-2xl border border-gray-200 p-5 hover:border-gray-300 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                        {NOTICE_TYPE_LABEL[notice.notice_type] ?? notice.notice_type}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900">{notice.title}</h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{notice.content}</p>
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    {new Date(notice.created_at).toLocaleDateString("ko-KR")}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 text-gray-400">
              <Bell className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">등록된 공지사항이 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
