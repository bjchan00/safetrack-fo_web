import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/lib/supabase-server";
import { validatePhone, validatePassword, validateName, normalizePhone } from "@/lib/validation";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const {
    phone, password, name, member_type,
    email, gender, birth_date,
    verify_token,
    terms_agreed, privacy_agreed, location_agreed, marketing_agreed,
  } = body;

  // 필수 입력 검증
  if (!phone || !validatePhone(phone)) {
    return NextResponse.json({ success: false, code: "INVALID_PHONE_FORMAT", message: "올바른 전화번호 형식으로 입력해주세요." }, { status: 400 });
  }
  if (!password || !validatePassword(password)) {
    return NextResponse.json({ success: false, code: "WEAK_PASSWORD", message: "비밀번호는 8자 이상 영문+숫자 조합으로 입력해주세요." }, { status: 400 });
  }
  if (!name || !validateName(name)) {
    return NextResponse.json({ success: false, code: "INVALID_NAME", message: "이름을 2자 이상 입력해주세요." }, { status: 400 });
  }
  if (!["main_viewer", "sub_viewer", "location"].includes(member_type)) {
    return NextResponse.json({ success: false, code: "INVALID_MEMBER_TYPE", message: "회원 유형을 선택해주세요." }, { status: 400 });
  }
  if (!terms_agreed || !privacy_agreed || !location_agreed) {
    return NextResponse.json({ success: false, code: "TERMS_NOT_AGREED", message: "필수 약관에 동의해주세요." }, { status: 400 });
  }
  if (!verify_token) {
    return NextResponse.json({ success: false, code: "INVALID_VERIFY_TOKEN", message: "SMS 인증을 완료해주세요." }, { status: 400 });
  }

  const normalized = normalizePhone(phone);

  // SMS 인증 토큰 검증
  const { data: verification } = await supabaseAdmin
    .from("sms_verifications")
    .select("id")
    .eq("phone", normalized)
    .eq("token", verify_token)
    .eq("verified", true)
    .single();

  if (!verification) {
    return NextResponse.json({ success: false, code: "INVALID_VERIFY_TOKEN", message: "SMS 인증이 만료되었거나 유효하지 않습니다." }, { status: 400 });
  }

  // 전화번호 중복 확인
  const { data: existing } = await supabaseAdmin
    .from("members")
    .select("id")
    .eq("phone", normalized)
    .single();

  if (existing) {
    return NextResponse.json({ success: false, code: "PHONE_DUPLICATED", message: "이미 사용 중인 전화번호입니다." }, { status: 409 });
  }

  // 비밀번호 해시
  const password_hash = await bcrypt.hash(password, 10);

  // 회원 생성
  const insertData: Record<string, unknown> = {
    phone: normalized,
    password_hash,
    name: name.trim(),
    member_type,
    status: "active",
    registration_channel: "web",
  };
  if (email) insertData.email = email.trim();
  if (gender) insertData.gender = gender;
  if (birth_date) insertData.birth_date = birth_date;

  const { data: newMember, error: insertError } = await supabaseAdmin
    .from("members")
    .insert(insertData)
    .select("id, member_number, name, phone, member_type, status")
    .single();

  if (insertError || !newMember) {
    if (insertError?.code === "23505") {
      return NextResponse.json({ success: false, code: "PHONE_DUPLICATED", message: "이미 사용 중인 전화번호입니다." }, { status: 409 });
    }
    return NextResponse.json({ success: false, code: "SERVER_ERROR", message: "회원가입에 실패했습니다." }, { status: 500 });
  }

  // 약관 동의 이력 저장
  const ipAddress = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "";
  const userAgent = request.headers.get("user-agent") || "";

  await supabaseAdmin.from("member_terms_agreements").insert({
    member_id: newMember.id,
    terms_agreed,
    privacy_agreed,
    location_agreed,
    marketing_agreed: marketing_agreed ?? false,
    ip_address: ipAddress,
    user_agent: userAgent,
  });

  // 사용된 인증 토큰 삭제
  await supabaseAdmin.from("sms_verifications").delete().eq("id", verification.id);

  // 세션 쿠키 생성
  const sessionValue = Buffer.from(JSON.stringify({ id: newMember.id })).toString("base64");
  const response = NextResponse.json({ success: true, member: newMember }, { status: 201 });

  response.cookies.set("fo_session", sessionValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30일
    path: "/",
  });

  return response;
}
