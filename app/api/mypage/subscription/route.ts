import { NextRequest, NextResponse } from "next/server";
import { requireFOAuth, foError } from "@/lib/fo-auth";
import { supabaseAdmin } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest) {
  const auth = await requireFOAuth();
  if (!auth.member) return auth.error;

  const { is_auto_renew } = await req.json();
  if (typeof is_auto_renew !== "boolean") return foError("올바른 값을 입력해주세요.");

  const { error } = await supabaseAdmin
    .from("subscriptions")
    .update({ is_auto_renew })
    .eq("member_id", auth.member.id)
    .eq("status", "active");

  if (error) return foError(error.message, 500);
  return NextResponse.json({ success: true, is_auto_renew });
}
