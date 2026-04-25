import { NextRequest, NextResponse } from "next/server";
import { requireFOAuth, foError } from "@/lib/fo-auth";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function PATCH(req: NextRequest) {
  const auth = await requireFOAuth();
  if (!auth.member) return auth.error;

  const { name, email } = await req.json();

  if (!name || name.trim().length < 2) return foError("이름은 2자 이상 입력해주세요.");

  const updateData: Record<string, string> = {
    name: name.trim(),
    updated_at: new Date().toISOString(),
  };
  if (email !== undefined) updateData.email = email.trim() || "";

  // 이메일 중복 확인
  if (email && email.trim()) {
    const { data: existing } = await supabaseAdmin
      .from("members")
      .select("id")
      .eq("email", email.trim())
      .neq("id", auth.member.id)
      .single();
    if (existing) return foError("이미 사용 중인 이메일입니다.");
  }

  const { data, error } = await supabaseAdmin
    .from("members")
    .update(updateData)
    .eq("id", auth.member.id)
    .select("id, name, email")
    .single();

  if (error) return foError(error.message, 500);
  return NextResponse.json({ success: true, member: data });
}
