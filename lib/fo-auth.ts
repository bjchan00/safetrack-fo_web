import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "./supabase-server";

export interface MemberProfile {
  id: string;
  member_number: number;
  name: string;
  phone: string;
  email: string | null;
  member_type: "main_viewer" | "sub_viewer" | "location";
  status: string;
  gender: string | null;
  birth_date: string | null;
  address: string | null;
  invite_code: string | null;
}

export async function requireFOAuth(): Promise<
  { member: MemberProfile; error: null } | { member: null; error: NextResponse }
> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("fo_session")?.value;
    if (!sessionCookie) throw new Error();
    const { id } = JSON.parse(Buffer.from(sessionCookie, "base64").toString());
    if (!id) throw new Error();
    const { data, error } = await supabaseAdmin
      .from("members")
      .select("id, member_number, name, phone, email, member_type, status, gender, birth_date, address, invite_code")
      .eq("id", id)
      .eq("status", "active")
      .single();
    if (error || !data) throw new Error();
    return { member: data as MemberProfile, error: null };
  } catch {
    return { member: null, error: NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 }) };
  }
}

export function foError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}
