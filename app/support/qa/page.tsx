import { supabaseAdmin } from "@/lib/supabase-server";
import { ChevronDown } from "lucide-react";

export const dynamic = "force-dynamic";

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export default async function SupportQAPage() {
  const { data: faqs } = await supabaseAdmin
    .from("faqs")
    .select("id, question, answer")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <p className="text-sm text-blue-600 font-semibold mb-1">고객지원</p>
          <h1 className="text-2xl font-bold text-gray-900">Q&A</h1>
          <p className="text-gray-500 mt-1">자주 묻는 질문을 확인해보세요.</p>
        </div>

        {!faqs || faqs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <p className="text-gray-400 text-sm">등록된 FAQ가 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {(faqs as FAQ[]).map((item) => (
              <details
                key={item.id}
                className="group bg-white rounded-2xl border border-gray-200 overflow-hidden"
              >
                <summary className="flex items-center justify-between p-5 cursor-pointer list-none select-none hover:bg-gray-50 transition-colors">
                  <span className="font-semibold text-gray-900 pr-4">{item.question}</span>
                  <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0 transition-transform group-open:rotate-180" />
                </summary>
                <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-4 whitespace-pre-wrap">
                  {item.answer}
                </div>
              </details>
            ))}
          </div>
        )}

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-5 text-center">
          <p className="text-sm text-gray-700 mb-3">원하시는 답변을 찾지 못하셨나요?</p>
          <a
            href="/support/inquiry"
            className="inline-block px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors"
          >
            1:1 문의하기
          </a>
        </div>
      </div>
    </div>
  );
}
