import Link from "next/link";
import { Check, X } from "lucide-react";

const PLANS = [
  {
    name: "무료",
    price: "0",
    period: "",
    desc: "기본 위치 공유",
    highlight: false,
    features: [
      { label: "서브 뷰어", value: "1명" },
      { label: "위치 공유 멤버", value: "1명" },
      { label: "위치 이력", value: "1일" },
      { label: "실시간 알림", available: false },
      { label: "우선 고객지원", available: false },
    ],
  },
  {
    name: "베이직",
    price: "9,900",
    period: "/월",
    desc: "소규모 가족",
    highlight: true,
    features: [
      { label: "서브 뷰어", value: "3명" },
      { label: "위치 공유 멤버", value: "5명" },
      { label: "위치 이력", value: "30일" },
      { label: "실시간 알림", available: true },
      { label: "우선 고객지원", available: false },
    ],
  },
  {
    name: "프리미엄",
    price: "19,900",
    period: "/월",
    desc: "대가족 · 소규모 단체",
    highlight: false,
    features: [
      { label: "서브 뷰어", value: "10명" },
      { label: "위치 공유 멤버", value: "무제한" },
      { label: "위치 이력", value: "90일" },
      { label: "실시간 알림", available: true },
      { label: "우선 고객지원", available: true },
    ],
  },
];

type Feature = { label: string; value?: string; available?: boolean };

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">요금제</h1>
          <p className="text-gray-600">가족 규모에 맞는 요금제를 선택하세요. 모든 요금제는 30일 무료 체험이 제공됩니다.</p>
        </div>
      </section>

      {/* 플랜 카드 */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-7 border-2 ${
                  plan.highlight
                    ? "border-blue-500 bg-blue-600 shadow-xl shadow-blue-200"
                    : "border-gray-200 bg-white"
                }`}
              >
                {plan.highlight && (
                  <div className="text-xs font-bold bg-blue-500 text-white px-3 py-1 rounded-full inline-block mb-3">
                    인기
                  </div>
                )}
                <h3 className={`font-bold text-xl mb-1 ${plan.highlight ? "text-white" : "text-gray-900"}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm mb-5 ${plan.highlight ? "text-blue-100" : "text-gray-500"}`}>{plan.desc}</p>
                <div className={`text-4xl font-extrabold mb-6 ${plan.highlight ? "text-white" : "text-gray-900"}`}>
                  {plan.price}원<span className="text-base font-normal">{plan.period}</span>
                </div>

                <ul className="space-y-3 mb-7">
                  {plan.features.map((f: Feature) => (
                    <li key={f.label} className="flex items-center justify-between text-sm">
                      <span className={plan.highlight ? "text-blue-100" : "text-gray-600"}>{f.label}</span>
                      {f.value !== undefined ? (
                        <span className={`font-semibold ${plan.highlight ? "text-white" : "text-gray-900"}`}>
                          {f.value}
                        </span>
                      ) : f.available ? (
                        <Check className={`w-4 h-4 ${plan.highlight ? "text-blue-200" : "text-green-500"}`} />
                      ) : (
                        <X className={`w-4 h-4 ${plan.highlight ? "text-blue-300" : "text-gray-300"}`} />
                      )}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/register"
                  className={`block text-center py-3 rounded-xl font-semibold text-sm transition-colors ${
                    plan.highlight
                      ? "bg-white text-blue-600 hover:bg-blue-50"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {plan.name === "무료" ? "무료로 시작" : "30일 무료 체험"}
                </Link>
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-gray-400 mt-8">
            모든 금액은 VAT 포함 가격입니다. 결제 연동은 Phase 3에서 제공됩니다.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">자주 묻는 질문</h2>
          <div className="space-y-4">
            {[
              { q: "무료 체험은 어떻게 시작하나요?", a: "회원가입 후 베이직 또는 프리미엄 요금제를 선택하면 자동으로 30일 무료 체험이 시작됩니다. 체험 기간 동안 카드 정보를 입력하지 않아도 됩니다." },
              { q: "요금제를 언제든 변경할 수 있나요?", a: "네, 언제든지 요금제를 업그레이드하거나 다운그레이드할 수 있습니다. 변경은 다음 결제일부터 적용됩니다." },
              { q: "해지하면 데이터는 어떻게 되나요?", a: "구독 해지 후 30일간 데이터가 보관됩니다. 이후에는 자동으로 삭제됩니다." },
            ].map((item) => (
              <div key={item.q} className="bg-white rounded-2xl border border-gray-200 p-5">
                <p className="font-semibold text-gray-900 mb-2">{item.q}</p>
                <p className="text-sm text-gray-500 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
