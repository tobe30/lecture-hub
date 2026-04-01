import { Link, useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Radio,
  Clock,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getClassById, getActiveSessionByClass, getAuthUser } from "../../lib/api";

export default function StudentClassDetails() {
  const { classId } = useParams();
  const navigate = useNavigate();

  const {
    data: classResponse,
    isLoading: classLoading,
    error: classError,
  } = useQuery({
    queryKey: ["student-class", classId],
    queryFn: () => getClassById(classId),
    enabled: !!classId,
  });

  const {
    data: activeSessionResponse,
    isLoading: sessionLoading,
  } = useQuery({
    queryKey: ["active-session-by-class", classId],
    queryFn: () => getActiveSessionByClass(classId),
    enabled: !!classId,
    retry: false,
  });
    const { data: authResponse } = useQuery({
    queryKey: ["auth-user"],
    queryFn: getAuthUser,
  });

  const user = authResponse?.user;

  const cls = classResponse?.class || classResponse?.classData;
  const activeSession = activeSessionResponse?.session;

  // console.log("activeSession", activeSession);

if (classLoading) {
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin mx-auto mb-3 text-[#3b82f6]" />
          <p className="text-sm text-slate-500">Loading Class details...</p>
        </div>
      </div>
    );
  }

  if (classError || !cls) {
    return <div className="p-6 text-red-500">Failed to load class details</div>;
  }

  const isLive = !!activeSession;
  const status = isLive ? "Live" : "Not live";

const isUserInSession = (session) => {
  if (!user || !session) return false;

  const isLecturer = session?.lecturer?._id === user._id;

  const isAttendee = session?.attendees?.some(
    (attendee) => attendee?.student?._id === user._id
  );

  return isLecturer || isAttendee;
};

  return (
    <div className="max-w-3xl space-y-6 px-6 py-8">
      <button
        onClick={() => navigate("/student/classes")}
        className="flex items-center gap-1.5 text-[14px] font-medium text-[#64748b] transition-colors hover:text-[#111827]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Classes
      </button>

      <div className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-[20px] font-bold text-[#111827]">
              {cls.title}
            </h1>

            <p className="mt-1 flex items-center gap-2 text-[14px] text-[#64748b] flex-wrap">
              <span className="font-medium">{cls.classCode}</span>
              <span>·</span>
              <User className="h-3.5 w-3.5" />
              <span>{cls.lecturer?.name || "Lecturer"}</span>
            </p>
          </div>

          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              isLive
                ? "bg-red-500/10 text-red-600"
                : "bg-[#3b82f6]/10 text-[#3b82f6]"
            }`}
          >
            {status}
          </span>
        </div>

        <p className="mt-4 text-[14px] leading-relaxed text-[#64748b]">
          {cls.description || "No class description available yet."}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-[13px] text-[#64748b]">
          <span>
            Students: <span className="font-medium text-[#111827]">{cls.students?.length || 0}</span>
          </span>
          {cls.schedule && (
            <span>
              Schedule: <span className="font-medium text-[#111827]">{cls.schedule}</span>
            </span>
          )}
          {cls.capacity && (
            <span>
              Capacity: <span className="font-medium text-[#111827]">{cls.capacity}</span>
            </span>
          )}
        </div>

        <div className="mt-5 flex flex-col gap-3 rounded-[12px] border border-[#e5e7eb] bg-[#f8fafc] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            {isLive ? (
              <Radio className="h-4 w-4 animate-pulse text-red-500" />
            ) : (
              <Clock className="h-4 w-4 text-[#3b82f6]" />
            )}

            <span className="text-[14px] font-medium text-[#111827]">
              {isLive
                ? activeSession?.title || "Live session is active now"
                : sessionLoading
                ? "Checking session status..."
                : "No live session right now"}
            </span>
          </div>

          {isLive ? (
            <Link
              to={`/session/${activeSession._id}`}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-[12px] bg-red-500 px-4 text-[14px] font-semibold text-white transition hover:bg-red-600"
            >
              {isUserInSession(activeSession) ? "Rejoin" : "Join live session"}
              <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <span className="text-[12px] text-[#64748b]">Not live yet</span>
          )}
        </div>
      </div>
    </div>
  );
}