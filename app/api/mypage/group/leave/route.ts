import { NextResponse } from "next/server";
import { requireFOAuth, foError } from "@/lib/fo-auth";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function DELETE() {
  const auth = await requireFOAuth();
  if (!auth.member) return auth.error;
  if (auth.member.member_type === "main_viewer") return foError("메인 뷰어는 그룹을 탈퇴할 수 없습니다.", 403);

  // 탈퇴 전 메인 뷰어 정보 조회 (알림용)
  const { data: group } = await supabaseAdmin
    .from("member_groups")
    .select("main_viewer_id, members!member_groups_main_viewer_id_fkey(name)")
    .eq("member_id", auth.member.id)
    .single();

  const { error } = await supabaseAdmin
    .from("member_groups")
    .delete()
    .eq("member_id", auth.member.id);

  if (error) return foError(error.message, 500);

  // 탈퇴 알림 — 본인에게
  await supabaseAdmin.from("notifications").insert({
    member_id: auth.member.id,
    type: "group_left",
    title: "그룹에서 탈퇴했습니다",
    body: null,
  });

  // 메인 뷰어에게도 알림
  if (group?.main_viewer_id) {
    await supabaseAdmin.from("notifications").insert({
      member_id: group.main_viewer_id,
      type: "group_left",
      title: "멤버가 그룹을 탈퇴했습니다",
      body: `${auth.member.name}님이 그룹을 탈퇴했습니다.`,
    });
  }

  return NextResponse.json({ success: true });
}
