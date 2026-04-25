import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import { validatePhone, normalizePhone } from "@/lib/validation";

// 개발용: 실제 SMS 발송 대신 응답에 코드 포함
// Phase 3에서 SMS 서비스(CoolSMS 등)로 교체 예정
function generateCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { phone } = body;

  if (!phone || !validatePhone(phone)) {
    return NextResponse.json(
      { success: false, code: "INVALID_PHONE_FORMAT", message: "올바른 전화번호 형식으로 입력해주세요." },
      { status: 400 }
    );
  }

  const normalized = normalizePhone(phone);
  const code = generateCode();

  // 기존 미사용 인증 레코드 삭제 (동일 번호)
  await supabaseAdmin
    .from("sms_verifications")
    .delete()
    .eq("phone", normalized)
    .eq("verified", false);

  const { error } = await supabaseAdmin.from("sms_verifications").insert({
    phone: normalized,
    code,
    expires_at: new Date(Date.now() + 3 * 60 * 1000).toISOString(),
  });

  if (error) {
    return NextResponse.json(
      { success: false, code: "SERVER_ERROR", message: "인증번호 발송에 실패했습니다." },
      { status: 500 }
    );
  }

  // 개발용: 응답에 코드 포함 (Phase 3에서 제거)
  return NextResponse.json({
    success: true,
    expires_in: 180,
    dev_code: code, // 브라우저 토스트로 표시됨
  });
}
