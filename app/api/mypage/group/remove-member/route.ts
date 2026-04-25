import { NextRequest, NextResponse } from "next/server";
import { requireFOAuth, foError } from "@/lib/fo-auth";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function DELETE(req: NextRequest) {
  const auth = await requireFOAuth();
  if (!auth.member) return auth.error;
  if (auth.member.member_type !== "main_viewer") return foError("권한이 없습니다.", 403);

  const { searchParams } = new URL(req.url);
  const groupId = searchParams.get("groupId");
  if (!groupId) return foError("groupId가 필요합니다.");

  const { error } = await supabaseAdmin
    .from("member_groups")
    .delete()
    .eq("id", groupId)
    .eq("main_viewer_id", auth.member.id);

  if (error) return foError(error.message, 500);
  return NextResponse.json({ success: true });
}
