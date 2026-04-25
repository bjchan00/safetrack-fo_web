import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import { normalizePhone } from "@/lib/validation";

function generateToken(): string {
  return `vt_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { phone, code } = body;

  if (!phone || !code) {
    return NextResponse.json(
      { success: false, code: "INVALID_INPUT", message: "전화번호와 인증번호를 입력해주세요." },
      { status: 400 }
    );
  }

  const normalized = normalizePhone(phone);

  // 유효한 인증 레코드 조회 (만료 전, 미인증)
  const { data: verification } = await supabaseAdmin
    .from("sms_verifications")
    .select("*")
    .eq("phone", normalized)
    .eq("verified", false)
    .gt("expires_at", new Date().toISOString())
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (!verification) {
    return NextResponse.json(
      { success: false, code: "EXPIRED_CODE", message: "인증번호가 만료되었습니다. 다시 발송해주세요." },
      { status: 400 }
    );
  }

  if (verification.attempts >= 3) {
    return NextResponse.json(
      { success: false, code: "MAX_ATTEMPTS", message: "인증 횟수를 초과했습니다. 인증번호를 다시 발송해주세요.", remaining_attempts: 0 },
      { status: 400 }
    );
  }

  if (verification.code !== code) {
    // 실패 횟수 증가
    await supabaseAdmin
      .from("sms_verifications")
      .update({ attempts: verification.attempts + 1 })
      .eq("id", verification.id);

    return NextResponse.json(
      {
        success: false,
        code: "WRONG_CODE",
        message: "인증번호가 일치하지 않습니다.",
        remaining_attempts: 2 - verification.attempts,
      },
      { status: 400 }
    );
  }

  const token = generateToken();

  // 인증 성공 처리
  await supabaseAdmin
    .from("sms_verifications")
    .update({ verified: true, token })
    .eq("id", verification.id);

  return NextResponse.json({ success: true, token });
}
