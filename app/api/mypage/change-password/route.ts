import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { requireFOAuth, foError } from "@/lib/fo-auth";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  const auth = await requireFOAuth();
  if (!auth.member) return auth.error;

  const { currentPassword, newPassword } = await req.json();
  if (!currentPassword || !newPassword) return foError("모든 항목을 입력해주세요.");
  if (newPassword.length < 8 || !/(?=.*[a-zA-Z])(?=.*\d)/.test(newPassword))
    return foError("새 비밀번호는 8자 이상 영문+숫자 조합이어야 합니다.");

  const { data: memberWithPw } = await supabaseAdmin
    .from("members")
    .select("password_hash")
    .eq("id", auth.member.id)
    .single();

  if (!memberWithPw?.password_hash) return foError("비밀번호 정보를 찾을 수 없습니다.", 500);

  const isMatch = await bcrypt.compare(currentPassword, memberWithPw.password_hash);
  if (!isMatch) return foError("현재 비밀번호가 올바르지 않습니다.");

  const hash = await bcrypt.hash(newPassword, 10);
  const { error } = await supabaseAdmin
    .from("members")
    .update({ password_hash: hash, updated_at: new Date().toISOString() })
    .eq("id", auth.member.id);

  if (error) return foError(error.message, 500);
  return NextResponse.json({ success: true });
}
