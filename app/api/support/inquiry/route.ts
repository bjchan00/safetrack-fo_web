import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  const { name, contact, category, title, content } = await req.json();

  if (!name?.trim())    return NextResponse.json({ error: "이름을 입력해주세요." }, { status: 400 });
  if (!contact?.trim()) return NextResponse.json({ error: "연락처를 입력해주세요." }, { status: 400 });
  if (!title?.trim())   return NextResponse.json({ error: "제목을 입력해주세요." }, { status: 400 });
  if (!content?.trim()) return NextResponse.json({ error: "내용을 입력해주세요." }, { status: 400 });

  const fullContent = `[비회원 문의]\n이름: ${name.trim()}\n연락처: ${contact.trim()}\n\n${content.trim()}`;

  const { error } = await supabaseAdmin
    .from("inquiries")
    .insert({
      member_id: null,
      title: title.trim(),
      content: fullContent,
      category: category || "general",
      status: "pending",
    });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true }, { status: 201 });
}
