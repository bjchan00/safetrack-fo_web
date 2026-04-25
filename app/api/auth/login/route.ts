import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/lib/supabase-server";
import { normalizePhone } from "@/lib/validation";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { phone, password } = body;

  if (!phone || !password) {
    return NextResponse.json(
      { success: false, message: "전화번호와 비밀번호를 입력해주세요." },
      { status: 400 }
    );
  }

  const normalized = normalizePhone(phone);

  const { data: member } = await supabaseAdmin
    .from("members")
    .select("id, member_number, name, phone, member_type, status, password_hash")
    .eq("phone", normalized)
    .single();

  if (!member) {
    return NextResponse.json(
      { success: false, message: "전화번호 또는 비밀번호가 올바르지 않습니다." },
      { status: 401 }
    );
  }

  if (member.status === "withdrawn") {
    return NextResponse.json(
      { success: false, message: "탈퇴한 회원입니다." },
      { status: 401 }
    );
  }

  if (member.status === "inactive") {
    return NextResponse.json(
      { success: false, message: "비활성화된 계정입니다. 고객센터에 문의해주세요." },
      { status: 401 }
    );
  }

  const passwordMatch = await bcrypt.compare(password, member.password_hash);
  if (!passwordMatch) {
    return NextResponse.json(
      { success: false, message: "전화번호 또는 비밀번호가 올바르지 않습니다." },
      { status: 401 }
    );
  }

  const { password_hash: _, ...memberData } = member;
  const sessionValue = Buffer.from(JSON.stringify({ id: member.id })).toString("base64");

  const response = NextResponse.json({ success: true, member: memberData });

  response.cookies.set("fo_session", sessionValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });

  return response;
}
