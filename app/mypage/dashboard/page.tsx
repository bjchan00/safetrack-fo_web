import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { MapPin, Users, Clock, Navigation } from "lucide-react";

export default async function DashboardPage() {
  const member = await getSession();
  if (!member) redirect("/login");

  if (member.member_type === "location") redirect("/mypage/account");

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">안녕하세요, {member.name}님</h1>
        <p className="text-gray-500 mt-1">가족의 위치를 실시간으로 확인하세요.</p>
      </div>

      {/* 지도 영역 */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-6">
        <div className="h-96 bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center gap-4 relative">
          <div className="w-16 h-16 bg-blue-600/10 rounded-full flex items-center justify-center animate-pulse">
            <MapPin className="w-8 h-8 text-blue-600" />
          </div>
          <div className="text-center">
            <p className="font-semibold text-gray-700">지도 준비 중</p>
            <p className="text-sm text-gray-500 mt-1">Phase 2에서 실시간 위치 지도가 연동됩니다.</p>
          </div>
          <div className="absolute top-4 right-4 bg-white rounded-xl shadow-sm border border-gray-100 px-3 py-2 text-xs text-gray-500">
            Kakao Maps API 연동 예정
          </div>
        </div>
      </div>

      {/* 요약 카드 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <span className="font-semibold text-gray-700">그룹 멤버</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">—</p>
          <p className="text-xs text-gray-400 mt-1">그룹을 구성해주세요</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <Navigation className="w-5 h-5 text-green-600" />
            </div>
            <span className="font-semibold text-gray-700">온라인</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">—</p>
          <p className="text-xs text-gray-400 mt-1">현재 위치 공유 중인 멤버</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
            <span className="font-semibold text-gray-700">최근 업데이트</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">—</p>
          <p className="text-xs text-gray-400 mt-1">마지막 위치 수신 시각</p>
        </div>
      </div>

      {member.member_type === "main_viewer" && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-2xl p-5 flex items-start gap-4">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-blue-900">그룹 멤버를 초대해주세요</p>
            <p className="text-sm text-blue-700 mt-1">
              초대 코드를 생성하여 가족을 그룹에 추가하세요. Phase 2에서 초대 기능이 활성화됩니다.
            </p>
          </div>
          <a href="/mypage/group" className="text-sm font-semibold text-blue-600 hover:underline whitespace-nowrap">
            그룹 관리 →
          </a>
        </div>
      )}
    </div>
  );
}
