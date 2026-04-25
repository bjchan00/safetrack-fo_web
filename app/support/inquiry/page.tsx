import Link from "next/link";
import { MessageSquare, Mail, Clock } from "lucide-react";

export default function SupportInquiryPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <p className="text-sm text-blue-600 font-semibold mb-1">고객지원</p>
          <h1 className="text-2xl font-bold text-gray-900">1:1 문의</h1>
          <p className="text-gray-500 mt-1">궁금한 점이 있으시면 문의해 주세요.</p>
        </div>

        {/* 안내 카드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mb-3">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">운영 시간</h3>
            <p className="text-sm text-gray-500">평일 09:00 ~ 18:00<br />(주말·공휴일 제외)</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mb-3">
              <Mail className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">이메일 문의</h3>
            <p className="text-sm text-gray-500">support@safetrack.kr<br />평균 응답 24시간 이내</p>
          </div>
        </div>

        {/* 문의 폼 */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
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
              <label className="block text-sm font-medium text-gray-700 mb-1.5">카테고리</label>
              <select disabled className="form-input disabled:opacity-40">
                <option>카테고리를 선택하세요</option>
                <option>계정 / 로그인</option>
                <option>요금제 / 결제</option>
                <option>위치 공유</option>
                <option>그룹 관리</option>
                <option>기타</option>
              </select>
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
            1:1 문의 기능은 Phase 2에서 제공됩니다. 긴급한 문의는 이메일을 이용해 주세요.
          </div>

          <div className="mt-4 text-sm text-gray-500">
            로그인하면 문의 내역을 관리할 수 있습니다.{" "}
            <Link href="/login" className="text-blue-600 font-semibold hover:underline">
              로그인
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
