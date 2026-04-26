"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { MapPin, ChevronDown, Menu, X, Bell } from "lucide-react";
import type { SessionMember } from "@/lib/auth";

interface NavHeaderProps {
  member: SessionMember | null;
}

const SUPPORT_MENU = [
  { href: "/support/notices",  label: "공지사항" },
  { href: "/support/events",   label: "이벤트"   },
  { href: "/support/qa",       label: "Q&A"      },
  { href: "/support/inquiry",  label: "1:1문의"  },
];

const MYPAGE_MENU = [
  { href: "/mypage/dashboard",     label: "대시보드" },
  { href: "/mypage/group",         label: "그룹관리" },
  { href: "/mypage/subscription",  label: "구독관리" },
  { href: "/mypage/notifications", label: "알림"     },
  { href: "/mypage/inquiry",       label: "1:1문의"  },
  { href: "/mypage/account",       label: "계정"     },
];

function useClickOutside(ref: React.RefObject<HTMLElement | null>, cb: () => void) {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) cb();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [ref, cb]);
}

export function NavHeader({ member }: NavHeaderProps) {
  const router   = useRouter();
  const pathname = usePathname();

  const [supportOpen,      setSupportOpen]      = useState(false);
  const [mypageOpen,       setMypageOpen]        = useState(false);
  const [mobileOpen,       setMobileOpen]        = useState(false);
  const [mobileSupportOpen,setMobileSupportOpen] = useState(false);
  const [mobileMypageOpen, setMobileMypageOpen]  = useState(false);
  const [unreadCount,      setUnreadCount]       = useState(0);

  const supportRef = useRef<HTMLDivElement>(null);
  const mypageRef  = useRef<HTMLDivElement>(null);

  useClickOutside(supportRef, useCallback(() => setSupportOpen(false), []));
  useClickOutside(mypageRef,  useCallback(() => setMypageOpen(false),  []));

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  // 읽지 않은 알림 수 조회
  useEffect(() => {
    if (!member) return;
    const fetchUnread = async () => {
      const res = await fetch("/api/mypage/notifications");
      if (!res.ok) return;
      const data: { is_read: boolean }[] = await res.json();
      setUnreadCount(data.filter((n) => !n.is_read).length);
    };
    fetchUnread();
  }, [member, pathname]);

  const isActive       = (href: string) => pathname === href;
  const isParentActive = (items: { href: string }[]) => items.some((i) => pathname.startsWith(i.href));

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  const navLinkClass = (active: boolean) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      active
        ? "text-blue-600 bg-blue-50"
        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
    }`;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* 로고 */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">SafeTrack</span>
          </Link>

          {/* 데스크톱 네비게이션 */}
          <nav className="hidden md:flex items-center gap-0.5">
            <Link href="/"       className={navLinkClass(isActive("/"))}>홈</Link>
            <Link href="/about"  className={navLinkClass(isActive("/about"))}>서비스 소개</Link>
            <Link href="/pricing"className={navLinkClass(isActive("/pricing"))}>요금제</Link>

            {/* 고객지원 드롭다운 */}
            <div className="relative" ref={supportRef}>
              <button
                onClick={() => setSupportOpen((v) => !v)}
                className={`flex items-center gap-1 ${navLinkClass(isParentActive(SUPPORT_MENU))}`}
              >
                고객지원
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${supportOpen ? "rotate-180" : ""}`} />
              </button>
              {supportOpen && (
                <div className="absolute top-full left-0 mt-1 w-36 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                  {SUPPORT_MENU.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSupportOpen(false)}
                      className={`block px-4 py-2.5 text-sm transition-colors ${
                        isActive(item.href)
                          ? "text-blue-600 bg-blue-50 font-medium"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* 데스크톱 인증 영역 */}
          <div className="hidden md:flex items-center gap-1.5">
            {member ? (
              <>
                {/* 알림 벨 */}
                <Link
                  href="/mypage/notifications"
                  className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="알림"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 min-w-[16px] h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-0.5">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </Link>

                {/* 마이페이지 드롭다운 */}
                <div className="relative" ref={mypageRef}>
                  <button
                    onClick={() => setMypageOpen((v) => !v)}
                    className={`flex items-center gap-1.5 ${navLinkClass(isParentActive(MYPAGE_MENU))}`}
                  >
                    <span className="max-w-[80px] truncate">{member.name}님</span>
                    <ChevronDown className={`w-3.5 h-3.5 flex-shrink-0 transition-transform ${mypageOpen ? "rotate-180" : ""}`} />
                  </button>
                  {mypageOpen && (
                    <div className="absolute top-full right-0 mt-1 w-44 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                      <p className="px-4 py-2 text-xs text-gray-400 font-medium border-b border-gray-100">
                        마이페이지
                      </p>
                      {MYPAGE_MENU.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMypageOpen(false)}
                          className={`flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${
                            isActive(item.href)
                              ? "text-blue-600 bg-blue-50 font-medium"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {item.label}
                          {item.href === "/mypage/notifications" && unreadCount > 0 && (
                            <span className="min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                              {unreadCount > 9 ? "9+" : unreadCount}
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={handleLogout}
                  className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link href="/login"    className={navLinkClass(isActive("/login"))}>로그인</Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  회원가입
                </Link>
              </>
            )}
          </div>

          {/* 모바일 햄버거 */}
          <button
            className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors relative"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="메뉴"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            {!mobileOpen && unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </button>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white shadow-lg">
          <div className="px-4 py-3 space-y-1">
            <Link href="/"        className={`block ${navLinkClass(isActive("/"))}`}>홈</Link>
            <Link href="/about"   className={`block ${navLinkClass(isActive("/about"))}`}>서비스 소개</Link>
            <Link href="/pricing" className={`block ${navLinkClass(isActive("/pricing"))}`}>요금제</Link>

            {/* 고객지원 */}
            <div>
              <button
                onClick={() => setMobileSupportOpen((v) => !v)}
                className={`w-full flex items-center justify-between ${navLinkClass(isParentActive(SUPPORT_MENU))}`}
              >
                <span>고객지원</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${mobileSupportOpen ? "rotate-180" : ""}`} />
              </button>
              {mobileSupportOpen && (
                <div className="ml-4 mt-1 space-y-1">
                  {SUPPORT_MENU.map((item) => (
                    <Link key={item.href} href={item.href}
                      className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                        isActive(item.href) ? "text-blue-600 bg-blue-50 font-medium" : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* 마이페이지 */}
            {member && (
              <div>
                <button
                  onClick={() => setMobileMypageOpen((v) => !v)}
                  className={`w-full flex items-center justify-between ${navLinkClass(isParentActive(MYPAGE_MENU))}`}
                >
                  <span>마이페이지</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${mobileMypageOpen ? "rotate-180" : ""}`} />
                </button>
                {mobileMypageOpen && (
                  <div className="ml-4 mt-1 space-y-1">
                    {MYPAGE_MENU.map((item) => (
                      <Link key={item.href} href={item.href}
                        className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                          isActive(item.href) ? "text-blue-600 bg-blue-50 font-medium" : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {item.label}
                        {item.href === "/mypage/notifications" && unreadCount > 0 && (
                          <span className="min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                            {unreadCount > 9 ? "9+" : unreadCount}
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="pt-2 border-t border-gray-100 space-y-1">
              {member ? (
                <button onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  로그아웃
                </button>
              ) : (
                <>
                  <Link href="/login"    className={`block ${navLinkClass(isActive("/login"))}`}>로그인</Link>
                  <Link href="/register"
                    className="block px-3 py-2 text-sm font-semibold text-center bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    회원가입
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
