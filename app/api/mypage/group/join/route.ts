import { NextRequest, NextResponse } from "next/server";
import { requireFOAuth, foError } from "@/lib/fo-auth";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  const auth = await requireFOAuth();
  if (!auth.member) return auth.error;
  if (auth.member.member_type === "main_viewer") return foError("메인 뷰어는 그룹에 참여할 수 없습니다.", 403);

  const { code } = await req.json();
  if (!code || code.trim().length !== 6) return foError("6자리 초대 코드를 입력해주세요.");

  const { data: existing } = await supabaseAdmin
    .from("member_groups")
    .select("id")
    .eq("member_id", auth.member.id)
    .single();
  if (existing) return foError("이미 그룹에 참여 중입니다. 먼저 현재 그룹을 탈퇴해주세요.");

  const { data: mainViewer } = await supabaseAdmin
    .from("members")
    .select("id, name, member_type")
    .eq("invite_code", code.trim().toUpperCase())
    .eq("member_type", "main_viewer")
    .single();
  if (!mainViewer) return foError("유효하지 않은 초대 코드입니다.");
  if (mainViewer.id === auth.member.id) return foError("자신의 그룹에 참여할 수 없습니다.");

  const { error } = await supabaseAdmin.from("member_groups").insert({
    main_viewer_id: mainViewer.id,
    member_id: auth.member.id,
  });
  if (error) return foError(error.message, 500);

  // 그룹 참여 알림 — 참여한 본인에게
  await supabaseAdmin.from("notifications").insert({
    member_id: auth.member.id,
    type: "group_joined",
    title: "그룹에 참여했습니다",
    body: `${mainViewer.name}님의 그룹에 참여했습니다.`,
  });

  // 메인 뷰어에게도 알림
  await supabaseAdmin.from("notifications").insert({
    member_id: mainViewer.id,
    type: "group_joined",
    title: "새 멤버가 그룹에 참여했습니다",
    body: `${auth.member.name}님이 그룹에 참여했습니다.`,
  });

  return NextResponse.json({ success: true, mainViewer: { id: mainViewer.id, name: mainViewer.name } });
}
