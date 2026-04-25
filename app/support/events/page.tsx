import { supabaseAdmin } from "@/lib/supabase-server";
import { Gift } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SupportEventsPage() {
  const { data: events } = await supabaseAdmin
    .from("events")
    .select("id, title, content, start_date, end_date, status, created_at")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(20);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <p className="text-sm text-blue-600 font-semibold mb-1">고객지원</p>
          <h1 className="text-2xl font-bold text-gray-900">이벤트</h1>
          <p className="text-gray-500 mt-1">SafeTrack의 다양한 이벤트에 참여해보세요.</p>
        </div>

        <div className="space-y-3">
          {events && events.length > 0 ? (
            events.map((event) => (
              <div key={event.id} className="bg-white rounded-2xl border border-gray-200 p-5 hover:border-gray-300 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full">
                        이벤트
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900">{event.title}</h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{event.content}</p>
                    {event.start_date && event.end_date && (
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(event.start_date).toLocaleDateString("ko-KR")} ~{" "}
                        {new Date(event.end_date).toLocaleDateString("ko-KR")}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 text-gray-400">
              <Gift className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">진행 중인 이벤트가 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
