"use client";

import { useState } from "react";
import { MapPin, ArrowLeft, Phone, MessageSquare, Lock, CheckCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";

type PwStep = "phone" | "sms" | "newpw" | "done";

export default function FindAccountPage() {
  const [tab, setTab] = useState<"id" | "pw">("id");

  // 비밀번호 찾기 상태
  const [pwStep,      setPwStep]      = useState<PwStep>("phone");
  const [phone,       setPhone]       = useState("");
  const [smsCode,     setSmsCode]     = useState("");
  const [verifyToken, setVerifyToken] = useState("");
  const [devCode,     setDevCode]     = useState("");
  const [newPw,       setNewPw]       = useState("");
  const [confirmPw,   setConfirmPw]   = useState("");
  const [showPw,      setShowPw]      = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState("");

  const resetPwFlow = () => {
    setPwStep("phone"); setPhone(""); setSmsCode(""); setVerifyToken("");
    setDevCode(""); setNewPw(""); setConfirmPw(""); setError("");
  };

  // Step 1: 전화번호 확인
  const handleCheckPhone = async () => {
    setError("");
    const normalized = phone.replace(/\D/g, "");
    if (normalized.length < 10) { setError("올바른 전화번호를 입력해주세요."); return; }
    setLoading(true);
    const res = await fetch(`/api/auth/check-phone?phone=${normalized}`);
    const json = await res.json();
    if (!res.ok || !json.exists) {
      setError("가입된 계정을 찾을 수 없습니다.");
      setLoading(false); return;
    }
    // SMS 발송
    const smsRes = await fetch("/api/auth/send-sms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: normalized }),
    });
    const smsJson = await smsRes.json();
    if (!smsRes.ok) { setError(smsJson.error || "SMS 발송에 실패했습니다."); setLoading(false); return; }
    if (smsJson.dev_code) setDevCode(smsJson.dev_code);
    setPhone(normalized);
    setPwStep("sms");
    setLoading(false);
  };

  // Step 2: SMS 인증
  const handleVerifySms = async () => {
    setError("");
    if (smsCode.length !== 6) { setError("6자리 인증번호를 입력해주세요."); return; }
    setLoading(true);
    const res = await fetch("/api/auth/verify-sms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, code: smsCode }),
    });
    const json = await res.json();
    if (!res.ok) { setError(json.error || "인증번호가 올바르지 않습니다."); setLoading(false); return; }
    setVerifyToken(json.token);
    setPwStep("newpw");
    setLoading(false);
  };

  // Step 3: 새 비밀번호 설정
  const handleResetPassword = async () => {
    setError("");
    if (!newPw || newPw.length < 8 || !/(?=.*[a-zA-Z])(?=.*\d)/.test(newPw)) {
      setError("비밀번호는 8자 이상 영문+숫자 조합으로 입력해주세요."); return;
    }
    if (newPw !== confirmPw) { setError("비밀번호가 일치하지 않습니다."); return; }
    setLoading(true);
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, verify_token: verifyToken, newPassword: newPw }),
    });
    const json = await res.json();
    if (!res.ok) { setError(json.error || "비밀번호 재설정에 실패했습니다."); setLoading(false); return; }
    setPwStep("done");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        {/* 헤더 */}
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

        {/* 탭 */}
        <div className="flex border border-gray-200 rounded-xl p-1 mb-6">
          {(["id", "pw"] as const).map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); resetPwFlow(); }}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                tab === t ? "bg-blue-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {t === "id" ? "아이디 확인" : "비밀번호 찾기"}
            </button>
          ))}
        </div>

        {/* 아이디 확인 탭 */}
        {tab === "id" && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              SafeTrack의 아이디는 <span className="font-semibold">가입 시 등록한 전화번호</span>입니다.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-700">
              아이디(전화번호)를 분실한 경우 고객센터로 문의해주세요.
            </div>
            <Link
              href="/login"
              className="block text-center py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors text-sm"
            >
              로그인으로 돌아가기
            </Link>
          </div>
        )}

        {/* 비밀번호 찾기 탭 */}
        {tab === "pw" && (
          <>
            {/* Step 완료 */}
            {pwStep === "done" && (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-lg">비밀번호가 재설정되었습니다</p>
                  <p className="text-sm text-gray-500 mt-1">새 비밀번호로 로그인해주세요.</p>
                </div>
                <Link
                  href="/login"
                  className="block text-center py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors text-sm"
                >
                  로그인하기
                </Link>
              </div>
            )}

            {/* Step 1: 전화번호 입력 */}
            {pwStep === "phone" && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Phone className="w-3.5 h-3.5 text-blue-600" />
                  </div>
                  <p className="font-semibold text-gray-800 text-sm">가입한 전화번호를 입력해주세요</p>
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCheckPhone()}
                  placeholder="010-0000-0000"
                  className="form-input"
                />
                {error && <p className="text-sm text-red-600">{error}</p>}
                <button
                  onClick={handleCheckPhone}
                  disabled={loading}
                  className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  인증번호 받기
                </button>
              </div>
            )}

            {/* Step 2: SMS 인증 */}
            {pwStep === "sms" && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                  </div>
                  <p className="font-semibold text-gray-800 text-sm">인증번호를 입력해주세요</p>
                </div>
                <p className="text-xs text-gray-500">{phone}으로 6자리 인증번호가 발송되었습니다.</p>
                {devCode && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 text-sm text-amber-700 font-mono">
                    [개발 모드] 인증번호: <span className="font-bold">{devCode}</span>
                  </div>
                )}
                <input
                  type="text"
                  value={smsCode}
                  onChange={(e) => setSmsCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  onKeyDown={(e) => e.key === "Enter" && handleVerifySms()}
                  placeholder="000000"
                  className="form-input text-center text-xl tracking-widest font-mono"
                  maxLength={6}
                />
                {error && <p className="text-sm text-red-600">{error}</p>}
                <button
                  onClick={handleVerifySms}
                  disabled={loading || smsCode.length !== 6}
                  className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  인증 확인
                </button>
                <button
                  onClick={() => { setPwStep("phone"); setError(""); setSmsCode(""); }}
                  className="w-full text-sm text-gray-500 hover:text-gray-700"
                >
                  전화번호 다시 입력
                </button>
              </div>
            )}

            {/* Step 3: 새 비밀번호 */}
            {pwStep === "newpw" && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Lock className="w-3.5 h-3.5 text-blue-600" />
                  </div>
                  <p className="font-semibold text-gray-800 text-sm">새 비밀번호를 설정해주세요</p>
                </div>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    value={newPw}
                    onChange={(e) => setNewPw(e.target.value)}
                    placeholder="새 비밀번호 (8자 이상 영문+숫자)"
                    className="form-input pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <input
                  type="password"
                  value={confirmPw}
                  onChange={(e) => setConfirmPw(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleResetPassword()}
                  placeholder="새 비밀번호 확인"
                  className="form-input"
                />
                {error && <p className="text-sm text-red-600">{error}</p>}
                <button
                  onClick={handleResetPassword}
                  disabled={loading}
                  className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  비밀번호 재설정
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
