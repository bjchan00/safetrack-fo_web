"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, MapPin, Users, Navigation, CheckCircle } from "lucide-react";
import { StepIndicator } from "@/components/ui/StepIndicator";
import { showToast } from "@/components/ui/Toast";
import {
  validatePhone, validatePassword, validateName,
  getPasswordStrength, formatPhone, normalizePhone,
} from "@/lib/validation";
import type { MemberType } from "@/types";

const STEPS = ["기본 정보", "SMS 인증", "유형 선택", "약관 동의"];
const SMS_DURATION = 180; // 3분

interface FieldErrors {
  phone?: string;
  password?: string;
  passwordConfirm?: string;
  name?: string;
  smsCode?: string;
}

export function RegisterForm() {
  const router = useRouter();

  // 단계
  const [step, setStep] = useState(1);

  // Step 1: 기본 정보
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showPwConfirm, setShowPwConfirm] = useState(false);

  // Step 2: SMS 인증
  const [smsSent, setSmsSent] = useState(false);
  const [smsCode, setSmsCode] = useState("");
  const [verifyToken, setVerifyToken] = useState("");
  const [smsTimer, setSmsTimer] = useState(0);

  // Step 3: 유형 선택
  const [memberType, setMemberType] = useState<MemberType | "">("");

  // Step 4: 약관
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [locationAgreed, setLocationAgreed] = useState(false);
  const [marketingAgreed, setMarketingAgreed] = useState(false);

  // 공통
  const [errors, setErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);

  // SMS 타이머
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = useCallback(() => {
    setSmsTimer(SMS_DURATION);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSmsTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  const formatTimer = (sec: number) =>
    `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(sec % 60).padStart(2, "0")}`;

  // Step 1 검증
  const validateStep1 = () => {
    const errs: FieldErrors = {};
    if (!validatePhone(phone)) errs.phone = "올바른 전화번호 형식으로 입력해주세요.";
    if (!validatePassword(password)) errs.password = "비밀번호는 8자 이상 영문+숫자 조합으로 입력해주세요.";
    if (password !== passwordConfirm) errs.passwordConfirm = "비밀번호가 일치하지 않습니다.";
    if (!validateName(name)) errs.name = "이름을 2자 이상 입력해주세요.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSendSms = async () => {
    if (!validatePhone(phone)) {
      setErrors((e) => ({ ...e, phone: "올바른 전화번호 형식으로 입력해주세요." }));
      return;
    }
    setLoading(true);
    try {
      // 중복 확인
      const checkRes = await fetch(`/api/auth/check-phone?phone=${normalizePhone(phone)}`);
      const checkData = await checkRes.json();
      if (!checkData.available) {
        setErrors((e) => ({ ...e, phone: checkData.message }));
        return;
      }

      const res = await fetch("/api/auth/send-sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: normalizePhone(phone) }),
      });
      const data = await res.json();

      if (data.success) {
        setSmsSent(true);
        setSmsCode("");
        startTimer();
        // 개발용: 인증코드를 토스트로 표시 (Phase 3에서 제거)
        showToast(`[개발용] 인증번호: ${data.dev_code}`, "info");
      } else {
        showToast(data.message || "SMS 발송에 실패했습니다.", "error");
      }
    } catch {
      showToast("네트워크 오류가 발생했습니다. 다시 시도해주세요.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySms = async () => {
    if (!smsCode || smsCode.length !== 6) {
      setErrors((e) => ({ ...e, smsCode: "6자리 인증번호를 입력해주세요." }));
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: normalizePhone(phone), code: smsCode }),
      });
      const data = await res.json();

      if (data.success) {
        setVerifyToken(data.token);
        clearInterval(timerRef.current!);
        showToast("인증이 완료되었습니다.", "success");
        setStep(3);
      } else {
        setErrors((e) => ({ ...e, smsCode: data.message }));
        if (data.remaining_attempts === 0) {
          setSmsSent(false);
          setSmsTimer(0);
        }
      }
    } catch {
      showToast("네트워크 오류가 발생했습니다.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!termsAgreed || !privacyAgreed || !locationAgreed) {
      showToast("필수 약관에 모두 동의해주세요.", "error");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: normalizePhone(phone),
          password,
          name: name.trim(),
          member_type: memberType,
          email: email.trim() || undefined,
          verify_token: verifyToken,
          terms_agreed: termsAgreed,
          privacy_agreed: privacyAgreed,
          location_agreed: locationAgreed,
          marketing_agreed: marketingAgreed,
        }),
      });
      const data = await res.json();

      if (data.success) {
        showToast("회원가입이 완료되었습니다!", "success");
        setTimeout(() => router.push("/dashboard"), 800);
      } else {
        showToast(data.message || "회원가입에 실패했습니다.", "error");
      }
    } catch {
      showToast("네트워크 오류가 발생했습니다.", "error");
    } finally {
      setLoading(false);
    }
  };

  const allAgreed = termsAgreed && privacyAgreed && locationAgreed && marketingAgreed;
  const pwStrength = getPasswordStrength(password);
  const pwStrengthColor = { weak: "bg-red-400", medium: "bg-yellow-400", strong: "bg-green-500" }[pwStrength];
  const pwStrengthLabel = { weak: "약함", medium: "보통", strong: "강함" }[pwStrength];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8">
        {/* 로고 */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">SafeTrack</h1>
            <p className="text-xs text-gray-500">회원가입</p>
          </div>
        </div>

        <StepIndicator currentStep={step} steps={STEPS} />

        {/* ─── STEP 1: 기본 정보 ─── */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 mb-2">기본 정보 입력</h2>

            {/* 전화번호 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                아이디(전화번호) <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                className="form-input"
                placeholder="010-0000-0000"
                value={phone}
                onChange={(e) => {
                  setPhone(formatPhone(e.target.value.replace(/[^\d-]/g, "")));
                  setErrors((err) => ({ ...err, phone: undefined }));
                }}
                maxLength={13}
              />
              {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
              <p className="text-xs text-gray-400 mt-1">아이디로 사용되며 변경이 불가합니다.</p>
            </div>

            {/* 비밀번호 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                비밀번호 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  className="form-input pr-10"
                  placeholder="8자 이상 영문+숫자"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors((err) => ({ ...err, password: undefined }));
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {password && (
                <div className="mt-1.5 flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${pwStrengthColor}`}
                      style={{ width: pwStrength === "weak" ? "33%" : pwStrength === "medium" ? "66%" : "100%" }}
                    />
                  </div>
                  <span className="text-xs text-gray-500">{pwStrengthLabel}</span>
                </div>
              )}
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
            </div>

            {/* 비밀번호 확인 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                비밀번호 확인 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPwConfirm ? "text" : "password"}
                  className="form-input pr-10"
                  placeholder="비밀번호를 다시 입력해주세요"
                  value={passwordConfirm}
                  onChange={(e) => {
                    setPasswordConfirm(e.target.value);
                    setErrors((err) => ({ ...err, passwordConfirm: undefined }));
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPwConfirm(!showPwConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPwConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.passwordConfirm && <p className="text-xs text-red-500 mt-1">{errors.passwordConfirm}</p>}
            </div>

            {/* 이름 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                이름 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="실명을 입력해주세요"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setErrors((err) => ({ ...err, name: undefined }));
                }}
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>

            {/* 이메일 (선택) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                이메일 <span className="text-gray-400 text-xs">(선택)</span>
              </label>
              <input
                type="email"
                className="form-input"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button
              className="btn-primary mt-2"
              onClick={() => { if (validateStep1()) setStep(2); }}
            >
              다음 단계 →
            </button>
          </div>
        )}

        {/* ─── STEP 2: SMS 인증 ─── */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 mb-2">전화번호 인증</h2>
            <p className="text-sm text-gray-500">
              <span className="font-semibold text-gray-900">{phone}</span>으로 인증번호를 발송합니다.
            </p>

            <div className="flex gap-2">
              <input
                type="tel"
                className="form-input flex-1"
                placeholder="인증번호 6자리"
                value={smsCode}
                onChange={(e) => {
                  setSmsCode(e.target.value.replace(/\D/g, "").slice(0, 6));
                  setErrors((err) => ({ ...err, smsCode: undefined }));
                }}
                maxLength={6}
                disabled={!smsSent || !!verifyToken}
              />
              <button
                onClick={handleSendSms}
                disabled={loading || (smsSent && smsTimer > 0)}
                className="px-4 py-2.5 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
              >
                {!smsSent ? "인증번호 받기" : smsTimer > 0 ? `재발송 (${formatTimer(smsTimer)})` : "재발송"}
              </button>
            </div>

            {smsSent && smsTimer > 0 && (
              <p className="text-xs text-gray-400">
                인증번호 유효 시간: <span className="font-semibold text-blue-600">{formatTimer(smsTimer)}</span>
              </p>
            )}
            {smsSent && smsTimer === 0 && !verifyToken && (
              <p className="text-xs text-red-500">인증번호가 만료되었습니다. 재발송해주세요.</p>
            )}
            {errors.smsCode && <p className="text-xs text-red-500">{errors.smsCode}</p>}

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs text-blue-700">
              현재 개발 모드입니다. 인증번호가 화면 우측 상단 알림으로 표시됩니다.
            </div>

            <div className="flex gap-3">
              <button className="btn-secondary" onClick={() => setStep(1)}>← 이전</button>
              <button
                className="btn-primary"
                onClick={handleVerifySms}
                disabled={loading || !smsSent || smsCode.length !== 6}
              >
                {loading ? "확인 중..." : "인증 확인"}
              </button>
            </div>
          </div>
        )}

        {/* ─── STEP 3: 유형 선택 ─── */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 mb-2">서비스 이용 목적 선택</h2>
            <p className="text-sm text-gray-500">회원 유형을 선택해주세요. 가입 후 설정에서 변경 가능합니다.</p>

            {[
              {
                type: "main_viewer" as MemberType,
                icon: <MapPin className="w-6 h-6" />,
                title: "위치 보기 (메인)",
                desc: "가족의 위치를 내 기기에서 확인합니다.",
                color: "blue",
              },
              {
                type: "sub_viewer" as MemberType,
                icon: <Users className="w-6 h-6" />,
                title: "함께 위치 보기 (서브)",
                desc: "배우자·보호자와 함께 위치를 확인합니다.",
                color: "indigo",
              },
              {
                type: "location" as MemberType,
                icon: <Navigation className="w-6 h-6" />,
                title: "내 위치 공유",
                desc: "내 위치를 메인 뷰어에게 공유합니다. (자녀·노인)",
                color: "green",
              },
            ].map((item) => {
              const isSelected = memberType === item.type;
              const colorMap: Record<string, string> = {
                blue: isSelected
                  ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                  : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/50",
                indigo: isSelected
                  ? "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200"
                  : "border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50",
                green: isSelected
                  ? "border-green-500 bg-green-50 ring-2 ring-green-200"
                  : "border-gray-200 hover:border-green-300 hover:bg-green-50/50",
              };
              const iconColorMap: Record<string, string> = {
                blue: "text-blue-600",
                indigo: "text-indigo-600",
                green: "text-green-600",
              };

              return (
                <button
                  key={item.type}
                  onClick={() => setMemberType(item.type)}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-start gap-4 ${colorMap[item.color]}`}
                >
                  <div className={`mt-0.5 ${iconColorMap[item.color]}`}>{item.icon}</div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{item.title}</div>
                    <div className="text-sm text-gray-500 mt-0.5">{item.desc}</div>
                  </div>
                  {isSelected && <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />}
                </button>
              );
            })}

            <div className="flex gap-3 pt-2">
              <button className="btn-secondary" onClick={() => setStep(2)}>← 이전</button>
              <button
                className="btn-primary"
                onClick={() => { if (memberType) setStep(4); else showToast("회원 유형을 선택해주세요.", "error"); }}
              >
                다음 단계 →
              </button>
            </div>
          </div>
        )}

        {/* ─── STEP 4: 약관 동의 ─── */}
        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 mb-2">약관 동의</h2>

            {/* 전체 동의 */}
            <button
              onClick={() => {
                const next = !allAgreed;
                setTermsAgreed(next);
                setPrivacyAgreed(next);
                setLocationAgreed(next);
                setMarketingAgreed(next);
              }}
              className={`w-full p-4 rounded-xl border-2 text-left font-semibold flex items-center gap-3 transition-all ${
                allAgreed ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-700 hover:border-gray-300"
              }`}
            >
              <div className={`w-5 h-5 rounded flex items-center justify-center border-2 flex-shrink-0 ${allAgreed ? "bg-blue-600 border-blue-600" : "border-gray-300"}`}>
                {allAgreed && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              전체 동의
            </button>

            <div className="border border-gray-100 rounded-xl divide-y divide-gray-100">
              {[
                { label: "이용약관 동의", required: true, value: termsAgreed, set: setTermsAgreed },
                { label: "개인정보처리방침 동의", required: true, value: privacyAgreed, set: setPrivacyAgreed },
                { label: "위치정보 이용 동의", required: true, value: locationAgreed, set: setLocationAgreed },
                { label: "마케팅 정보 수신 동의", required: false, value: marketingAgreed, set: setMarketingAgreed },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors">
                  <button
                    onClick={() => item.set(!item.value)}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                      item.value ? "bg-blue-600 border-blue-600" : "border-gray-300"
                    }`}
                  >
                    {item.value && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                  <span className="text-sm text-gray-700 flex-1">{item.label}</span>
                  <span className={`text-xs font-medium ${item.required ? "text-red-500" : "text-gray-400"}`}>
                    {item.required ? "필수" : "선택"}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex gap-3 pt-2">
              <button className="btn-secondary" onClick={() => setStep(3)}>← 이전</button>
              <button
                className="btn-primary"
                disabled={loading || !termsAgreed || !privacyAgreed || !locationAgreed}
                onClick={handleRegister}
              >
                {loading ? "가입 중..." : "가입 완료"}
              </button>
            </div>
          </div>
        )}

        {/* 로그인 링크 */}
        <p className="text-center text-sm text-gray-500 mt-6">
          이미 계정이 있으신가요?{" "}
          <a href="/login" className="text-blue-600 font-semibold hover:underline">로그인</a>
        </p>
      </div>
    </div>
  );
}
