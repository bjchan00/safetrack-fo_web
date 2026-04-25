import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-server";
import { CreditCard, Check } from "lucide-react";

export default async function SubscriptionPage() {
  const member = await getSession();
  if (!member) redirect("/login");
  if (member.member_type !== "main_viewer") redirect("/mypage/dashboard");

  const { data: subscription } = await supabaseAdmin
    .from("subscriptions")
    .select("*, plans(name, price)")
    .eq("member_id", member.id)
    .eq("status", "active")
    .single();

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">구독 관리</h1>
        <p className="text-gray-500 mt-1">현재 구독 중인 요금제를 확인하세요.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="font-bold text-gray-900">현재 요금제</h2>
        </div>

        {subscription ? (
          <div>
            <p className="text-lg font-bold text-gray-900">
              {(subscription as { plans?: { name: string; price: number } }).plans?.name ?? "요금제"}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {subscription.start_date} ~ {subscription.end_date}
            </p>
            <div className="mt-3 flex items-center gap-2 text-sm text-green-600">
              <span className="w-2 h-2 bg-green-500 rounded-full" />
              구독 중
            </div>
          </div>
        ) : (
          <div className="text-center py-6 text-gray-400">
            <CreditCard className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm">현재 구독 중인 요금제가 없습니다.</p>
          </div>
        )}
      </div>

      <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
        <h2 className="font-bold text-gray-900 mb-4">요금제 변경</h2>
        <div className="text-center py-4">
          <Check className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500">결제 연동은 Phase 3에서 제공됩니다.</p>
        </div>
      </div>
    </div>
  );
}
