"use client";

import Link from "next/link";
import { useState } from "react";
import { MessageSquare, Mail, Clock, CheckCircle, Loader2, Send } from "lucide-react";

const CATEGORIES = [
  { value: "general",  label: "일반" },
  { value: "account",  label: "계정 / 로그인" },
  { value: "payment",  label: "요금제 / 결제" },
  { value: "location", label: "위치 공유" },
  { value: "group",    label: "그룹 관리" },
  { value: "other",    label: "기타" },
];

export default function SupportInquiryPage() {
  const [name,     setName]     = useState("");
  const [contact,  setContact]  = useState("");
  const [category, setCategory] = useState("general");
  const [title,    setTitle]    = useState("");
  const [content,  setContent]  = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted,  setSubmitted]  = useState(false);
  const [error,      setError]      = useState("");

  const handleSubmit = async () => {
    setError("");
    if (!name.trim())    { setError("이름을 입력해주세요."); return; }
    if (!contact.trim()) { setError("연락처를 입력해주세요."); return; }
    if (!title.trim())   { setError("제목을 입력해주세요."); return; }
    if (!content.trim()) { setError("내용을 입력해주세요."); return; }

    setSubmitting(true);
    const res = await fetch("/api/support/inquiry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, contact, category, title, content }),
    });
    const json = await res.json();
    if (res.ok) {
      setSubmitted(true);
    } else {
      setError(json.error || "오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    }
    setSubmitting(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">문의가 접수되었습니다</h2>
            <p className="text-sm text-gray-500 mb-6">
              입력하신 연락처로 영업일 기준 1~3일 내에 답변드리겠습니다.
            </p>
            <div className="flex justify-center gap-3">
              <Link
                href="/support/qa"
                className="px-5 py-2.5 border border-gray-200 text-sm font-medium text-gray-600 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Q&A 보기
              </Link>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setName(""); setContact(""); setTitle(""); setContent(""); setCategory("general");
                }}
                className="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors"
              >
                추가 문의하기
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  이름 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="홍길동"
                  className="form-input"
                  maxLength={50}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  연락처 <span className="text-red-500">*</span>
                  <span className="text-gray-400 text-xs ml-1">(전화번호 또는 이메일)</span>
                </label>
                <input
                  type="text"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="010-0000-0000"
                  className="form-input"
                  maxLength={100}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">카테고리</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="form-input">
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                제목 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="문의 제목을 입력하세요"
                className="form-input"
                maxLength={100}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                내용 <span className="text-red-500">*</span>
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={5}
                placeholder="문의 내용을 상세히 작성해주세요"
                className="form-input resize-none"
                maxLength={2000}
              />
              <p className="text-xs text-gray-400 mt-1 text-right">{content.length} / 2000</p>
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
                {error}
              </p>
            )}

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              문의 접수
            </button>
          </div>

          <p className="mt-4 text-sm text-gray-500">
            로그인하면 문의 내역을 관리할 수 있습니다.{" "}
            <Link href="/login" className="text-blue-600 font-semibold hover:underline">
              로그인
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
