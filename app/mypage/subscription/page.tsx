import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-server";
import { CreditCard, Calendar, RefreshCw, Check } from "lucide-react";
import { AutoRenewToggle } from "./AutoRenewToggle";

interface SubscriptionRow {
  id: string;
  start_date: string;
  end_date: string;
  status: string;
  is_auto_renew: boolean;
  plans: { name: string; price: number } | null;
}

export default async function SubscriptionPage() {
  const member = await getSession();
  if (!member) redirect("/login");
  if (member.member_type !== "main_viewer") redirect("/mypage/dashboard");

  const { data: subscription } = await supabaseAdmin
    .from("subscriptions")
    .select("id, start_date, end_date, status, is_auto_renew, plans(name, price)")
    .eq("member_id", member.id)
    .eq("status", "active")
    .single();

  const sub = subscription as SubscriptionRow | null;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">구독 관리</h1>
        <p className="text-gray-500 mt-1">현재 구독 중인 요금제를 확인하세요.</p>
      </div>

      <div className="space-y-4">
        {/* 현재 요금제 */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="font-bold text-gray-900">현재 요금제</h2>
          </div>

          {sub ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xl font-bold text-gray-900">
                    {sub.plans?.name ?? "요금제"}
                  </p>
                  <p className="text-lg font-semibold text-blue-600 mt-0.5">
                    {(sub.plans?.price ?? 0).toLocaleString()}원 / 월
                  </p>
                </div>
                <span className="flex items-center gap-1.5 text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  구독 중
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <p className="text-xs font-medium text-gray-500">구독 기간</p>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    {sub.start_date} ~ {sub.end_date}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <RefreshCw className="w-4 h-4 text-gray-400" />
                    <p className="text-xs font-medium text-gray-500">다음 결제일</p>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{sub.end_date}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-gray-400">
              <CreditCard className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">현재 구독 중인 요금제가 없습니다.</p>
            </div>
          )}
        </div>

        {/* 자동 갱신 설정 */}
        {sub && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <RefreshCw className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="font-bold text-gray-900">자동 갱신 설정</h2>
            </div>
            <AutoRenewToggle isAutoRenew={sub.is_auto_renew ?? false} />
          </div>
        )}

        {/* 요금제 변경 */}
        <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
          <h2 className="font-bold text-gray-900 mb-4">요금제 변경</h2>
          <div className="text-center py-4">
            <Check className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">결제 연동은 Phase 4에서 제공됩니다.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
