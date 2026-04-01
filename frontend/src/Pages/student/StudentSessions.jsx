import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Video,
  ArrowRight,
  Radio,
  CalendarDays,
  CheckCircle2,
} from "lucide-react";
import { getStudentSessions } from "../../lib/api";

const statusConfig = {
  Live: {
    color: "bg-red-500/10 text-red-600",
    label: "Live Now",
  },
  Completed: {
    color: "bg-[#f1f5f9] text-[#64748b]",
    label: "Completed",
  },
};

export default function StudentSessions() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["studentSessions"],
    queryFn: getStudentSessions,
  });

  const sessions = data?.sessions || [];

  const formattedSessions = sessions.map((session) => {
    const sessionDate = session.createdAt
      ? new Date(session.createdAt)
      : session.startTime
      ? new Date(session.startTime)
      : null;

    return {
      id: session._id,
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

  const liveSessions = formattedSessions.filter((s) => s.status === "Live");
  const completedSessions = formattedSessions.filter(
    (s) => s.status === "Completed"
  );

  const renderSession = (s) => {
    const config = statusConfig[s.status];

    return (
      <div
        key={s.id}
        className="flex items-center justify-between rounded-2xl border border-[#e5e7eb] bg-white p-4 shadow-[0_1px_2px_rgba(16,24,40,0.04)]"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef4ff]">
            <Video className="h-5 w-5 text-[#3b82f6]" />
          </div>

          <div>
            <h3 className="text-[14px] font-bold text-[#111827]">
              {s.title}
            </h3>

            <p className="mt-0.5 text-[12px] text-[#64748b]">
              {s.code} · {s.lecturer}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden text-right sm:block">
            <p className="text-[12px] font-medium text-[#111827]">{s.date}</p>
            <p className="text-[12px] text-[#64748b]">{s.time}</p>
          </div>

          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${config.color}`}
          >
            {config.label}
          </span>

          {s.status === "Live" && (
            <Link
              to={`/student/live/${s.id}`}
              className="inline-flex h-8 items-center gap-1.5 rounded-[10px] bg-red-500 px-3 text-xs font-semibold text-white hover:bg-red-600"
            >
              Join
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
      </div>
    );
  };

if (isLoading) {
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin mx-auto mb-3 text-[#3b82f6]" />
          <p className="text-sm text-slate-500">Loading Sessions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
        Failed to load sessions
      </div>
    );
  }

  return (
    <div className="space-y-6 px-6 py-8">
      <div>
        <h1 className="text-[24px] font-bold text-[#111827]">
          Live Sessions
        </h1>

        <p className="mt-1 text-[14px] text-[#64748b]">
          View and join your class sessions
        </p>
      </div>

      <section>
        <h2 className="mb-3 flex items-center gap-2 text-[16px] font-bold text-[#111827]">
          <Radio className="h-4 w-4 animate-pulse text-red-500" />
          Live Now
        </h2>

        <div className="space-y-3">
          {liveSessions.length > 0 ? (
            liveSessions.map(renderSession)
          ) : (
            <p className="text-sm text-[#64748b]">No live sessions right now</p>
          )}
        </div>
      </section>

      <section>
        <h2 className="mb-3 flex items-center gap-2 text-[16px] font-bold text-[#111827]">
          <CalendarDays className="h-4 w-4 text-[#64748b]" />
          Past Sessions
        </h2>

        <div className="space-y-3">
          {completedSessions.length > 0 ? (
            completedSessions.map(renderSession)
          ) : (
            <p className="text-sm text-[#64748b]">No past sessions yet</p>
          )}
        </div>
      </section>
    </div>
  );
}