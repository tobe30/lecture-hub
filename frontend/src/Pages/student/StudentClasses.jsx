import { Link } from "react-router-dom";
import { BookOpen, ArrowRight, Users, Video, Search, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getStudentClasses } from "../../lib/api";

export default function StudentClasses() {

    const { data, isLoading, error } = useQuery({
      queryKey: ["class"],
      queryFn: getStudentClasses,
    });

    const classes = data?.classes || [];

if (isLoading) {
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin mx-auto mb-3 text-[#3b82f6]" />
          <p className="text-sm text-slate-500">Loading classes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="p-6 text-red-500">Failed to load classes</div>;
  }
  return (
      <div className="space-y-6 px-6 py-8">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[24px] font-bold text-[#111827]">
              My Classes
            </h1>

            <p className="mt-1 text-[14px] text-[#64748b]">
              All your enrolled classes in one place
            </p>
          </div>

          <Link
            to="/join-class"
            className="inline-flex items-center gap-2 rounded-[12px] bg-[#3b82f6] px-4 py-2.5 text-[14px] font-semibold text-white hover:bg-[#2563eb]"
          >
            Join New Class
          </Link>
        </div>

        {/* Search */}
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />

          <input
            type="text"
            placeholder="Search classes..."
            className="h-10 w-full rounded-[12px] border border-[#e5e7eb] bg-white pl-10 pr-4 text-[14px] text-[#111827] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/20"
          />
        </div>

        {/* Classes grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {classes.map((cls) => (
            <div
              key={cls.id}
              className="flex flex-col rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)]"
            >
              {/* top */}
              <div className="mb-3 flex items-start justify-between">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef4ff]">
                  <BookOpen className="h-5 w-5 text-[#3b82f6]" />
                </div>

                <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      cls.isActive
                        ? "bg-green-500/10 text-green-600"
                        : "bg-[#f1f5f9] text-[#64748b]"
                    }`}
                  >
                    {cls.isActive ? "Active" : "Completed"}
                  </span>
              </div>

              {/* title */}
              <h3 className="text-[15px] font-bold text-[#111827]">
                {cls.title}
              </h3>

              <p className="mt-1 text-[13px] text-[#64748b]">
                {cls.classCode} · {cls.lecturer.name}
              </p>

              {/* stats */}
              <div className="mt-3 flex items-center gap-4 text-[12px] text-[#64748b]">

                <span className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" />
                  {cls.students.length}
                </span>

                {/* <span className="flex items-center gap-1">
                  <Video className="h-3.5 w-3.5" />
                  {cls.sessions} sessions
                </span> */}

              </div>

              {/* button */}
              <Link
                to={`/student/class/${cls._id}`}
                className="mt-auto inline-flex items-center gap-1 pt-4 text-[14px] font-semibold text-[#3b82f6] hover:underline"
              >
                View Class
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>

            </div>
          ))}
        </div>

      </div>
  );
}