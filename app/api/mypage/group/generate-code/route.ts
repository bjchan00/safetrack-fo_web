import { NextResponse } from "next/server";
import { requireFOAuth, foError } from "@/lib/fo-auth";
import { supabaseAdmin } from "@/lib/supabase-server";

function generateCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

export async function POST() {
  const auth = await requireFOAuth();
  if (!auth.member) return auth.error;
  if (auth.member.member_type !== "main_viewer") return foError("메인 뷰어만 초대 코드를 생성할 수 있습니다.", 403);

  // 충돌 없는 코드 생성 (최대 5회 시도)
  let code = "";
  for (let i = 0; i < 5; i++) {
    const candidate = generateCode();
    const { data } = await supabaseAdmin.from("members").select("id").eq("invite_code", candidate).single();
    if (!data) { code = candidate; break; }
  }
  if (!code) return foError("초대 코드 생성에 실패했습니다. 다시 시도해주세요.", 500);

  const { error } = await supabaseAdmin
    .from("members")
    .update({ invite_code: code, updated_at: new Date().toISOString() })
    .eq("id", auth.member.id);

  if (error) return foError(error.message, 500);
  return NextResponse.json({ success: true, inviteCode: code });
}
