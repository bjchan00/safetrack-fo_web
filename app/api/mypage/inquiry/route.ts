import { NextRequest, NextResponse } from "next/server";
import { requireFOAuth, foError } from "@/lib/fo-auth";
import { supabaseAdmin } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireFOAuth();
  if (!auth.member) return auth.error;

  const { data, error } = await supabaseAdmin
    .from("inquiries")
    .select("id, title, content, category, status, answer, answered_at, created_at")
    .eq("member_id", auth.member.id)
    .order("created_at", { ascending: false });

  if (error) return foError(error.message, 500);
  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  const auth = await requireFOAuth();
  if (!auth.member) return auth.error;

  const { title, content, category } = await req.json();
  if (!title?.trim()) return foError("제목을 입력해주세요.");
  if (!content?.trim()) return foError("내용을 입력해주세요.");

  const { data, error } = await supabaseAdmin
    .from("inquiries")
    .insert({
      member_id: auth.member.id,
      title: title.trim(),
      content: content.trim(),
      category: category || "general",
      status: "pending",
    })
    .select("id, title, category, status, created_at")
    .single();

  if (error) return foError(error.message, 500);
  return NextResponse.json({ success: true, inquiry: data }, { status: 201 });
}
