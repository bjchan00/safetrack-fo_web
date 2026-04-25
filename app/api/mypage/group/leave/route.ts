import { NextResponse } from "next/server";
import { requireFOAuth, foError } from "@/lib/fo-auth";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function DELETE() {
  const auth = await requireFOAuth();
  if (!auth.member) return auth.error;
  if (auth.member.member_type === "main_viewer") return foError("메인 뷰어는 그룹을 탈퇴할 수 없습니다.", 403);

  const { error } = await supabaseAdmin
    .from("member_groups")
    .delete()
    .eq("member_id", auth.member.id);

  if (error) return foError(error.message, 500);
  return NextResponse.json({ success: true });
}
