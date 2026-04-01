import { useState } from "react";
import { Search, Users, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getLecturerStudents } from "../lib/api";

const statusColor = {
  Active: "bg-green-500/10 text-green-600",
  Inactive: "bg-[#f1f5f9] text-[#64748b]",
};

export default function StudentsPage() {
  const [search, setSearch] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["students"],
    queryFn: getLecturerStudents,
  });

  const students = data?.students || [];

  const filtered = students.filter(
    (s) =>
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.email?.toLowerCase().includes(search.toLowerCase())
  );

  const totalStudents = students.length;
  const activeStudents = students.filter((s) => s.status === "Active").length;

  const avgAttendance =
    students.length > 0
      ? Math.round(
          students.reduce((sum, s) => sum + (s.attendance || 0), 0) /
            students.length
        )
      : 0;

  if (isLoading) {
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin mx-auto mb-3 text-[#3b82f6]" />
          <p className="text-sm text-slate-500">Loading students...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[70vh] flex items-center justify-center text-red-500">
        Failed to load students
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <div className="mb-6">
        <h1 className="text-[24px] font-bold text-[#111827]">Students</h1>
        <p className="mt-1 text-[15px] text-[#64748b]">
          View and manage all enrolled students
        </p>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[#e5e7eb] bg-white p-4 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
          <p className="text-[13px] font-medium text-[#64748b]">Total Students</p>
          <p className="mt-1 text-[22px] font-bold text-[#111827]">
            {totalStudents}
          </p>
        </div>

        <div className="rounded-2xl border border-[#e5e7eb] bg-white p-4 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
          <p className="text-[13px] font-medium text-[#64748b]">Active</p>
          <p className="mt-1 text-[22px] font-bold text-[#111827]">
            {activeStudents}
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
      </div>

      <div className="mb-4 relative max-w-xs">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748b]" />
        <input
          type="text"
          placeholder="Search students..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-11 w-full rounded-[12px] border border-[#dbe2ea] bg-white pl-10 pr-4 text-[14px] text-[#111827] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/20"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
        <table className="w-full text-[14px]">
          <thead>
            <tr className="border-b border-[#e5e7eb] bg-[#f8fafc]">
              <th className="px-4 py-3 text-left font-medium text-[#64748b]">
                Student
              </th>
              <th className="px-4 py-3 text-left font-medium text-[#64748b]">
                Classes
              </th>
              <th className="px-4 py-3 text-center font-medium text-[#64748b]">
                Attendance
              </th>
              <th className="px-4 py-3 text-center font-medium text-[#64748b]">
                Status
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
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#eef4ff]">
                      <span className="text-[12px] font-semibold text-[#3b82f6]">
                        {s.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>

                    <div>
                      <p className="font-medium text-[#111827]">{s.name}</p>
                      <p className="text-[12px] text-[#64748b]">{s.email}</p>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {(s.classes || []).map((c) => (
                      <span
                        key={c}
                        className="rounded-md bg-[#eef4ff] px-2 py-0.5 text-[12px] font-medium text-[#3b82f6]"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </td>

                <td className="px-4 py-3 text-center font-medium text-[#111827]">
                  {s.attendance || 0}%
                </td>

                <td className="px-4 py-3 text-center">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      statusColor[s.status || "Active"]
                    }`}
                  >
                    {s.status || "Active"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}