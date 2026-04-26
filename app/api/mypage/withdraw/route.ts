import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { requireFOAuth, foError } from "@/lib/fo-auth";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  const auth = await requireFOAuth();
  if (!auth.member) return auth.error;

  const { password } = await req.json();
  if (!password) return foError("비밀번호를 입력해주세요.");

  const { data: memberWithPw } = await supabaseAdmin
    .from("members")
    .select("password_hash")
    .eq("id", auth.member.id)
    .single();

  if (!memberWithPw?.password_hash) return foError("계정 정보를 찾을 수 없습니다.", 500);

  const isValid = await bcrypt.compare(password, memberWithPw.password_hash);
  if (!isValid) return foError("비밀번호가 올바르지 않습니다.");

  const { error } = await supabaseAdmin
    .from("members")
    .update({ status: "withdrawn" })
    .eq("id", auth.member.id);

  if (error) return foError(error.message, 500);

  const response = NextResponse.json({ success: true });
  response.cookies.set("fo_session", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });
  return response;
}
