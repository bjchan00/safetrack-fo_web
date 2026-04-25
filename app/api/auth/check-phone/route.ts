import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import { validatePhone, normalizePhone } from "@/lib/validation";

export async function GET(request: NextRequest) {
  const phone = request.nextUrl.searchParams.get("phone");

  if (!phone || !validatePhone(phone)) {
    return NextResponse.json(
      { success: false, code: "INVALID_PHONE_FORMAT", message: "올바른 전화번호 형식으로 입력해주세요." },
      { status: 400 }
    );
  }

  const normalized = normalizePhone(phone);
  const { data } = await supabaseAdmin
    .from("members")
    .select("id")
    .eq("phone", normalized)
    .single();

  if (data) {
    return NextResponse.json({ available: false, message: "이미 사용 중인 전화번호입니다." });
  }

  return NextResponse.json({ available: true });
}
