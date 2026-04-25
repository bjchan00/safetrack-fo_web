import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-server";
import { MapPin, Users, Clock, Navigation, ArrowRight } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const member = await getSession();
  if (!member) redirect("/login");
  if (member.member_type === "location") redirect("/mypage/account");

  // 그룹 멤버 수
  const { count: memberCount } = await supabaseAdmin
    .from("member_groups")
    .select("id", { count: "exact", head: true })
    .eq("main_viewer_id", member.id);

  // 내가 속한 그룹 (sub_viewer)
  const { data: myGroup } = member.member_type === "sub_viewer"
    ? await supabaseAdmin
        .from("member_groups")
        .select("main_viewer_id, members(name, phone)")
        .eq("member_id", member.id)
        .single()
    : { data: null };

  // 최근 위치 업데이트 (그룹 멤버들의 디바이스에서)
  const { data: groupDevices } = member.member_type === "main_viewer" && (memberCount ?? 0) > 0
    ? await supabaseAdmin
        .from("member_groups")
        .select("member_id")
        .eq("main_viewer_id", member.id)
    : { data: null };

  let lastUpdated: string | null = null;
  if (groupDevices && groupDevices.length > 0) {
    const memberIds = groupDevices.map((g) => g.member_id);
    const { data: devices } = await supabaseAdmin
      .from("devices")
      .select("id")
      .in("member_id", memberIds);
    if (devices && devices.length > 0) {
      const deviceIds = devices.map((d) => d.id);
      const { data: latestLog } = await supabaseAdmin
        .from("location_logs")
        .select("logged_at")
        .in("device_id", deviceIds)
        .order("logged_at", { ascending: false })
        .limit(1)
        .single();
      if (latestLog?.logged_at) {
        const diff = Math.floor((Date.now() - new Date(latestLog.logged_at).getTime()) / 60000);
        lastUpdated = diff < 1 ? "방금 전" : diff < 60 ? `${diff}분 전` : `${Math.floor(diff / 60)}시간 전`;
      }
    }
  }

  const hasGroup = member.member_type === "main_viewer" ? (memberCount ?? 0) > 0 : !!myGroup;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">안녕하세요, {member.name}님</h1>
        <p className="text-gray-500 mt-1">
          {member.member_type === "main_viewer" ? "가족의 위치를 실시간으로 확인하세요." : "그룹 현황을 확인하세요."}
        </p>
      </div>

      {/* 지도 영역 */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-6">
        <div className="h-72 bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center gap-3 relative">
          <div className="w-14 h-14 bg-blue-600/10 rounded-full flex items-center justify-center">
            <MapPin className="w-7 h-7 text-blue-600" />
          </div>
          <div className="text-center">
            <p className="font-semibold text-gray-700">지도 준비 중</p>
            <p className="text-sm text-gray-500 mt-1">Phase 3에서 카카오맵 실시간 위치가 연동됩니다.</p>
          </div>
          {lastUpdated && (
            <div className="absolute top-4 right-4 bg-white rounded-xl shadow-sm border border-gray-100 px-3 py-1.5 text-xs text-gray-500 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              최근 업데이트: {lastUpdated}
            </div>
          )}
        </div>
      </div>

      {/* 요약 카드 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <span className="font-semibold text-gray-700">그룹 멤버</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {member.member_type === "main_viewer" ? (memberCount ?? 0) : (myGroup ? 1 : 0)}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {member.member_type === "main_viewer"
              ? (memberCount ?? 0) > 0 ? "명이 그룹에 참여 중" : "그룹 멤버를 초대해주세요"
              : myGroup ? "그룹에 참여 중" : "아직 그룹에 참여하지 않았습니다"}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <Navigation className="w-5 h-5 text-green-600" />
            </div>
            <span className="font-semibold text-gray-700">위치 공유</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">—</p>
          <p className="text-xs text-gray-400 mt-1">Phase 3에서 제공</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
            <span className="font-semibold text-gray-700">최근 업데이트</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 text-sm leading-tight mt-1">
            {lastUpdated ?? "—"}
          </p>
          <p className="text-xs text-gray-400 mt-1">마지막 위치 수신 시각</p>
        </div>
      </div>

      {/* 그룹 관련 배너 */}
      {member.member_type === "main_viewer" && !hasGroup && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 flex items-start gap-4">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-blue-900">그룹 멤버를 초대해주세요</p>
            <p className="text-sm text-blue-700 mt-1">초대 코드를 생성해 가족을 그룹에 추가하세요.</p>
          </div>
          <Link href="/mypage/group" className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:underline whitespace-nowrap mt-0.5">
            그룹 관리 <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {member.member_type === "sub_viewer" && !hasGroup && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-4">
          <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-amber-900">아직 그룹에 참여하지 않았습니다</p>
            <p className="text-sm text-amber-700 mt-1">메인 뷰어의 초대 코드를 입력해 그룹에 참여하세요.</p>
          </div>
          <Link href="/mypage/group" className="flex items-center gap-1 text-sm font-semibold text-amber-700 hover:underline whitespace-nowrap mt-0.5">
            그룹 참여 <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
