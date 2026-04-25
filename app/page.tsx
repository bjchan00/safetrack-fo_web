import Link from "next/link";
import { MapPin, Shield, Clock, Users, Check } from "lucide-react";

const PLANS = [
  {
    name: "무료",
    price: "0",
    period: "",
    desc: "기본 위치 공유",
    features: ["서브 뷰어 1명", "위치모드 1개", "위치 이력 1일"],
    cta: "무료로 시작",
    highlight: false,
  },
  {
    name: "베이직",
    price: "9,900",
    period: "/월",
    desc: "소규모 가족",
    features: ["서브 뷰어 3명", "위치모드 5개", "위치 이력 30일", "실시간 알림"],
    cta: "시작하기",
    highlight: true,
  },
  {
    name: "프리미엄",
    price: "19,900",
    period: "/월",
    desc: "대가족 · 소규모 단체",
    features: ["서브 뷰어 10명", "위치모드 무제한", "위치 이력 90일", "실시간 알림", "우선 고객지원"],
    cta: "시작하기",
    highlight: false,
  },
];

const FEATURES = [
  {
    icon: <MapPin className="w-6 h-6 text-blue-600" />,
    title: "실시간 위치 확인",
    desc: "가족 구성원의 현재 위치를 지도에서 실시간으로 확인하세요.",
  },
  {
    icon: <Shield className="w-6 h-6 text-blue-600" />,
    title: "안전한 데이터 보호",
    desc: "모든 위치 데이터는 암호화되어 안전하게 보호됩니다.",
  },
  {
    icon: <Clock className="w-6 h-6 text-blue-600" />,
    title: "이동 이력 조회",
    desc: "오늘 어디를 다녀왔는지 이동 경로를 확인할 수 있습니다.",
  },
  {
    icon: <Users className="w-6 h-6 text-blue-600" />,
    title: "그룹 관리",
    desc: "가족 그룹을 만들고 초대 코드로 간편하게 멤버를 추가하세요.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 pt-20 pb-28 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            실시간 위치 공유 서비스
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
            가족의 안전을<br />
            <span className="text-blue-600">실시간으로</span> 확인하세요
          </h1>
          <p className="text-lg text-gray-600 mb-10 max-w-xl mx-auto">
            지도 위에서 가족의 위치를 한눈에. 언제 어디서든 안심할 수 있습니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/register"
              className="px-8 py-3.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
            >
              지금 무료로 시작하기
            </Link>
            <Link
              href="/about"
              className="px-8 py-3.5 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
            >
              서비스 소개
            </Link>
          </div>
        </div>
      </section>

      {/* 특징 */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12">
            SafeTrack으로 할 수 있는 것들
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="p-6 rounded-2xl border border-gray-100 bg-gray-50 hover:border-blue-200 hover:bg-blue-50/50 transition-all">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  {f.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 요금제 */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-4">요금제</h2>
          <p className="text-center text-gray-500 mb-12">모든 요금제는 30일 무료 체험 후 결제됩니다.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-6 border-2 transition-all ${
                  plan.highlight
                    ? "border-blue-500 bg-blue-600 text-white shadow-xl shadow-blue-200 scale-105"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                {plan.highlight && (
                  <div className="text-xs font-bold bg-blue-500 text-white px-3 py-1 rounded-full inline-block mb-3">
                    인기
                  </div>
                )}
                <h3 className={`font-bold text-lg mb-1 ${plan.highlight ? "text-white" : "text-gray-900"}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm mb-4 ${plan.highlight ? "text-blue-100" : "text-gray-500"}`}>{plan.desc}</p>
                <div className={`text-3xl font-extrabold mb-6 ${plan.highlight ? "text-white" : "text-gray-900"}`}>
                  {plan.price}원<span className="text-base font-normal">{plan.period}</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <Check className={`w-4 h-4 flex-shrink-0 ${plan.highlight ? "text-blue-200" : "text-blue-600"}`} />
                      <span className={plan.highlight ? "text-blue-100" : "text-gray-600"}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className={`block text-center py-2.5 rounded-xl font-semibold text-sm transition-colors ${
                    plan.highlight
                      ? "bg-white text-blue-600 hover:bg-blue-50"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/pricing" className="text-sm text-blue-600 font-semibold hover:underline">
              요금제 상세 비교 →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-blue-600">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">지금 바로 시작하세요</h2>
          <p className="text-blue-100 mb-8">회원가입 후 30일 무료로 모든 기능을 사용해보세요.</p>
          <Link
            href="/register"
            className="inline-block px-8 py-3.5 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
          >
            무료 회원가입
          </Link>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="bg-gray-900 text-gray-400 py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-bold">SafeTrack</span>
          </div>
          <p className="text-sm">© 2026 SafeTrack. All rights reserved.</p>
          <div className="flex gap-4 text-sm">
            <a href="#" className="hover:text-white transition-colors">이용약관</a>
            <a href="#" className="hover:text-white transition-colors">개인정보처리방침</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
