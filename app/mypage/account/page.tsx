import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { User, MapPin, Shield } from "lucide-react";

const MEMBER_TYPE_LABEL: Record<string, string> = {
  main_viewer: "메인 뷰어",
  sub_viewer: "서브 뷰어",
  location: "위치 공유",
};

export default async function AccountPage() {
  const member = await getSession();
  if (!member) redirect("/login");

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">계정</h1>
        <p className="text-gray-500 mt-1">계정 정보를 관리하세요.</p>
      </div>

      <div className="space-y-4">
        {/* 프로필 */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="font-bold text-gray-900">프로필</h2>
          </div>
          <div className="space-y-3">
            {[
              { label: "이름", value: member.name },
              { label: "아이디(전화번호)", value: member.phone },
              { label: "회원 유형", value: MEMBER_TYPE_LABEL[member.member_type] },
              { label: "회원 번호", value: `#${member.member_number}` },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <span className="text-sm text-gray-500">{row.label}</span>
                <span className="text-sm font-medium text-gray-900">{row.value}</span>
              </div>
            ))}
          </div>
          <button className="mt-4 text-sm text-blue-600 font-semibold hover:underline">
            프로필 수정 (Phase 2)
          </button>
        </div>

        {/* 위치 공유 설정 */}
        {member.member_type === "location" && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <MapPin className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="font-bold text-gray-900">위치 공유 설정</h2>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">위치 공유</p>
                <p className="text-sm text-gray-500 mt-0.5">현재 위치를 그룹에 공유합니다.</p>
              </div>
              <div className="text-sm text-gray-400">Phase 2 예정</div>
            </div>
          </div>
        )}

        {/* 보안 */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="font-bold text-gray-900">보안</h2>
          </div>
          <button className="text-sm text-blue-600 font-semibold hover:underline">
            비밀번호 변경 (Phase 2)
          </button>
        </div>
      </div>
    </div>
  );
}
