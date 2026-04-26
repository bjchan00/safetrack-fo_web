import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/lib/supabase-server";
import { validatePassword, normalizePhone } from "@/lib/validation";

export async function POST(req: NextRequest) {
  const { phone, verify_token, newPassword } = await req.json();

  if (!phone)         return NextResponse.json({ error: "전화번호를 입력해주세요." }, { status: 400 });
  if (!verify_token)  return NextResponse.json({ error: "SMS 인증을 완료해주세요." }, { status: 400 });
  if (!newPassword || !validatePassword(newPassword))
    return NextResponse.json({ error: "비밀번호는 8자 이상 영문+숫자 조합으로 입력해주세요." }, { status: 400 });

  const normalized = normalizePhone(phone);

  // verify_token 유효성 확인
  const { data: verification } = await supabaseAdmin
    .from("sms_verifications")
    .select("id")
    .eq("phone", normalized)
    .eq("token", verify_token)
    .eq("verified", true)
    .single();

  if (!verification)
    return NextResponse.json({ error: "인증이 만료되었거나 유효하지 않습니다." }, { status: 400 });

  // 회원 조회
  const { data: member } = await supabaseAdmin
    .from("members")
    .select("id, status")
    .eq("phone", normalized)
    .single();

  if (!member || member.status === "withdrawn")
    return NextResponse.json({ error: "가입된 계정을 찾을 수 없습니다." }, { status: 404 });

  // 비밀번호 업데이트
  const password_hash = await bcrypt.hash(newPassword, 10);
  const { error } = await supabaseAdmin
    .from("members")
    .update({ password_hash })
    .eq("id", member.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // 사용된 인증 토큰 삭제
  await supabaseAdmin.from("sms_verifications").delete().eq("id", verification.id);

  return NextResponse.json({ success: true });
}
