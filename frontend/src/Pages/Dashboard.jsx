import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  Loader2,
  Plus,
  Users,
  Video,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {  getClasses, getMyRecentSession, getAuthUser } from "../lib/api";

const Dashboard = () => {
  const { data: authData } = useQuery({
    queryKey: ["authUser"],
    queryFn: getAuthUser,
  });

  const { data: classesData, isLoading: classesLoading } = useQuery({
    queryKey: ["classes"],
    queryFn: getClasses,
  });

  const { data: sessionsData, isLoading: sessionsLoading } = useQuery({
    queryKey: ["recentSessions"],
    queryFn: getMyRecentSession,
  });

  const user = authData?.user;
  const classes = classesData?.classes || [];
  const sessions = sessionsData?.sessions || [];

  const totalClasses = classes.length;

const uniqueStudentIds = new Set();

classes.forEach((cls) => {
  (cls.students || []).forEach((student) => {
    const studentId = typeof student === "string" ? student : student?._id;
    if (studentId) uniqueStudentIds.add(studentId);
  });
});

const totalStudents = uniqueStudentIds.size;

  const latestSession = sessions[0];

  const upcomingSessionText = latestSession
    ? latestSession.startTime
      ? new Date(latestSession.startTime).toLocaleString([], {
          weekday: "short",
          hour: "numeric",
          minute: "2-digit",
        })
      : latestSession.title || "Active now"
    : "No active session";

  const stats = [
    { label: "Total Classes", value: totalClasses, icon: BookOpen },
    { label: "Total Students", value: totalStudents, icon: Users },
    { label: "Recent Session", value: upcomingSessionText, icon: Calendar },
  ];

  const recentClasses = classes.slice(0, 3);


  if (classesLoading || sessionsLoading) {
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin mx-auto mb-3 text-[#3b82f6]" />
          <p className="text-sm text-slate-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-[28px] font-bold tracking-[-0.02em] text-[#0f172a]">
          Welcome back, {user?.name || "Lecturer"}
        </h1>
        <p className="mt-1 text-[15px] text-[#64748b]">
          Manage your classes and start live sessions easily.
        </p>
      </div>

      <div className="mb-8 flex flex-wrap gap-3">
        <Link
          to="/dashboard/sessions"
          className="inline-flex h-[42px] items-center gap-2 rounded-xl bg-[#3b82f6] px-5 text-sm font-semibold text-white transition hover:bg-[#2563eb]"
        >
          <Video className="h-4 w-4" />
          Start Live Session
        </Link>

        <Link
          to="/dashboard/create-class"
          className="inline-flex h-[42px] items-center gap-2 rounded-xl border border-[#d9dee8] bg-white px-5 text-sm font-semibold text-[#0f172a] transition hover:border-[#165DFF] hover:text-[#165DFF]"
        >
          <Plus className="h-4 w-4" />
          Create Class
        </Link>
      </div>

      <div className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-[#dfe5ef] bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eef4ff]">
                <stat.icon className="h-5 w-5 text-[#3b82f6]" />
              </div>

              <div>
                <p className="text-sm text-[#64748b]">{stat.label}</p>
                <p className="text-[17px] font-bold text-[#0f172a]">
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div>
        <h2 className="mb-5 text-[18px] font-semibold text-[#0f172a]">
          Recent Classes
        </h2>

        {recentClasses.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#dfe5ef] bg-white p-8 text-center">
            <p className="text-sm text-[#64748b]">
              No classes yet. Create your first class to get started.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {recentClasses.map((cls) => (
              <div
                key={cls._id}
                className="rounded-2xl border border-[#dfe5ef] bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition hover:shadow-md"
              >
                <div className="mb-5">
                  <span className="rounded-full bg-[#edf4ff] px-3 py-1 text-xs font-semibold text-[#3b82f6]">
                    {cls.courseCode}
                  </span>
                </div>

                <h3 className="mb-1 text-[16px] font-semibold text-[#0f172a]">
                  {cls.title}
                </h3>

                <p className="mb-5 text-sm text-[#64748b]">
                  {cls.students?.length || 0} students enrolled
                </p>

                
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;