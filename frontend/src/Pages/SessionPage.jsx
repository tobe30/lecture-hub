import { useEffect, useMemo, useState } from "react";
import { Users, MessageSquare, User, ClipboardCheck, Mic, Loader2Icon } from "lucide-react";
import { endSession, getAuthUser, getSessionById, JoinSession } from "../lib/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import useStreamClient from "../hooks/useStreamClient";
import {
  StreamCall,
  StreamVideo,
  CallControls,
  ParticipantView,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import {
  Channel,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import { useParams, Navigate } from "react-router-dom";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import "stream-chat-react/dist/css/v2/index.css";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

function LectureLayout({ lecturerId }) {
  const { useParticipants } = useCallStateHooks();
  const participants = useParticipants();


  const { lecturerParticipant, studentParticipants } = useMemo(() => {
    if (!participants || participants.length === 0) {
      return {
        lecturerParticipant: null,
        studentParticipants: [],
      };
    }

    const lecturer = participants.find(
      (participant) => String(participant?.userId) === String(lecturerId)
    );

    const students = participants.filter(
      (participant) => String(participant?.userId) !== String(lecturerId)
    );

    return {
      lecturerParticipant: lecturer || null,
      studentParticipants: students,
    };
  }, [participants, lecturerId]);

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      {/* Lecturer big video */}
      <div className="flex-1 min-h-[320px] overflow-hidden rounded-[20px] border border-white/5 bg-[#151d2d]">
        {lecturerParticipant ? (
          <ParticipantView participant={lecturerParticipant} />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-slate-300 text-sm">
            Lecturer has not joined yet
          </div>
        )}
      </div>

      {/* Students small row */}
      <div className="min-w-0 overflow-x-auto overflow-y-hidden pb-2">
        <div className="flex gap-2.5 w-max min-w-full">
          {studentParticipants.length > 0 ? (
            studentParticipants.map((participant) => (
              <div
                key={participant.sessionId}
                className="w-[110px] h-[85px] sm:w-[120px] sm:h-[90px] shrink-0 overflow-hidden rounded-[18px] border border-white/5 bg-[#151d2d]"
              >
                <ParticipantView participant={participant} />
              </div>
            ))
          ) : (
            <div className="text-sm text-slate-400 px-2 py-2">
              No students in session yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SpeakerArea({ streamClient, call, loading, lecturerId }) {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <Loader2Icon className="w-12 h-12 mx-auto animate-spin text-primary mb-4" />
                    <p className="text-lg">Connecting to video call...</p>
                  </div>
                </div>
    );
  }

  if (!streamClient || !call) {
    return (
      <div className="flex-1 min-h-[260px] rounded-[20px] border border-white/5 bg-[#151d2d] flex items-center justify-center text-red-400">
        Error loading session
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-0 flex flex-col overflow-hidden str-video">
      <StreamVideo client={streamClient}>
        <StreamCall call={call}>
          <LectureLayout lecturerId={lecturerId} />

          <div className="mt-3 px-2 sm:px-1">
            <div className="mx-auto max-w-full sm:max-w-xl rounded-2xl sm:rounded-full border border-white/10 bg-[#0a1120] px-2 py-2 overflow-x-auto">
              <div className="min-w-max flex justify-center">
                <CallControls onLeave={() => navigate("/dashboard")} />
              </div>
            </div>
          </div>
        </StreamCall>
      </StreamVideo>
    </div>
  );
}

function ChatMessages({ chatClient, channel, chatError }) {
  if (chatError) {
    return (
      <div className="text-red-400 text-sm">
        {chatError}
      </div>
    );
  }

  if (!chatClient || !channel) {
    return <div className="text-slate-400">Loading chat...</div>;
  }

  return (
    <div className="h-full min-h-0">
      <Chat client={chatClient} theme="str-chat__theme-dark">
        <Channel channel={channel}>
          <Window>
            <MessageList />
            <MessageInput />
          </Window>
          <Thread />
        </Channel>
      </Chat>
    </div>
  );
}

function PeopleList({ session }) {
  const lecturer = session?.lecturer;
  const classStudents = session?.class?.students || [];
  const attendees = session?.attendees || [];

  const attendeeIds = new Set(
    attendees
      .map((attendee) => String(attendee?.student?._id || attendee?.student || ""))
      .filter(Boolean)
  );

  const people = [
    ...(lecturer
      ? [
          {
            _id: String(lecturer._id),
            name: lecturer.name,
            email: lecturer.email,
            role: "Lecturer",
            isOnline: true,
          },
        ]
      : []),
    ...classStudents.map((student) => ({
      _id: String(student._id),
      name: student.name,
      email: student.email,
      role: "Student",
      isOnline: attendeeIds.has(String(student._id)),
    })),
  ];

  return (
    <div className="space-y-3">
      {people.map((person) => (
        <div
          key={person._id}
          className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
        >
          <div>
            <p className="text-sm font-semibold text-white">{person.name}</p>
            <p className="text-xs text-slate-400">{person.email}</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] px-2 py-1 rounded-full bg-blue-500/15 text-blue-300">
              {person.role}
            </span>

            <span
              className={`text-[11px] px-2 py-1 rounded-full ${
                person.isOnline
                  ? "bg-emerald-500/15 text-emerald-300"
                  : "bg-slate-500/15 text-slate-300"
              }`}
            >
              {person.isOnline ? "Live" : "Offline"}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
function AttendanceList({ session }) {
  const classStudents = session?.class?.students || [];
  const attendees = session?.attendees || [];

  const attendeeStudentIds = new Set(
    attendees
      .map((attendee) => {
        if (!attendee) return null;

        if (attendee.student?._id) return String(attendee.student._id);
        if (attendee.student) return String(attendee.student);

        return null;
      })
      .filter(Boolean)
  );

  const attendancePeople = classStudents.map((student) => ({
    _id: String(student._id),
    name: student.name,
    email: student.email,
    present: attendeeStudentIds.has(String(student._id)),
  }));

  const presentCount = attendancePeople.filter((person) => person.present).length;
  const absentCount = attendancePeople.filter((person) => !person.present).length;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs text-slate-400">Present</p>
          <p className="text-xl font-semibold text-emerald-400 mt-1">
            {presentCount}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs text-slate-400">Absent</p>
          <p className="text-xl font-semibold text-red-400 mt-1">
            {absentCount}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {attendancePeople.map((person) => (
          <div
            key={person._id}
            className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
          >
            <div>
              <p className="text-sm font-semibold text-white">{person.name}</p>
              <p className="text-xs text-slate-400">{person.email}</p>
            </div>

            <span
              className={`text-[11px] px-3 py-1 rounded-full font-medium ${
                person.present
                  ? "bg-emerald-500/15 text-emerald-300"
                  : "bg-red-500/15 text-red-300"
              }`}
            >
              {person.present ? "Present" : "Absent"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PeoplePanelContent({ session }) {
  const { useParticipants } = useCallStateHooks();
  const participants = useParticipants();

  return <PeopleList session={session} participants={participants} />;
}

function SidePanel({ activeTab, setActiveTab, chatClient, channel, chatError, session }) {
  return (
    <div className="h-full min-h-0 bg-[#0a1120] border border-white/5 rounded-[20px] flex flex-col overflow-hidden">
      <div className="border-b border-white/10 px-4 shrink-0">
        <div className="flex items-end gap-5 overflow-x-auto">
          <button
            onClick={() => setActiveTab("chat")}
            className={`h-12 sm:h-14 shrink-0 flex items-center gap-2 text-xs sm:text-sm font-semibold border-b-2 ${
              activeTab === "chat"
                ? "text-[#3b82f6] border-[#3b82f6]"
                : "text-slate-500 border-transparent"
            }`}
          >
            <MessageSquare size={15} />
            CHAT
          </button>

          <button
            onClick={() => setActiveTab("people")}
            className={`h-12 sm:h-14 shrink-0 flex items-center gap-2 text-xs sm:text-sm font-semibold border-b-2 ${
              activeTab === "people"
                ? "text-[#3b82f6] border-[#3b82f6]"
                : "text-slate-500 border-transparent"
            }`}
          >
            <User size={15} />
            PEOPLE
          </button>

          <button
            onClick={() => setActiveTab("attendance")}
            className={`h-12 sm:h-14 shrink-0 flex items-center gap-2 text-xs sm:text-sm font-semibold border-b-2 ${
              activeTab === "attendance"
                ? "text-[#3b82f6] border-[#3b82f6]"
                : "text-slate-500 border-transparent"
            }`}
          >
            <ClipboardCheck size={15} />
            ATTENDANCE
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4">
        {activeTab === "chat" && (
          <ChatMessages chatClient={chatClient} channel={channel} chatError={chatError} />
        )}
       {activeTab === "people" && <PeoplePanelContent session={session} />}
        {activeTab === "attendance" && <AttendanceList session={session} />}
      </div>
    </div>
  );
}

export default function SessionPage() {
  const [mobileTab, setMobileTab] = useState("video");
  const [desktopTab, setDesktopTab] = useState("chat");
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: authResponse } = useQuery({
    queryKey: ["authUser"],
    queryFn: getAuthUser,
    refetchOnWindowFocus: false,
  });

  const authUser = authResponse?.user;

  const { data: sessionData, isLoading: loadingSession, refetch } = useQuery({
    queryKey: ["session", id],
    queryFn: () => getSessionById(id),
    enabled: !!authUser && !!id,
    refetchInterval: 5000,
  });

  const session = sessionData?.session;

  const lecturerId = session?.lecturer?._id;

  const isHost = lecturerId === authUser?._id;

  const isParticipant = session?.class?.students?.some(
    (student) => student?._id === authUser?._id
  );

  const { mutate: joinSessionMutation } = useMutation({
    mutationFn: JoinSession,
    mutationKey:["joinSession"],
    onSuccess: () => {
      toast.success("Joined session successfully!");
      refetch();
    },
    onError: (error) =>
      toast.error(error.response?.data?.message || "Failed to join session"),
  });

const {
  mutate: endSessionMutation,
  isPending: endSessionPending,
} = useMutation({
  mutationFn: endSession,
  mutationKey: ["endSession"],
  onSuccess: () => {
    toast.success("Session ended successfully!");
    navigate("/dashboard");
  },
  onError: (error) =>
    toast.error(error.response?.data?.message || "Failed to end session"),
});;



  useEffect(() => {
    if (!session || !authUser || loadingSession) return;
    if (!isHost && !isParticipant) return;

    joinSessionMutation(id);
  }, [session?._id, authUser?._id, loadingSession, isHost, isParticipant, id, joinSessionMutation]);

  

  const {
    streamClient,
    call,
    chatClient,
    channel,
    isInitializingCall,
    chatError,
  } = useStreamClient(session, loadingSession, isHost, isParticipant);

  useEffect(() => {
  if (!session) return;

  if (session.status === "completed") {
    toast("Session has ended");

    // leave video call if inside
    if (call) {
      call.leave();
    }

    // redirect student
    navigate("/dashboard");
  }
}, [session?.status]);

if (loadingSession || !authUser) {
  return (
    <div className="h-screen flex items-center justify-center bg-[#050b16] text-white">
      <div className="text-center">
        <Loader2Icon className="w-12 h-12 mx-auto animate-spin text-primary mb-4" />
        <p className="text-lg">Checking session...</p>
      </div>
    </div>
  );
}

if (!session) {
  return <Navigate to="/dashboard" replace />;
}

if (session.status === "completed") {
  return <Navigate to="/dashboard" replace />;
}


console.log("authResponse", authResponse);
console.log("authUser", authUser);
console.log("sessionData", sessionData);
console.log("session", session);
console.log("isHost", isHost);
console.log("isParticipant", isParticipant);
console.log("isInitializingCall", isInitializingCall);
console.log("session.class", session?.class);
console.log("session.class.students", session?.class?.students);

const handleEndSession = () => {
  if (!isHost) return;

  const confirmed = window.confirm(
    "Are you sure you want to end this session?"
  );

  if (confirmed) {
    endSessionMutation(id);
  }
};




  return (
    <div className="h-screen bg-[#050b16] text-white flex flex-col overflow-hidden">
      <div className="shrink-0 border-b border-white/10 px-4 sm:px-5 lg:px-6 py-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <h1 className="text-base sm:text-lg lg:text-xl font-semibold tracking-tight">
            {session?.title} - {session?.class?.title}
          </h1>

          <span className="px-3 py-1 rounded-full text-xs bg-[#102c63] text-[#68a0ff] font-medium">
            {session?.class?.courseCode || "Course"}
          </span>

          <span className="px-3 py-1 rounded-full text-xs bg-[#ef4444] text-white font-medium flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-white"></span>
            Live
          </span>
        </div>

<div className="flex items-center gap-3">
  <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-300">
    <Users size={15} />
    <span>Session active</span>
  </div>

  {isHost && (
    <button
      onClick={handleEndSession}
      disabled={endSessionPending}
      className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium transition"
    >
      {endSessionPending ? "Ending..." : "End Session"}
    </button>
  )}
</div>
      </div>

      <div className="hidden lg:block flex-1 min-h-0 overflow-hidden p-3 sm:p-4">
        <div className="h-full min-h-0 grid grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_360px] gap-4">
          <div className="min-h-0 min-w-0 flex flex-col overflow-hidden">
            <SpeakerArea
              streamClient={streamClient}
              call={call}
              loading={isInitializingCall}
              lecturerId={lecturerId}
            />
          </div>

          <div className="min-h-0 h-full overflow-hidden">
            <SidePanel
              activeTab={desktopTab}
              setActiveTab={setDesktopTab}
              chatClient={chatClient}
              channel={channel}
              chatError={chatError}
               session={session}
            />
          </div>
        </div>
      </div>

      <div className="lg:hidden flex-1 min-h-0 overflow-hidden p-3 flex flex-col">
        <div className="shrink-0 grid grid-cols-4 gap-2 mb-3">
          <button
            onClick={() => setMobileTab("video")}
            className={`h-10 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 ${
              mobileTab === "video"
                ? "bg-[#102c63] text-[#68a0ff]"
                : "bg-white/5 text-slate-300"
            }`}
          >
            <span>Video</span>
          </button>

          <button
            onClick={() => setMobileTab("chat")}
            className={`h-10 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 ${
              mobileTab === "chat"
                ? "bg-[#102c63] text-[#68a0ff]"
                : "bg-white/5 text-slate-300"
            }`}
          >
            <span>Chat</span>
          </button>

          <button
            onClick={() => setMobileTab("people")}
            className={`h-10 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 ${
              mobileTab === "people"
                ? "bg-[#102c63] text-[#68a0ff]"
                : "bg-white/5 text-slate-300"
            }`}
          >
            <span>People</span>
          </button>

          <button
            onClick={() => setMobileTab("attendance")}
            className={`h-10 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 ${
              mobileTab === "attendance"
                ? "bg-[#102c63] text-[#68a0ff]"
                : "bg-white/5 text-slate-300"
            }`}
          >
            <span>Attend</span>
          </button>
        </div>

        <div className="flex-1 min-h-0 overflow-hidden">
          {mobileTab === "video" && (
            <div className="h-full min-h-0 flex flex-col overflow-hidden">
              <SpeakerArea
                streamClient={streamClient}
                call={call}
                loading={isInitializingCall}
                lecturerId={lecturerId}
              />
            </div>
          )}

          {mobileTab === "chat" && (
            <div className="h-full min-h-0">
              <SidePanel
                activeTab="chat"
                setActiveTab={setMobileTab}
                chatClient={chatClient}
                channel={channel}
                chatError={chatError}
                 session={session}
              />
            </div>
          )}

          {mobileTab === "people" && (
            <div className="h-full min-h-0 overflow-y-auto bg-[#0a1120] border border-white/5 rounded-[20px] p-4">
              <h3 className="text-sm font-semibold text-white mb-4">
                Participants
              </h3>
              <StreamVideo client={streamClient}>
  <StreamCall call={call}>
    <PeoplePanelContent session={session} />
  </StreamCall>
</StreamVideo>
            </div>
          )}

          {mobileTab === "attendance" && (
            <div className="h-full min-h-0 overflow-y-auto bg-[#0a1120] border border-white/5 rounded-[20px] p-4">
              <h3 className="text-sm font-semibold text-white mb-4">
                Attendance
              </h3>
              <AttendanceList session={session} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}