import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Users, Plus, Link2 } from "lucide-react";

export default async function GroupPage() {
  const member = await getSession();
  if (!member) redirect("/login");

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">그룹 관리</h1>
        <p className="text-gray-500 mt-1">가족 그룹을 관리하고 멤버를 초대하세요.</p>
      </div>

      {member.member_type === "main_viewer" ? (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Link2 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900">초대 코드</h2>
                <p className="text-sm text-gray-500">멤버에게 초대 코드를 공유하세요</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-sm text-gray-500 mb-3">Phase 2에서 초대 코드 기능이 활성화됩니다.</p>
              <button
                disabled
                className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold text-sm disabled:opacity-40 flex items-center gap-2 mx-auto"
              >
                <Plus className="w-4 h-4" />
                초대 코드 생성
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-indigo-600" />
              </div>
              <h2 className="font-bold text-gray-900">그룹 멤버</h2>
            </div>
            <div className="text-center py-8 text-gray-400">
              <Users className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">아직 그룹 멤버가 없습니다.</p>
              <p className="text-xs mt-1">초대 코드를 공유해 멤버를 추가하세요.</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Link2 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">그룹 참여</h2>
              <p className="text-sm text-gray-500">메인 뷰어의 초대 코드를 입력하세요</p>
            </div>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <p className="text-sm text-gray-500 mb-3">Phase 2에서 초대 코드 입력 기능이 활성화됩니다.</p>
            <input
              type="text"
              disabled
              placeholder="초대 코드 6자리 입력"
              className="form-input text-center tracking-widest disabled:opacity-40 mb-3"
            />
            <button
              disabled
              className="w-full py-2.5 bg-blue-600 text-white rounded-xl font-semibold text-sm disabled:opacity-40"
            >
              그룹 참여
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
