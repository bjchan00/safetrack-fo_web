import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const MYPAGE_PATHS = ["/mypage"];
const AUTH_ONLY_PATHS = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api") || pathname.startsWith("/_next")) {
    return NextResponse.next();
  }

  const session = request.cookies.get("fo_session")?.value;
  const isMypagePath = MYPAGE_PATHS.some((p) => pathname.startsWith(p));

  // 비로그인 상태로 마이페이지 접근 → 로그인
  if (isMypagePath && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 로그인 상태로 로그인/회원가입 접근 → 마이페이지 대시보드
  if (session && AUTH_ONLY_PATHS.some((p) => pathname === p)) {
    return NextResponse.redirect(new URL("/mypage/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};
