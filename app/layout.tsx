import type { Metadata } from "next";
import "./globals.css";
import { getSession } from "@/lib/auth";
import { NavHeader } from "@/components/layout/NavHeader";
import { ToastContainer } from "@/components/ui/Toast";

export const metadata: Metadata = {
  title: "SafeTrack — 가족 위치 공유 서비스",
  description: "가족의 안전을 실시간으로 지도에서 확인하세요.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const member = await getSession();

  return (
    <html lang="ko">
      <body>
        <ToastContainer />
        <NavHeader member={member} />
        {children}
      </body>
    </html>
  );
}
