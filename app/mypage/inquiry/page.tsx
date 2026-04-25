"use client";

import { useState, useEffect, useCallback } from "react";
import { MessageSquare, Plus, ChevronDown, ChevronUp, Loader2, Send, X } from "lucide-react";
import { showToast } from "@/components/ui/Toast";

interface Inquiry {
  id: string;
  title: string;
  content: string;
  category: string;
  status: "pending" | "answered" | "closed";
  answer: string | null;
  answered_at: string | null;
  created_at: string;
}

const CATEGORIES = [
  { value: "general", label: "일반" },
  { value: "account", label: "계정" },
  { value: "payment", label: "결제/요금제" },
  { value: "location", label: "위치/기능" },
  { value: "group", label: "그룹" },
  { value: "other", label: "기타" },
];

const STATUS_CONFIG = {
  pending:  { label: "답변 대기", className: "bg-amber-100 text-amber-700" },
  answered: { label: "답변 완료", className: "bg-green-100 text-green-700" },
  closed:   { label: "종료",      className: "bg-gray-100 text-gray-500" },
};

export default function InquiryPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // 작성 폼 상태
  const [category, setCategory] = useState("general");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchInquiries = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/mypage/inquiry");
    if (res.ok) setInquiries(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { fetchInquiries(); }, [fetchInquiries]);

  const handleSubmit = async () => {
    if (!title.trim()) { showToast("제목을 입력해주세요.", "error"); return; }
    if (!content.trim()) { showToast("내용을 입력해주세요.", "error"); return; }
    setSubmitting(true);
    const res = await fetch("/api/mypage/inquiry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category, title, content }),
    });
    const json = await res.json();
    if (res.ok) {
      showToast("문의가 접수되었습니다.", "success");
      setTitle(""); setContent(""); setCategory("general");
      setShowForm(false);
      fetchInquiries();
    } else {
      showToast(json.error || "오류가 발생했습니다.", "error");
    }
    setSubmitting(false);
  };

  const categoryLabel = (v: string) => CATEGORIES.find((c) => c.value === v)?.label ?? v;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">1:1 문의</h1>
          <p className="text-gray-500 mt-1">궁금한 점이 있으시면 문의해 주세요.</p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
            showForm
              ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? "취소" : "문의 작성"}
        </button>
      </div>

      {/* ── 작성 폼 ─────────────────────────────────────────── */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="font-bold text-gray-900">문의 작성</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">카테고리</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="form-input"
              >
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

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              문의 접수
            </button>
          </div>
        </div>
      )}

      {/* ── 문의 내역 ────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-900">문의 내역</h2>
          <span className="text-xs text-gray-400">총 {inquiries.length}건</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
          </div>
        ) : inquiries.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">아직 문의 내역이 없습니다.</p>
            <p className="text-xs mt-1">궁금한 점이 있으시면 문의를 작성해주세요.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-50">
            {inquiries.map((inq) => {
              const isExpanded = expandedId === inq.id;
              const statusCfg = STATUS_CONFIG[inq.status];
              return (
                <li key={inq.id}>
                  <button
                    className="w-full text-left px-6 py-4 hover:bg-gray-50 transition-colors"
                    onClick={() => setExpandedId(isExpanded ? null : inq.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-medium">
                            {categoryLabel(inq.category)}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusCfg.className}`}>
                            {statusCfg.label}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-gray-900 mt-1.5 truncate">{inq.title}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(inq.created_at).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" })}
                        </p>
                      </div>
                      {isExpanded
                        ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
                        : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
                      }
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-6 pb-5 space-y-3 bg-gray-50 border-t border-gray-100">
                      <div className="pt-4">
                        <p className="text-xs font-medium text-gray-500 mb-2">문의 내용</p>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed bg-white rounded-xl p-4 border border-gray-100">
                          {inq.content}
                        </p>
                      </div>

                      {inq.answer && (
                        <div>
                          <p className="text-xs font-medium text-green-600 mb-2">
                            답변 · {inq.answered_at ? new Date(inq.answered_at).toLocaleDateString("ko-KR") : ""}
                          </p>
                          <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed bg-green-50 rounded-xl p-4 border border-green-100">
                            {inq.answer}
                          </p>
                        </div>
                      )}

                      {inq.status === "pending" && !inq.answer && (
                        <div className="bg-amber-50 rounded-xl p-3 text-xs text-amber-700">
                          답변이 접수되었습니다. 영업일 기준 1~3일 내에 답변드리겠습니다.
                        </div>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
