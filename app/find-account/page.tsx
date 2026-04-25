"use client";

import { useState } from "react";
import { MapPin, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function FindAccountPage() {
  const [tab, setTab] = useState<"id" | "pw">("id");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/login" className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900">SafeTrack</span>
          </div>
        </div>

        <div className="flex border border-gray-200 rounded-xl p-1 mb-6">
          {(["id", "pw"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                tab === t ? "bg-blue-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {t === "id" ? "아이디 확인" : "비밀번호 찾기"}
            </button>
          ))}
        </div>

        {tab === "id" ? (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              SafeTrack의 아이디는 <span className="font-semibold">가입 시 등록한 전화번호</span>입니다.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-700">
              아이디(전화번호)를 분실한 경우 고객센터로 문의해주세요.
            </div>
            <Link href="/login" className="btn-primary block text-center py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors">
              로그인으로 돌아가기
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">비밀번호 재설정 기능은 Phase 2에서 제공될 예정입니다.</p>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-700">
              현재는 고객센터를 통해 비밀번호를 재설정할 수 있습니다.
            </div>
            <Link href="/login" className="block text-center py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors text-sm">
              로그인으로 돌아가기
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
