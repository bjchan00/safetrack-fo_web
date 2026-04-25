"use client";

import { useState, useEffect, useCallback } from "react";
import { Users, Link2, Copy, RefreshCw, LogOut, Trash2, CheckCircle, Loader2, UserPlus } from "lucide-react";
import { showToast } from "@/components/ui/Toast";

interface GroupMember {
  groupId: string;
  memberId: string;
  name: string;
  phone: string;
  member_type: string;
  deviceName: string | null;
  joinedAt: string;
}

interface MainViewerData {
  role: "main_viewer";
  inviteCode: string | null;
  members: GroupMember[];
}

interface SubData {
  role: "sub_viewer" | "location";
  group: {
    groupId: string;
    joinedAt: string;
    mainViewer: { id: string; name: string; phone: string } | null;
  } | null;
}

type GroupData = MainViewerData | SubData;

const MEMBER_TYPE_LABEL: Record<string, string> = {
  sub_viewer: "서브 뷰어",
  location: "위치 공유",
};

export default function GroupPage() {
  const [data, setData] = useState<GroupData | null>(null);
  const [loading, setLoading] = useState(true);
  const [codeLoading, setCodeLoading] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [joining, setJoining] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [codeCopied, setCodeCopied] = useState(false);

  const fetchGroup = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/mypage/group");
    if (res.ok) setData(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { fetchGroup(); }, [fetchGroup]);

  const handleGenerateCode = async () => {
    setCodeLoading(true);
    const res = await fetch("/api/mypage/group/generate-code", { method: "POST" });
    const json = await res.json();
    if (res.ok) {
      showToast("초대 코드가 생성되었습니다.", "success");
      setData((prev) => prev && prev.role === "main_viewer" ? { ...prev, inviteCode: json.inviteCode } : prev);
    } else {
      showToast(json.error || "오류가 발생했습니다.", "error");
    }
    setCodeLoading(false);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    });
  };

  const handleJoin = async () => {
    if (joinCode.trim().length !== 6) { showToast("6자리 초대 코드를 입력해주세요.", "error"); return; }
    setJoining(true);
    const res = await fetch("/api/mypage/group/join", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: joinCode.trim() }),
    });
    const json = await res.json();
    if (res.ok) {
      showToast(`${json.mainViewer.name}님의 그룹에 참여했습니다.`, "success");
      setJoinCode("");
      fetchGroup();
    } else {
      showToast(json.error || "오류가 발생했습니다.", "error");
    }
    setJoining(false);
  };

  const handleLeave = async () => {
    if (!confirm("그룹을 탈퇴하시겠습니까?")) return;
    setLeaving(true);
    const res = await fetch("/api/mypage/group/leave", { method: "DELETE" });
    if (res.ok) { showToast("그룹을 탈퇴했습니다.", "success"); fetchGroup(); }
    else { showToast("오류가 발생했습니다.", "error"); }
    setLeaving(false);
  };

  const handleRemoveMember = async (groupId: string, memberName: string) => {
    if (!confirm(`${memberName}님을 그룹에서 제거하시겠습니까?`)) return;
    setRemovingId(groupId);
    const res = await fetch(`/api/mypage/group/remove-member?groupId=${groupId}`, { method: "DELETE" });
    if (res.ok) {
      showToast("멤버를 제거했습니다.", "success");
      setData((prev) =>
        prev?.role === "main_viewer"
          ? { ...prev, members: prev.members.filter((m) => m.groupId !== groupId) }
          : prev
      );
    } else {
      showToast("오류가 발생했습니다.", "error");
    }
    setRemovingId(null);
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
      </div>
    );
  }

  // ── 메인 뷰어 ─────────────────────────────────────────────────
  if (data?.role === "main_viewer") {
    const { inviteCode, members } = data;
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">그룹 관리</h1>
          <p className="text-gray-500 mt-1">초대 코드를 공유해 가족을 그룹에 초대하세요.</p>
        </div>

        {/* 초대 코드 카드 */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Link2 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">초대 코드</h2>
              <p className="text-xs text-gray-500">멤버에게 이 코드를 공유하세요</p>
            </div>
          </div>

          {inviteCode ? (
            <div className="space-y-3">
              <div className="bg-blue-50 rounded-xl p-4 flex items-center justify-between gap-4">
                <span className="text-3xl font-bold tracking-[0.3em] text-blue-700 font-mono">{inviteCode}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleCopyCode(inviteCode)}
                    className="flex items-center gap-1.5 px-3 py-2 bg-white border border-blue-200 rounded-lg text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    {codeCopied ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    {codeCopied ? "복사됨" : "복사"}
                  </button>
                  <button
                    onClick={handleGenerateCode}
                    disabled={codeLoading}
                    className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${codeLoading ? "animate-spin" : ""}`} />
                    재생성
                  </button>
                </div>
              </div>
              <p className="text-xs text-gray-400">* 코드를 재생성하면 기존 코드는 더 이상 사용할 수 없습니다.</p>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-gray-500 mb-4">아직 초대 코드가 없습니다.</p>
              <button
                onClick={handleGenerateCode}
                disabled={codeLoading}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {codeLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                초대 코드 생성
              </button>
            </div>
          )}
        </div>

        {/* 그룹 멤버 */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">그룹 멤버</h2>
              <p className="text-xs text-gray-500">총 {members.length}명</p>
            </div>
          </div>

          {members.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Users className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">아직 그룹 멤버가 없습니다.</p>
              <p className="text-xs mt-1">초대 코드를 공유해 멤버를 추가하세요.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-50">
              {members.map((m) => (
                <li key={m.groupId} className="flex items-center gap-4 py-3">
                  <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold text-gray-600">{(m.name ?? "?").charAt(0)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm">{m.name ?? "—"}</p>
                    <p className="text-xs text-gray-400">{m.phone ?? ""} · {MEMBER_TYPE_LABEL[m.member_type] ?? m.member_type}</p>
                  </div>
                  <span className="text-xs text-gray-400 hidden sm:block">
                    {new Date(m.joinedAt).toLocaleDateString("ko-KR")} 참여
                  </span>
                  <button
                    onClick={() => handleRemoveMember(m.groupId, m.name)}
                    disabled={removingId === m.groupId}
                    className="p-2 text-gray-300 hover:text-red-500 transition-colors disabled:opacity-50"
                    title="멤버 제거"
                  >
                    {removingId === m.groupId ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  }

  // ── 서브 뷰어 / 위치 공유자 ───────────────────────────────────
  const subData = data as SubData | null;
  const group = subData?.group ?? null;

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">그룹 참여</h1>
        <p className="text-gray-500 mt-1">메인 뷰어의 초대 코드를 입력해 그룹에 참여하세요.</p>
      </div>

      {group ? (
        /* 이미 그룹에 참여 중 */
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">그룹 참여 중</h2>
              <p className="text-xs text-gray-500">{new Date(group.joinedAt).toLocaleDateString("ko-KR")} 참여</p>
            </div>
          </div>

          {group.mainViewer && (
            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <p className="text-xs text-gray-500 mb-1">메인 뷰어</p>
              <p className="font-semibold text-gray-900">{group.mainViewer.name}</p>
              <p className="text-sm text-gray-500">{group.mainViewer.phone}</p>
            </div>
          )}

          <button
            onClick={handleLeave}
            disabled={leaving}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50 disabled:opacity-50 transition-colors"
          >
            {leaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
            그룹 탈퇴
          </button>
        </div>
      ) : (
        /* 그룹 미참여 */
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Link2 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">초대 코드 입력</h2>
              <p className="text-xs text-gray-500">메인 뷰어에게 6자리 코드를 받아 입력하세요</p>
            </div>
          </div>

          <div className="space-y-3">
            <input
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6))}
              placeholder="초대 코드 6자리"
              className="form-input text-center text-xl tracking-[0.4em] font-mono font-bold uppercase"
              maxLength={6}
            />
            <button
              onClick={handleJoin}
              disabled={joining || joinCode.length !== 6}
              className="w-full py-2.5 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              {joining ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              그룹 참여
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
