import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export default async function MypageLayout({ children }: { children: React.ReactNode }) {
  const member = await getSession();
  if (!member) redirect("/login");

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {children}
      </div>
    </main>
  );
}
