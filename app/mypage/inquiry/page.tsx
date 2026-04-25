import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { MessageSquare } from "lucide-react";

export default async function InquiryPage() {
  const member = await getSession();
  if (!member) redirect("/login");

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">1:1 문의</h1>
        <p className="text-gray-500 mt-1">궁금한 점이 있으시면 문의해 주세요.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-4">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="font-bold text-gray-900">문의 작성</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">제목</label>
            <input
              type="text"
              disabled
              placeholder="문의 제목을 입력하세요"
              className="form-input disabled:opacity-40"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">내용</label>
            <textarea
              disabled
              rows={5}
              placeholder="문의 내용을 상세히 작성해주세요"
              className="form-input resize-none disabled:opacity-40"
            />
          </div>
        </div>
        <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-700">
          1:1 문의 기능은 Phase 2에서 제공됩니다.
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="font-bold text-gray-900 mb-4">문의 내역</h2>
        <div className="text-center py-8 text-gray-400">
          <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-30" />
          <p className="text-sm">문의 내역이 없습니다.</p>
        </div>
      </div>
    </div>
  );
}
