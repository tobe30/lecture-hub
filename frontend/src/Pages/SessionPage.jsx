import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { StreamCall, StreamVideo } from "@stream-io/video-react-sdk";
import {
  Loader2Icon,
  LogOutIcon,
  PhoneOffIcon,
  MonitorPlayIcon,
  PanelRightCloseIcon,
  PanelRightOpenIcon,
} from "lucide-react";

import VideoCallUI from "./VideoCallUI";
import useStreamClient from "../hooks/useStreamClient";
import {
  endSession,
  getAuthUser,
  getSessionById,
  JoinSession,
} from "../lib/api";

export default function SessionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [activeLayout, setActiveLayout] = useState("speaker");
  const [showSidebar, setShowSidebar] = useState(true);
  const [showEndedScreen, setShowEndedScreen] = useState(false);

  const redirectTimeoutRef = useRef(null);
  const hasJoinedRef = useRef(false);

  const { data: authData } = useQuery({
    queryKey: ["authUser"],
    queryFn: getAuthUser,
  });

  const {
    data: sessionData,
    isLoading: loadingSession,
    refetch,
  } = useQuery({
    queryKey: ["session", id],
    queryFn: () => getSessionById(id),
    enabled: !!id,
  });

  const joinSessionMutation = useMutation({
    mutationFn: JoinSession,
    retry: false,
    onSuccess: async () => {
      await refetch();
    },
    onError: () => {
      hasJoinedRef.current = false;
    },
  });

  const endSessionMutation = useMutation({
    mutationFn: endSession,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["session", id] });
      setShowEndedScreen(true);

      redirectTimeoutRef.current = setTimeout(() => {
        navigate("/dashboard/classes", { replace: true });
      }, 1800);
    },
  });

  const user = authData?.user;
  const currentUserId = user?._id;
  const session = sessionData?.session;

  const isLecturer = session?.lecturer?._id === currentUserId;

  const isClassStudent =
    session?.class?.students?.some((student) => {
      if (typeof student === "string") return student === currentUserId;
      return student?._id === currentUserId;
    }) || false;

  const isAttendee =
    session?.attendees?.some((attendee) => {
      const attendeeId =
        typeof attendee?.student === "string"
          ? attendee.student
          : attendee?.student?._id;

      return attendeeId === currentUserId;
    }) || false;

  const canJoin = Boolean(isLecturer || isClassStudent || isAttendee);
  const isSessionEnded = session?.status === "completed";

  useEffect(() => {
    if (!id || !session || loadingSession || !currentUserId) return;
    if (session.status !== "active") return;
    if (isLecturer) return;
    if (!isClassStudent) return;
    if (isAttendee) return;
    if (joinSessionMutation.isPending) return;
    if (hasJoinedRef.current) return;

    hasJoinedRef.current = true;
    joinSessionMutation.mutate(id);
  }, [
    id,
    session?.status,
    loadingSession,
    currentUserId,
    isLecturer,
    isClassStudent,
    isAttendee,
    joinSessionMutation.isPending,
  ]);

  useEffect(() => {
    if (!session || loadingSession) return;

    if (session.status === "completed") {
      setShowEndedScreen(true);

      redirectTimeoutRef.current = setTimeout(() => {
        if (isLecturer) {
          navigate("/dashboard/classes", { replace: true });
        } else {
          navigate("/student/classes", { replace: true });
        }
      }, 1800);
    }

    return () => {
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
      }
    };
  }, [session?.status, loadingSession, isLecturer, navigate]);

  const {
    streamClient,
    call,
    chatClient,
    channel,
    chatError,
    isInitializingCall,
  } = useStreamClient(
    session,
    loadingSession || isSessionEnded,
    canJoin && !isSessionEnded,
    session?.options?.chatEnabled ?? true
  );

  const handleEndSession = () => {
    const confirmed = window.confirm(
      "Are you sure you want to end this session? All students will be disconnected."
    );

    if (!confirmed) return;
    endSessionMutation.mutate(id);
  };

  if (loadingSession) {
    return (
      <div className="h-screen bg-[#020817] flex items-center justify-center text-white">
        <div className="text-center">
          <Loader2Icon className="w-12 h-12 mx-auto animate-spin text-blue-500 mb-4" />
          <p className="text-lg">Loading session...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="h-screen bg-[#020817] flex items-center justify-center p-6 text-white">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center">
          <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <PhoneOffIcon className="w-12 h-12 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold">Session Not Found</h2>
          <p className="text-white/70 mt-2">
            This live session does not exist or is no longer available.
          </p>
        </div>
      </div>
    );
  }

  if (!canJoin && !joinSessionMutation.isPending) {
    return (
      <div className="h-screen bg-[#020817] flex items-center justify-center p-6 text-white">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center">
          <div className="w-24 h-24 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <PhoneOffIcon className="w-12 h-12 text-yellow-400" />
          </div>
          <h2 className="text-2xl font-bold">Access Denied</h2>
          <p className="text-white/70 mt-2">
            You are not allowed to join this live class session.
          </p>
        </div>
      </div>
    );
  }

  if (showEndedScreen || session?.status === "completed") {
    return (
      <div className="h-screen bg-[#020817] flex items-center justify-center p-6 text-white">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center">
          <div className="w-24 h-24 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <PhoneOffIcon className="w-12 h-12 text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold">Session Ended</h2>
          <p className="text-white/70 mt-2">
            This live session has ended. Redirecting you back to your dashboard...
          </p>
          <Loader2Icon className="w-6 h-6 mx-auto mt-5 animate-spin text-blue-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden bg-[#020817] text-white flex flex-col">
      <div className="shrink-0 border-b border-white/10 bg-[#030c1a] px-3 sm:px-4 lg:px-6 py-3">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="truncate text-lg sm:text-xl font-semibold">
                {session.class?.title || session.title}
              </h1>

              {session.class?.courseCode && (
                <span className="rounded-full border border-blue-400/20 bg-blue-500/15 px-3 py-1 text-xs font-medium text-blue-300">
                  {session.class.courseCode}
                </span>
              )}

              <span className="rounded-full border border-emerald-400/20 bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-300">
                {session.status}
              </span>
            </div>

            <p className="mt-1 truncate text-sm text-white/60">
              Lecturer: {session.lecturer?.name}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setActiveLayout("speaker")}
              className={`inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-medium transition ${
                activeLayout === "speaker"
                  ? "border-blue-500/40 bg-blue-600 text-white"
                  : "border-white/10 bg-white/[0.03] text-white/80"
              }`}
            >
              <MonitorPlayIcon className="h-4 w-4" />
              Speaker
            </button>

            <button
              type="button"
              onClick={() => setShowSidebar((prev) => !prev)}
              className="inline-flex h-10 w-10 xl:hidden items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/80"
            >
              {showSidebar ? (
                <PanelRightCloseIcon className="h-4 w-4" />
              ) : (
                <PanelRightOpenIcon className="h-4 w-4" />
              )}
            </button>

            {isLecturer && session.status === "active" && (
              <button
                onClick={handleEndSession}
                disabled={endSessionMutation.isPending}
                className="inline-flex h-10 items-center gap-2 rounded-full bg-red-500 px-4 text-sm font-medium text-white hover:bg-red-600 transition"
              >
                {endSessionMutation.isPending ? (
                  <Loader2Icon className="w-4 h-4 animate-spin" />
                ) : (
                  <LogOutIcon className="w-4 h-4" />
                )}
                End Session
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        {joinSessionMutation.isPending || isInitializingCall ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <Loader2Icon className="w-12 h-12 mx-auto animate-spin text-blue-500 mb-4" />
              <p className="text-lg">
                {joinSessionMutation.isPending
                  ? "Joining live session..."
                  : "Connecting to live session..."}
              </p>
            </div>
          </div>
        ) : !streamClient || !call ? (
          <div className="h-full flex items-center justify-center p-6">
            <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center">
              <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <PhoneOffIcon className="w-12 h-12 text-red-400" />
              </div>
              <h2 className="text-2xl font-bold">Connection Failed</h2>
              <p className="text-white/70 mt-2">
                Unable to connect to the live class session.
              </p>
            </div>
          </div>
        ) : (
          <div className="h-full">
            <StreamVideo client={streamClient}>
              <StreamCall call={call}>
                <VideoCallUI
                  chatClient={chatClient}
                  channel={channel}
                  chatError={chatError}
                  lecturerId={session.lecturer?._id}
                  session={session}
                  activeLayout={activeLayout}
                  showSidebar={showSidebar}
                />
              </StreamCall>
            </StreamVideo>
          </div>
        )}
      </div>
    </div>
  );
}