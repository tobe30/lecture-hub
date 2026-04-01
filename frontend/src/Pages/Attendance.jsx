import { useState } from "react";
import { Download, Search, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getLecturerAttendance } from "../lib/api";

export default function Attendance() {
  const [search, setSearch] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["attendance"],
    queryFn: getLecturerAttendance,
  });

  const sessions = data?.sessions || [];

  const filtered = sessions.filter(
    (s) =>
      s.classTitle?.toLowerCase().includes(search.toLowerCase()) ||
      s.code?.toLowerCase().includes(search.toLowerCase())
  );

  const totalSessions = sessions.length;

  const avgAttendance =
    sessions.length > 0
      ? Math.round(
          sessions.reduce((sum, s) => sum + (s.rate || 0), 0) / sessions.length
        )
      : 0;

  const now = new Date();
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(now.getDate() - 7);

  const thisWeekCount = sessions.filter((session) => {
    const sessionDate = new Date(session.date);
    return sessionDate >= oneWeekAgo && sessionDate <= now;
  }).length;

  if (isLoading) {
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin mx-auto mb-3 text-[#3b82f6]" />
          <p className="text-sm text-slate-500">Loading attendance...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[70vh] flex items-center justify-center text-red-500">
        Failed to load attendance
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <div className="mb-6">
        <h1 className="text-[24px] font-bold text-[#111827]">Attendance</h1>
        <p className="mt-1 text-[15px] text-[#64748b]">
          Track attendance across all your sessions
        </p>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[#e5e7eb] bg-white p-4 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
          <p className="text-[13px] font-medium text-[#64748b]">Total Sessions</p>
          <p className="mt-1 text-[22px] font-bold text-[#111827]">
            {totalSessions}
          </p>
        </div>

        <div className="rounded-2xl border border-[#e5e7eb] bg-white p-4 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
          <p className="text-[13px] font-medium text-[#64748b]">
            Avg. Attendance
          </p>
          <p className="mt-1 text-[22px] font-bold text-[#111827]">
            {avgAttendance}%
          </p>
        </div>

        <div className="rounded-2xl border border-[#e5e7eb] bg-white p-4 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
          <p className="text-[13px] font-medium text-[#64748b]">This Week</p>
          <p className="mt-1 text-[22px] font-bold text-[#111827]">
            {thisWeekCount} sessions
          </p>
        </div>
      </div>

      <div className="mb-4 flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748b]" />
          <input
            type="text"
            placeholder="Search by class..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 w-full rounded-[12px] border border-[#dbe2ea] bg-white pl-10 pr-4 text-[14px] text-[#111827] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/20"
          />
        </div>

        <button className="inline-flex items-center gap-2 rounded-[12px] border border-[#e5e7eb] bg-white px-4 py-2.5 text-[14px] font-medium text-[#111827] hover:bg-[#f8fafc] transition-colors">
          <Download className="h-4 w-4" />
          Export
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
        <table className="w-full text-[14px]">
          <thead>
            <tr className="border-b border-[#e5e7eb] bg-[#f8fafc]">
              <th className="px-4 py-3 text-left font-medium text-[#64748b]">
                Class
              </th>
              <th className="px-4 py-3 text-left font-medium text-[#64748b]">
                Date
              </th>
              <th className="px-4 py-3 text-left font-medium text-[#64748b]">
                Time
              </th>
              <th className="px-4 py-3 text-center font-medium text-[#64748b]">
                Present
              </th>
              <th className="px-4 py-3 text-center font-medium text-[#64748b]">
                Absent
              </th>
              <th className="px-4 py-3 text-center font-medium text-[#64748b]">
                Rate
              </th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((s) => (
              <tr
                key={s._id}
                className="border-b border-[#f1f5f9] last:border-0 hover:bg-[#f8fafc] transition-colors"
              >
                <td className="px-4 py-3">
                  <p className="font-medium text-[#111827]">{s.classTitle}</p>
                  <p className="text-[12px] text-[#64748b]">{s.code}</p>
                </td>

                <td className="px-4 py-3 text-[#111827]">
                  {new Date(s.date).toLocaleDateString()}
                </td>

                <td className="px-4 py-3 text-[#64748b]">
                  {new Date(s.time).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>

                <td className="px-4 py-3 text-center">
                  <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-semibold text-green-600">
                    {s.present}
                  </span>
                </td>

                <td className="px-4 py-3 text-center">
                  <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-xs font-semibold text-red-600">
                    {s.absent}
                  </span>
                </td>

                <td className="px-4 py-3 text-center font-medium text-[#111827]">
                  {s.rate}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}