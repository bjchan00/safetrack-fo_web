import { cookies } from "next/headers";
import { supabaseAdmin } from "./supabase-server";

export interface SessionMember {
  id: string;
  member_number: number;
  name: string;
  phone: string;
  member_type: "main_viewer" | "sub_viewer" | "location";
  status: string;
}

export async function getSession(): Promise<SessionMember | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("fo_session")?.value;
    if (!sessionCookie) return null;

    const { id } = JSON.parse(Buffer.from(sessionCookie, "base64").toString());
    if (!id) return null;

    const { data, error } = await supabaseAdmin
      .from("members")
      .select("id, member_number, name, phone, member_type, status")
      .eq("id", id)
      .eq("status", "active")
      .single();

    if (error || !data) return null;
    return data as SessionMember;
  } catch {
    return null;
  }
}

export function createSessionCookie(member: SessionMember): string {
  return Buffer.from(JSON.stringify({ id: member.id })).toString("base64");
}
