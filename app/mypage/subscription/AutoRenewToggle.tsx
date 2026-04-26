"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { showToast } from "@/components/ui/Toast";

export function AutoRenewToggle({ isAutoRenew }: { isAutoRenew: boolean }) {
  const [autoRenew, setAutoRenew] = useState(isAutoRenew);
  const [saving, setSaving] = useState(false);

  const toggle = async () => {
    setSaving(true);
    const next = !autoRenew;
    const res = await fetch("/api/mypage/subscription", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_auto_renew: next }),
    });
    const json = await res.json();
    if (res.ok) {
      setAutoRenew(next);
      showToast(
        next ? "자동갱신이 활성화되었습니다." : "자동갱신이 비활성화되었습니다.",
        "success"
      );
    } else {
      showToast(json.error || "저장에 실패했습니다.", "error");
    }
    setSaving(false);
  };

  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="font-medium text-gray-900">자동 갱신</p>
        <p className="text-sm text-gray-500 mt-0.5">
          {autoRenew
            ? "구독 만료 시 자동으로 갱신됩니다."
            : "구독 만료 시 자동으로 갱신되지 않습니다."}
        </p>
      </div>
      <button
        onClick={toggle}
        disabled={saving}
        aria-label="자동갱신 토글"
        className={`relative w-12 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${
          autoRenew ? "bg-blue-600" : "bg-gray-200"
        } ${saving ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      >
        {saving ? (
          <Loader2 className="w-3 h-3 text-white absolute top-1.5 left-1/2 -translate-x-1/2 animate-spin" />
        ) : (
          <span
            className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
              autoRenew ? "translate-x-6" : "translate-x-1"
            }`}
          />
        )}
      </button>
    </div>
  );
}
