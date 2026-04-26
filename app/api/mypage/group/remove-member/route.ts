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

  // 제거될 멤버 정보 조회 (알림용)
  const { data: groupRow } = await supabaseAdmin
    .from("member_groups")
    .select("member_id, members!member_groups_member_id_fkey(name)")
    .eq("id", groupId)
    .eq("main_viewer_id", auth.member.id)
    .single();

  const { error } = await supabaseAdmin
    .from("member_groups")
    .delete()
    .eq("id", groupId)
    .eq("main_viewer_id", auth.member.id);

  if (error) return foError(error.message, 500);

  // 제거된 멤버에게 알림
  if (groupRow?.member_id) {
    await supabaseAdmin.from("notifications").insert({
      member_id: groupRow.member_id,
      type: "group_removed",
      title: "그룹에서 제거되었습니다",
      body: `${auth.member.name}님의 그룹에서 제거되었습니다.`,
    });
  }

  return NextResponse.json({ success: true });
}
