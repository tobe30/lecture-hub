import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  BookOpen,
  ArrowRight,
  Radio,
  CalendarDays,
  Video,
  Loader2,
} from "lucide-react";
import { getAuthUser, getStudentSessions } from "../../lib/api";

const statusColor = {
  Live: "bg-red-500/10 text-red-600",
  Completed: "bg-[#f1f5f9] text-[#64748b]",
};

export default function StudentDashboard() {
  const { data: authData } = useQuery({
    queryKey: ["authUser"],
    queryFn: getAuthUser,
  });

  const {
    data: sessionsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["studentSessions"],
    queryFn: getStudentSessions,
  });

  const user = authData?.user;
  const sessions = sessionsData?.sessions || [];

  const formattedSessions = sessions.map((session) => {
    const sessionDate = session.createdAt
      ? new Date(session.createdAt)
      : session.startTime
      ? new Date(session.startTime)
      : null;

    return {
      id: session._id,
      classId: session.class?._id,
      title: session.class?.title || session.title || "Untitled Session",
      code: session.class?.courseCode || "N/A",
      lecturer: session.lecturer?.name || "Unknown Lecturer",
      date: sessionDate
        ? sessionDate.toLocaleDateString([], {
            weekday: "short",
            day: "numeric",
            month: "short",
          })
        : "No date",
      time: sessionDate
        ? sessionDate.toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
          })
        : "No time",
      status: session.status === "active" ? "Live" : "Completed",
    };
  });

  const liveSession = formattedSessions.find((session) => session.status === "Live");

  const joinedClassesMap = new Map();

  formattedSessions.forEach((session) => {
    if (!session.classId) return;

    if (!joinedClassesMap.has(session.classId)) {
      joinedClassesMap.set(session.classId, {
        id: session.classId,
        title: session.title,
        code: session.code,
        lecturer: session.lecturer,
        status: session.status,
      });
    } else {
      const existing = joinedClassesMap.get(session.classId);

      if (session.status === "Live") {
        existing.status = "Live";
      } else if (existing.status !== "Live" && session.status === "Completed") {
        existing.status = "Completed";
      }
    }
  });

  const joinedClasses = Array.from(joinedClassesMap.values());
  const recentSessions = formattedSessions.slice(0, 5);

if (isLoading) {
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin mx-auto mb-3 text-[#3b82f6]" />
          <p className="text-sm text-slate-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
        Failed to load dashboard
      </div>
    );
  }

  return (
    <div className="space-y-6 px-6 py-8">
      <div>
        <h1 className="text-[24px] font-bold text-[#111827]">
          Welcome back, {user?.name || "Student"} 👋
        </h1>
        <p className="mt-1 text-[14px] text-[#64748b]">
          Here&apos;s an overview of your classes and live sessions.
        </p>
      </div>

      {liveSession && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
          <div className="mb-3 flex items-center gap-2">
            <Radio className="h-4 w-4 animate-pulse text-red-500" />
            <span className="text-xs font-semibold uppercase tracking-wide text-red-600">
              Live Now
            </span>
          </div>

          <h3 className="text-[18px] font-bold text-[#111827]">
            {liveSession.title}
          </h3>

          <p className="mt-0.5 text-[14px] text-[#64748b]">
            {liveSession.code} · {liveSession.lecturer}
          </p>

          <Link
            to={`/session/${liveSession.id}`}
            className="mt-4 inline-flex h-10 items-center gap-2 rounded-[12px] bg-red-500 px-4 text-[14px] font-semibold text-white transition hover:bg-red-600"
          >
            Join Live Session
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}

      <section>
        <h2 className="mb-3 text-[18px] font-bold text-[#111827]">
          Joined Classes
        </h2>

        {joinedClasses.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#e5e7eb] bg-white p-6 text-sm text-[#64748b]">
            You haven&apos;t joined any classes yet.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {joinedClasses.map((cls) => (
              <div
                key={cls.id}
                className="flex flex-col rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)]"
              >
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef4ff]">
                    <BookOpen className="h-5 w-5 text-[#3b82f6]" />
                  </div>

                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      statusColor[cls.status] || "bg-[#f1f5f9] text-[#64748b]"
                    }`}
                  >
                    {cls.status}
                  </span>
                </div>

                <h3 className="text-[15px] font-bold text-[#111827]">
                  {cls.title}
                </h3>

                <p className="mt-1 text-[13px] text-[#64748b]">
                  {cls.code} · {cls.lecturer}
                </p>

                <Link
                  to={`/student/class/${cls.id}`}
                  className="mt-auto inline-flex items-center gap-1 pt-4 text-[14px] font-semibold text-[#3b82f6] hover:underline"
                >
                  View Class
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
        <h2 className="mb-3 flex items-center gap-2 text-[16px] font-bold text-[#111827]">
          <CalendarDays className="h-4 w-4 text-[#64748b]" />
          Recent Sessions
        </h2>

        <div className="space-y-3">
          {recentSessions.length > 0 ? (
            recentSessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between rounded-[12px] border border-[#e5e7eb] bg-[#f8fafc] p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#eef4ff]">
                    <Video className="h-4 w-4 text-[#3b82f6]" />
                  </div>

                  <div>
                    <p className="text-[14px] font-medium text-[#111827]">
                      {session.title}
                    </p>
                    <p className="text-[12px] text-[#64748b]">
                      {session.code} · {session.lecturer}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-[12px] font-medium text-[#111827]">
                    {session.date}
                  </p>
                  <p className="text-[12px] text-[#64748b]">{session.time}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-[#64748b]">No sessions yet</p>
          )}
        </div>
      </section>
    </div>
  );
}