import { NextResponse } from "next/server";
import { requireFOAuth } from "@/lib/fo-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireFOAuth();
  if (!auth.member) return auth.error;
  return NextResponse.json(auth.member);
}
