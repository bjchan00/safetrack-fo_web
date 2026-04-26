"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Shield, MapPin, AlertTriangle, Loader2, Check, X } from "lucide-react";
import { showToast } from "@/components/ui/Toast";
import type { MemberProfile } from "@/lib/fo-auth";

const MEMBER_TYPE_LABEL: Record<string, string> = {
  main_viewer: "메인 뷰어",
  sub_viewer:  "서브 뷰어",
  location:    "위치 공유",
};

export default function AccountPage() {
  const router = useRouter();
  const [member, setMember] = useState<MemberProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // 프로필 편집
  const [editName,    setEditName]    = useState("");
  const [editEmail,   setEditEmail]   = useState("");
  const [profileSaving,  setProfileSaving]  = useState(false);
  const [profileEditing, setProfileEditing] = useState(false);

  // 비밀번호 변경
  const [currentPw, setCurrentPw] = useState("");
  const [newPw,     setNewPw]     = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwSaving,  setPwSaving]  = useState(false);
  const [pwEditing, setPwEditing] = useState(false);

  // 회원 탈퇴
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawPw,    setWithdrawPw]    = useState("");
  const [withdrawError, setWithdrawError] = useState("");
  const [withdrawing,   setWithdrawing]   = useState(false);

  useEffect(() => {
    fetch("/api/mypage/me")
      .then((r) => r.json())
      .then((data) => {
        setMember(data);
        setEditName(data.name ?? "");
        setEditEmail(data.email ?? "");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleProfileSave = async () => {
    if (!editName.trim() || editName.trim().length < 2) {
      showToast("이름은 2자 이상 입력해주세요.", "error");
      return;
    }
    setProfileSaving(true);
    const res = await fetch("/api/mypage/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editName, email: editEmail }),
    });
    const json = await res.json();
    if (res.ok) {
      setMember((prev) =>
        prev ? { ...prev, name: json.member.name, email: json.member.email } : prev
      );
      showToast("프로필이 저장되었습니다.", "success");
      setProfileEditing(false);
    } else {
      showToast(json.error || "저장에 실패했습니다.", "error");
    }
    setProfileSaving(false);
  };

  const handlePasswordChange = async () => {
    if (!currentPw || !newPw || !confirmPw) {
      showToast("모든 항목을 입력해주세요.", "error");
      return;
    }
    if (newPw !== confirmPw) {
      showToast("새 비밀번호가 일치하지 않습니다.", "error");
      return;
    }
    setPwSaving(true);
    const res = await fetch("/api/mypage/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword: currentPw, newPassword: newPw }),
    });
    const json = await res.json();
    if (res.ok) {
      showToast("비밀번호가 변경되었습니다.", "success");
      setCurrentPw(""); setNewPw(""); setConfirmPw("");
      setPwEditing(false);
    } else {
      showToast(json.error || "변경에 실패했습니다.", "error");
    }
    setPwSaving(false);
  };

  const handleWithdraw = async () => {
    setWithdrawError("");
    if (!withdrawPw) { setWithdrawError("비밀번호를 입력해주세요."); return; }
    setWithdrawing(true);
    const res = await fetch("/api/mypage/withdraw", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: withdrawPw }),
    });
    const json = await res.json();
    if (res.ok) {
      router.push("/");
      router.refresh();
    } else {
      setWithdrawError(json.error || "탈퇴 처리에 실패했습니다.");
    }
    setWithdrawing(false);
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
      </div>
    );
  }
  if (!member) return null;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">계정</h1>
        <p className="text-gray-500 mt-1">계정 정보를 관리하세요.</p>
      </div>

      <div className="space-y-4">
        {/* ── 프로필 ─────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="font-bold text-gray-900">프로필</h2>
            </div>
            {!profileEditing && (
              <button
                onClick={() => setProfileEditing(true)}
                className="text-sm text-blue-600 font-semibold hover:underline"
              >
                수정
              </button>
            )}
          </div>

          {profileEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">이름 *</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="form-input"
                  placeholder="이름을 입력하세요"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  이메일 <span className="text-gray-400 text-xs">(선택)</span>
                </label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="form-input"
                  placeholder="example@email.com"
                />
              </div>
              <div className="pt-2 border-t border-gray-50 space-y-2">
                {[
                  { label: "아이디(전화번호)", value: member.phone },
                  { label: "회원 유형",        value: MEMBER_TYPE_LABEL[member.member_type] },
                  { label: "회원 번호",         value: `#${member.member_number}` },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between py-1.5">
                    <span className="text-sm text-gray-400">{row.label}</span>
                    <span className="text-sm text-gray-500">{row.value}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setProfileEditing(false);
                    setEditName(member.name);
                    setEditEmail(member.email ?? "");
                  }}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50"
                >
                  취소
                </button>
                <button
                  onClick={handleProfileSave}
                  disabled={profileSaving}
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {profileSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  저장
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              {[
                { label: "이름",            value: member.name },
                { label: "이메일",          value: member.email || "—" },
                { label: "아이디(전화번호)", value: member.phone },
                { label: "회원 유형",        value: MEMBER_TYPE_LABEL[member.member_type] },
                { label: "회원 번호",         value: `#${member.member_number}` },
              ].map((row) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0"
                >
                  <span className="text-sm text-gray-500">{row.label}</span>
                  <span className="text-sm font-medium text-gray-900">{row.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── 위치 공유 설정 (location 타입만) ───────────────────── */}
        {member.member_type === "location" && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <MapPin className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="font-bold text-gray-900">위치 공유 설정</h2>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">위치 공유</p>
                <p className="text-sm text-gray-500 mt-0.5">현재 위치를 그룹에 공유합니다.</p>
              </div>
              <button
                disabled
                className="relative w-12 h-6 rounded-full bg-gray-200 cursor-not-allowed opacity-50"
                title="GPS 수집 기능 개발 중 (Phase 4)"
              >
                <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow" />
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-3">* GPS 수집 기능은 Phase 4에서 활성화됩니다.</p>
          </div>
        )}

        {/* ── 보안 / 비밀번호 변경 ─────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="font-bold text-gray-900">보안</h2>
            </div>
            {!pwEditing && (
              <button
                onClick={() => setPwEditing(true)}
                className="text-sm text-blue-600 font-semibold hover:underline"
              >
                비밀번호 변경
              </button>
            )}
          </div>

          {pwEditing ? (
            <div className="space-y-3">
              {[
                { label: "현재 비밀번호",    value: currentPw, set: setCurrentPw },
                { label: "새 비밀번호",      value: newPw,     set: setNewPw     },
                { label: "새 비밀번호 확인", value: confirmPw, set: setConfirmPw },
              ].map((f) => (
                <div key={f.label}>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{f.label}</label>
                  <input
                    type="password"
                    value={f.value}
                    onChange={(e) => f.set(e.target.value)}
                    className="form-input"
                    placeholder="••••••••"
                  />
                </div>
              ))}
              <p className="text-xs text-gray-400">* 새 비밀번호는 8자 이상 영문+숫자 조합이어야 합니다.</p>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setPwEditing(false);
                    setCurrentPw(""); setNewPw(""); setConfirmPw("");
                  }}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50"
                >
                  취소
                </button>
                <button
                  onClick={handlePasswordChange}
                  disabled={pwSaving}
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {pwSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  변경 완료
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-400">보안을 위해 주기적으로 비밀번호를 변경해주세요.</p>
          )}
        </div>

        {/* ── 회원 탈퇴 ────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-red-100 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <h2 className="font-bold text-gray-900">회원 탈퇴</h2>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            탈퇴 시 그룹 관계, 구독 정보 등 모든 데이터가 비활성화됩니다. 데이터는 법적 의무에 따라 일정 기간 보존됩니다.
          </p>
          <button
            onClick={() => setShowWithdrawModal(true)}
            className="px-4 py-2 text-sm font-semibold text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition-colors"
          >
            탈퇴하기
          </button>
        </div>
      </div>

      {/* ── 탈퇴 확인 모달 ───────────────────────────────────────── */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                </div>
                <h3 className="font-bold text-gray-900">회원 탈퇴</h3>
              </div>
              <button
                onClick={() => { setShowWithdrawModal(false); setWithdrawPw(""); setWithdrawError(""); }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              탈퇴를 진행하려면 현재 비밀번호를 입력해주세요.
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">비밀번호</label>
              <input
                type="password"
                value={withdrawPw}
                onChange={(e) => { setWithdrawPw(e.target.value); setWithdrawError(""); }}
                className="form-input"
                placeholder="••••••••"
                onKeyDown={(e) => e.key === "Enter" && handleWithdraw()}
              />
              {withdrawError && (
                <p className="text-xs text-red-600 mt-1.5">{withdrawError}</p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => { setShowWithdrawModal(false); setWithdrawPw(""); setWithdrawError(""); }}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={handleWithdraw}
                disabled={withdrawing}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {withdrawing ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                탈퇴 확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
