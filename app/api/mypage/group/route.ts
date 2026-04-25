import { NextResponse } from "next/server";
import { requireFOAuth } from "@/lib/fo-auth";
import { supabaseAdmin } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireFOAuth();
  if (!auth.member) return auth.error;
  const { member } = auth;

  if (member.member_type === "main_viewer") {
    // 내 그룹 멤버 목록
    const { data: groupRows } = await supabaseAdmin
      .from("member_groups")
      .select("id, member_id, device_name, created_at")
      .eq("main_viewer_id", member.id)
      .order("created_at", { ascending: true });

    const memberIds = (groupRows ?? []).map((r) => r.member_id).filter(Boolean);
    let membersMap: Record<string, { name: string; phone: string; member_type: string }> = {};

    if (memberIds.length > 0) {
      const { data: memberRows } = await supabaseAdmin
        .from("members")
        .select("id, name, phone, member_type")
        .in("id", memberIds);
      for (const m of memberRows ?? []) membersMap[m.id] = m;
    }

    const members = (groupRows ?? []).map((r) => ({
      groupId: r.id,
      memberId: r.member_id,
      deviceName: r.device_name,
      joinedAt: r.created_at,
      ...(membersMap[r.member_id] ?? {}),
    }));

    return NextResponse.json({ role: "main_viewer", inviteCode: member.invite_code, members });
  } else {
    // 내가 속한 그룹 확인
    const { data: groupRow } = await supabaseAdmin
      .from("member_groups")
      .select("id, main_viewer_id, created_at")
      .eq("member_id", member.id)
      .single();

    if (!groupRow) return NextResponse.json({ role: member.member_type, group: null });

    const { data: mainViewer } = await supabaseAdmin
      .from("members")
      .select("id, name, phone")
      .eq("id", groupRow.main_viewer_id)
      .single();

    return NextResponse.json({ role: member.member_type, group: { groupId: groupRow.id, joinedAt: groupRow.created_at, mainViewer } });
  }
}
