import Link from "next/link";
import { MapPin, Shield, Clock, Users, Smartphone, Bell } from "lucide-react";

const FEATURES = [
  {
    icon: MapPin,
    color: "blue",
    title: "실시간 위치 공유",
    desc: "가족 구성원의 현재 위치를 지도에서 실시간으로 확인할 수 있습니다. 언제 어디서든 가족의 안전을 확인하세요.",
  },
  {
    icon: Shield,
    color: "green",
    title: "안전한 데이터 보호",
    desc: "모든 위치 데이터는 암호화되어 저장되며 그룹 멤버 외에는 절대 공개되지 않습니다.",
  },
  {
    icon: Clock,
    color: "purple",
    title: "이동 이력 조회",
    desc: "오늘 하루 어디를 다녀왔는지 이동 경로를 날짜별로 확인할 수 있습니다.",
  },
  {
    icon: Users,
    color: "indigo",
    title: "그룹 관리",
    desc: "가족 그룹을 만들고 초대 코드로 간편하게 멤버를 추가하세요. 역할별 권한을 세밀하게 설정할 수 있습니다.",
  },
  {
    icon: Smartphone,
    color: "orange",
    title: "iOS · Android 앱",
    desc: "모바일 앱으로 언제 어디서든 가족의 위치를 확인하고, 위치 공유를 ON/OFF 할 수 있습니다.",
  },
  {
    icon: Bell,
    color: "red",
    title: "실시간 알림",
    desc: "가족이 특정 장소에 도착하거나 떠날 때 즉시 알림을 받을 수 있습니다.",
  },
];

const colorMap: Record<string, string> = {
  blue: "bg-blue-100 text-blue-600",
  green: "bg-green-100 text-green-600",
  purple: "bg-purple-100 text-purple-600",
  indigo: "bg-indigo-100 text-indigo-600",
  orange: "bg-orange-100 text-orange-600",
  red: "bg-red-100 text-red-600",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            SafeTrack 서비스 소개
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            가족의 안전을 실시간으로 확인하는 위치 공유 서비스입니다.
            지도 위에서 모두의 위치를 한눈에 파악하고 안심하세요.
          </p>
        </div>
      </section>

      {/* 주요 기능 */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-12">주요 기능</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:border-blue-200 transition-colors">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${colorMap[f.color]}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 회원 유형 */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">회원 유형</h2>
          <p className="text-center text-gray-500 mb-10">SafeTrack은 역할에 따라 3가지 회원 유형을 제공합니다.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "메인 뷰어",
                badge: "main_viewer",
                color: "blue",
                desc: "그룹 전체를 관리하는 주 계정입니다. 모든 멤버의 위치를 조회하고 그룹을 생성·관리할 수 있습니다.",
                features: ["실시간 위치 지도", "그룹 생성 및 관리", "구독 결제 및 관리", "이동 이력 90일"],
              },
              {
                title: "서브 뷰어",
                badge: "sub_viewer",
                color: "indigo",
                desc: "그룹에 초대된 보조 조회 계정입니다. 위치를 확인할 수 있지만 결제 및 그룹 관리는 불가합니다.",
                features: ["실시간 위치 지도", "이동 이력 조회", "알림 수신"],
              },
              {
                title: "위치 공유",
                badge: "location",
                color: "green",
                desc: "자신의 위치를 그룹에 공유하는 계정입니다. 자녀나 이동 대상자가 사용합니다.",
                features: ["내 위치 공유 ON/OFF", "그룹 참여"],
              },
            ].map((type) => (
              <div key={type.title} className="bg-white rounded-2xl border border-gray-200 p-6">
                <span className={`text-xs font-mono bg-${type.color}-100 text-${type.color}-700 px-2 py-1 rounded-md`}>
                  {type.badge}
                </span>
                <h3 className="font-bold text-gray-900 mt-3 mb-2">{type.title}</h3>
                <p className="text-sm text-gray-500 mb-4 leading-relaxed">{type.desc}</p>
                <ul className="space-y-1.5">
                  {type.features.map((f) => (
                    <li key={f} className="text-sm text-gray-600 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-blue-600">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-3">지금 바로 시작하세요</h2>
          <p className="text-blue-100 mb-6">30일 무료 체험으로 SafeTrack의 모든 기능을 경험해보세요.</p>
          <Link href="/register" className="inline-block px-8 py-3 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-colors">
            무료 회원가입
          </Link>
        </div>
      </section>
    </div>
  );
}
