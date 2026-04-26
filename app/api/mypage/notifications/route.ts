import { NextResponse } from "next/server";
import { requireFOAuth, foError } from "@/lib/fo-auth";
import { supabaseAdmin } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

// 알림 목록 조회
export async function GET() {
  const auth = await requireFOAuth();
  if (!auth.member) return auth.error;

  const { data, error } = await supabaseAdmin
    .from("notifications")
    .select("id, type, title, body, is_read, created_at")
    .eq("member_id", auth.member.id)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) return foError(error.message, 500);
  return NextResponse.json(data ?? []);
}

// 전체 읽음 처리
export async function PATCH() {
  const auth = await requireFOAuth();
  if (!auth.member) return auth.error;

  const { error } = await supabaseAdmin
    .from("notifications")
    .update({ is_read: true })
    .eq("member_id", auth.member.id)
    .eq("is_read", false);

  if (error) return foError(error.message, 500);
  return NextResponse.json({ success: true });
}
