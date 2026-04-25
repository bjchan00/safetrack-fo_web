import { ChevronDown } from "lucide-react";

const FAQ_LIST = [
  {
    q: "SafeTrack은 어떤 서비스인가요?",
    a: "SafeTrack은 가족 구성원의 위치를 실시간으로 공유하고 확인할 수 있는 서비스입니다. 지도 위에서 모든 멤버의 현재 위치와 이동 이력을 확인할 수 있습니다.",
  },
  {
    q: "회원가입은 어떻게 하나요?",
    a: "전화번호(아이디)와 비밀번호를 입력하고 SMS 인증을 완료하면 가입이 완료됩니다. 회원 유형(메인 뷰어, 서브 뷰어, 위치 공유)을 선택하고 약관에 동의하시면 됩니다.",
  },
  {
    q: "위치 정보는 안전하게 보호되나요?",
    a: "모든 위치 데이터는 암호화되어 저장되며, 같은 그룹의 멤버 외에는 절대 공개되지 않습니다. 서버는 국내 데이터센터에 위치하여 개인정보보호법을 준수합니다.",
  },
  {
    q: "위치 공유를 끄고 싶을 때는 어떻게 하나요?",
    a: "마이페이지 > 계정 화면에서 위치 공유 ON/OFF를 설정할 수 있습니다. 공유를 끄면 그룹 멤버에게 내 위치가 표시되지 않습니다. (Phase 2 기능)",
  },
  {
    q: "요금제는 언제든지 변경할 수 있나요?",
    a: "네, 언제든지 마이페이지 > 구독 관리에서 요금제를 변경할 수 있습니다. 업그레이드는 즉시 적용되며, 다운그레이드는 다음 결제일부터 적용됩니다.",
  },
  {
    q: "그룹에 멤버를 추가하려면 어떻게 하나요?",
    a: "메인 뷰어 계정으로 로그인 후 그룹 관리 메뉴에서 초대 코드를 생성하세요. 초대받을 멤버에게 코드를 공유하면 그룹에 참여할 수 있습니다. (Phase 2 기능)",
  },
];

export default function SupportQAPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <p className="text-sm text-blue-600 font-semibold mb-1">고객지원</p>
          <h1 className="text-2xl font-bold text-gray-900">Q&A</h1>
          <p className="text-gray-500 mt-1">자주 묻는 질문을 확인해보세요.</p>
        </div>

        <div className="space-y-3">
          {FAQ_LIST.map((item, i) => (
            <details key={i} className="group bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <summary className="flex items-center justify-between p-5 cursor-pointer list-none select-none hover:bg-gray-50 transition-colors">
                <span className="font-semibold text-gray-900 pr-4">{item.q}</span>
                <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0 transition-transform group-open:rotate-180" />
              </summary>
              <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                {item.a}
              </div>
            </details>
          ))}
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-5 text-center">
          <p className="text-sm text-gray-700 mb-3">원하시는 답변을 찾지 못하셨나요?</p>
          <a
            href="/support/inquiry"
            className="inline-block px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors"
          >
            1:1 문의하기
          </a>
        </div>
      </div>
    </div>
  );
}
