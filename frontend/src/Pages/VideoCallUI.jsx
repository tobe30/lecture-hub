import {
  CallControls,
  CallingState,
  ParticipantView,
  SpeakerLayout,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import {
  Loader2Icon,
  MessageSquareIcon,
  UsersIcon,
  ClipboardCheckIcon,
  XIcon,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Channel,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import "stream-chat-react/dist/css/v2/index.css";

function getParticipantId(participant) {
  return participant?.userId || participant?.user?.id || participant?.sessionId || "";
}

function getParticipantName(participant) {
  return participant?.name || participant?.user?.name || participant?.userId || "Participant";
}

function getParticipantImage(participant) {
  return participant?.image || participant?.user?.image || "";
}

function MiniTile({ participant }) {
  return (
    <div className="relative w-full aspect-[4/5] sm:aspect-video overflow-hidden rounded-2xl border border-white/10 bg-[#08111f]">
      <ParticipantView participant={participant} className="h-full w-full" />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent px-2 py-1.5">
        <p className="truncate text-xs font-medium text-white">
          {getParticipantName(participant)}
        </p>
      </div>
    </div>
  );
}

function PeoplePanel({ participants, lecturerId }) {
  const people = participants.map((participant) => {
    const id = getParticipantId(participant);
    const isLecturer = id === lecturerId;

    return {
      id,
      name: getParticipantName(participant),
      image: getParticipantImage(participant),
      role: isLecturer ? "Lecturer" : "Student",
    };
  });

  return (
    <div className="grid gap-2">
      {people.map((person) => (
        <div
          key={person.id}
          className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-3"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-700/80 font-semibold uppercase text-white">
            {person.image ? (
              <img src={person.image} alt={person.name} className="h-full w-full object-cover" />
            ) : (
              person.name?.charAt(0) || "U"
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">{person.name}</p>
            <p className="truncate text-[11px] text-white/60">{person.role}</p>
          </div>

          <span
            className={`rounded-full px-2.5 py-1 text-[10px] font-medium ${
              person.role === "Lecturer"
                ? "bg-purple-500/20 text-purple-200"
                : "bg-blue-500/20 text-blue-200"
            }`}
          >
            {person.role}
          </span>
        </div>
      ))}
    </div>
  );
}
function AttendancePanel({ session, lecturerId, participants }) {
  const liveIds = new Set(participants.map((p) => getParticipantId(p)));

  const attendeeMap = new Map();

  (session?.attendees || []).forEach((att) => {
    const studentId =
      typeof att?.student === "string" ? att.student : att?.student?._id;

    const studentName =
      typeof att?.student === "string"
        ? "Student"
        : att?.student?.name || "Student";

    if (!studentId) return;

    if (!attendeeMap.has(studentId)) {
      attendeeMap.set(studentId, {
        id: studentId,
        name: studentName,
        role: "Student",
        live: liveIds.has(studentId),
      });
    }
  });

  const rows = [
    {
      id: lecturerId,
      name: session?.lecturer?.name || "Lecturer",
      role: "Lecturer",
      live: liveIds.has(lecturerId),
    },
    ...Array.from(attendeeMap.values()),
  ];

  return (
    <div className="grid gap-2">
      {rows.map((row) => (
        <div
          key={row.id}
          className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-3"
        >
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">{row.name}</p>
            <p className="text-[11px] text-white/60">{row.role}</p>
          </div>

          <span
            className={`rounded-full px-2.5 py-1 text-[10px] font-medium ${
              row.live
                ? "bg-emerald-500/20 text-emerald-200"
                : "bg-white/10 text-white/70"
            }`}
          >
            {row.live ? "Live" : "Offline"}
          </span>
        </div>
      ))}
    </div>
  );
}

function StudentsRail({ participants }) {
  if (!participants.length) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-4 text-sm text-white/60">
        No students have joined yet.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2">
      {participants.map((participant) => (
        <MiniTile
          key={participant.sessionId || getParticipantId(participant)}
          participant={participant}
        />
      ))}
    </div>
  );
}

function RightPanel({
  activeTab,
  setActiveTab,
  setShowPanel,
  chatClient,
  channel,
  chatError,
  participants,
  lecturerId,
  session,
  studentParticipants,
  mobile = false,
}) {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-t-[28px] border border-white/10 bg-[linear-gradient(180deg,#081427_0%,#06101f_100%)] md:rounded-[28px]">
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-3">
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab("chat")}
            className={`inline-flex h-10 items-center gap-2 rounded-full px-3 text-sm font-medium whitespace-nowrap transition ${
              activeTab === "chat"
                ? "bg-blue-600 text-white"
                : "bg-white/[0.04] text-white/75"
            }`}
          >
            <MessageSquareIcon className="h-4 w-4" />
            Chat
          </button>

          <button
            onClick={() => setActiveTab("people")}
            className={`inline-flex h-10 items-center gap-2 rounded-full px-3 text-sm font-medium whitespace-nowrap transition ${
              activeTab === "people"
                ? "bg-blue-600 text-white"
                : "bg-white/[0.04] text-white/75"
            }`}
          >
            <UsersIcon className="h-4 w-4" />
            People
          </button>

          <button
            onClick={() => setActiveTab("attendance")}
            className={`inline-flex h-10 items-center gap-2 rounded-full px-3 text-sm font-medium whitespace-nowrap transition ${
              activeTab === "attendance"
                ? "bg-blue-600 text-white"
                : "bg-white/[0.04] text-white/75"
            }`}
          >
            <ClipboardCheckIcon className="h-4 w-4" />
            Attendance
          </button>
        </div>

        <button
          onClick={() => setShowPanel(false)}
          className="ml-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/[0.04] text-white/75 transition hover:bg-white/[0.08] hover:text-white"
        >
          <XIcon className="h-4 w-4" />
        </button>
      </div>

      <div className={`min-h-0 flex-1 overflow-y-auto p-3 ${mobile ? "pb-6" : ""}`}>
        {activeTab === "chat" &&
          (chatError ? (
            <div className="text-sm text-white/80">{chatError}</div>
          ) : chatClient && channel ? (
            <div className="stream-chat-dark h-full min-h-0 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
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
          ) : (
            <div className="text-sm text-white/70">Chat not available.</div>
          ))}

        {activeTab === "people" && (
          <div className="space-y-4">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/45">
                Students
              </p>
              <StudentsRail participants={studentParticipants} />
            </div>

            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/45">
                Participants
              </p>
              <PeoplePanel participants={participants} lecturerId={lecturerId} />
            </div>
          </div>
        )}

        {activeTab === "attendance" && (
          <AttendancePanel
            session={session}
            lecturerId={lecturerId}
            participants={participants}
          />
        )}
      </div>
    </div>
  );
}

export default function VideoCallUI({
  chatClient,
  channel,
  chatError,
  lecturerId,
  session,
  activeLayout,
}) {
  const navigate = useNavigate();
  const {
    useCallCallingState,
    useParticipants,
    useHasOngoingScreenShare,
  } = useCallStateHooks();

  const callingState = useCallCallingState();
  const participants = useParticipants();
  const isSharing = useHasOngoingScreenShare();

  const [activeTab, setActiveTab] = useState("people");
  const [showPanel, setShowPanel] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1280);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const lecturerParticipant = useMemo(() => {
    return participants.find((p) => getParticipantId(p) === lecturerId) || null;
  }, [participants, lecturerId]);

  const studentParticipants = useMemo(() => {
    return participants.filter((p) => getParticipantId(p) !== lecturerId);
  }, [participants, lecturerId]);

  const openPanel = (tab) => {
    setActiveTab(tab);
    setShowPanel(true);
  };

  if (callingState === CallingState.JOINING) {
    return (
      <div className="flex h-full items-center justify-center bg-[#020817] text-white">
        <div className="text-center">
          <Loader2Icon className="mx-auto mb-4 h-12 w-12 animate-spin text-blue-400" />
          <p className="text-lg font-medium">Joining live class...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="str-video h-full min-h-0 bg-[#020817] text-white">
      <div className="h-full min-h-0 p-2 sm:p-3 lg:p-4">
        <div
          className={`grid h-full min-h-0 gap-3 ${
            showPanel && !isMobile
              ? "xl:grid-cols-[minmax(0,1fr)_340px]"
              : "grid-cols-1"
          }`}
        >
          <div className="flex min-h-0 flex-col">
            <div className="mb-3 flex shrink-0 items-center gap-2 overflow-x-auto pb-1">
              <button
                onClick={() => openPanel("chat")}
                className={`inline-flex h-10 items-center gap-2 rounded-full border px-3 text-sm font-medium whitespace-nowrap transition sm:px-4 ${
                  showPanel && activeTab === "chat"
                    ? "border-blue-500/40 bg-blue-600 text-white"
                    : "border-white/10 bg-white/[0.03] text-white/80"
                }`}
              >
                <MessageSquareIcon className="h-4 w-4" />
                Chat
              </button>

              <button
                onClick={() => openPanel("people")}
                className={`inline-flex h-10 items-center gap-2 rounded-full border px-3 text-sm font-medium whitespace-nowrap transition sm:px-4 ${
                  showPanel && activeTab === "people"
                    ? "border-blue-500/40 bg-blue-600 text-white"
                    : "border-white/10 bg-white/[0.03] text-white/80"
                }`}
              >
                <UsersIcon className="h-4 w-4" />
                People
              </button>

              <button
                onClick={() => openPanel("attendance")}
                className={`inline-flex h-10 items-center gap-2 rounded-full border px-3 text-sm font-medium whitespace-nowrap transition sm:px-4 ${
                  showPanel && activeTab === "attendance"
                    ? "border-blue-500/40 bg-blue-600 text-white"
                    : "border-white/10 bg-white/[0.03] text-white/80"
                }`}
              >
                <ClipboardCheckIcon className="h-4 w-4" />
                Attendance
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-hidden rounded-[24px] border border-white/10 bg-[radial-gradient(circle_at_top,#0a1730_0%,#040d1d_55%,#030916_100%)] sm:rounded-[28px]">
              <div className="flex h-full items-center justify-center px-2 py-2 sm:px-3 sm:py-3">
                <div className="w-full max-w-[920px]">
                  <div className="relative mx-auto w-full min-h-[260px] h-[52vh] max-h-[620px] overflow-hidden rounded-[20px] border border-white/10 bg-black/30 sm:min-h-[320px] sm:h-[58vh] sm:max-h-[680px] sm:rounded-[22px] lg:h-[62vh] lg:max-h-[370px]">
{!lecturerParticipant ? (
  <div className="flex h-full items-center justify-center text-center text-white/60">
    <div className="px-6">
      <p className="text-base font-semibold text-white">
        Lecturer has not joined yet
      </p>
      <p className="mt-1 text-sm text-white/60">
        Students can wait here until the lecturer joins.
      </p>
    </div>
  </div>
) : isSharing ? (
  <div className="relative h-full w-full overflow-hidden bg-black">
    <div
      className="
        h-full w-full overflow-hidden
        [&_.str-video__participant-details]:hidden
        [&_.str-video__speaker-layout__participants-bar]:hidden
        [&_.str-video__speaker-layout__thumbnails]:hidden
        [&_.str-video__speaker-layout__participants]:hidden
      "
    >
      <SpeakerLayout />
    </div>

  <div className="absolute left-3 top-3 z-30 rounded-2xl border border-white/10 bg-black/60 px-3 py-2 shadow-lg backdrop-blur-md">
  <p className="max-w-[180px] truncate text-sm font-semibold leading-none text-white">
    {getParticipantName(lecturerParticipant)}
  </p>
  <p className="mt-1 text-[11px] leading-none text-white/75">Presenting</p>
</div>
  </div>
) : (
  <div className="relative h-full w-full overflow-hidden">
    <ParticipantView
      participant={lecturerParticipant}
      className="h-full w-full"
    />

<div className="absolute left-2 top-2 z-20 rounded-full bg-black/55 px-3 py-1.5 backdrop-blur-md">
  <p className="text-xs font-semibold text-white">
    {getParticipantName(lecturerParticipant)}
  </p>
  <p className="text-[10px] text-white/70">Lecturer</p>
</div>
  </div>
)}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-3 flex shrink-0 justify-center px-2 pb-[max(8px,env(safe-area-inset-bottom))] sm:mt-4">
  <div className="w-full max-w-full overflow-visible">
    <div className="mx-auto flex w-fit max-w-full items-center justify-center rounded-full border border-white/10 bg-[#081426]/95 px-2 py-2 shadow-[0_10px_35px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:px-3">
      <div className="overflow-visible">
        <CallControls onLeave={() => navigate(-1)} />
      </div>
    </div>
  </div>
</div>
          </div>

          {showPanel && !isMobile && (
            <div className="min-h-[320px] xl:min-h-0">
              <RightPanel
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                setShowPanel={setShowPanel}
                chatClient={chatClient}
                channel={channel}
                chatError={chatError}
                participants={participants}
                lecturerId={lecturerId}
                session={session}
                studentParticipants={studentParticipants}
              />
            </div>
          )}
        </div>
      </div>

      {showPanel && isMobile && (
        <div className="fixed inset-0 z-50 xl:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
            onClick={() => setShowPanel(false)}
          />
          <div className="absolute inset-x-0 bottom-0 h-[78vh] min-h-[420px] max-h-[78vh] px-2 pb-2">
            <RightPanel
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              setShowPanel={setShowPanel}
              chatClient={chatClient}
              channel={channel}
              chatError={chatError}
              participants={participants}
              lecturerId={lecturerId}
              session={session}
              studentParticipants={studentParticipants}
              mobile
            />
          </div>
        </div>
      )}
    </div>
  );
}