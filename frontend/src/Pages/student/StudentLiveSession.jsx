import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mic,
  MicOff,
  VideoIcon,
  VideoOff,
  MessageSquare,
  Hand,
  LogOut,
  Users,
  Radio,
  User,
} from "lucide-react";

const chatMessages = [
  { name: "Dr. Sarah", role: "Lecturer", text: "Welcome to today's session on UI evaluation.", time: "10:01 AM" },
  { name: "David", role: "You", text: "Good morning!", time: "10:02 AM" },
  { name: "Grace", role: "Student", text: "Can we go over heuristic evaluation again?", time: "10:03 AM" },
  { name: "Dr. Sarah", role: "Lecturer", text: "Sure, let me pull up the slides.", time: "10:04 AM" },
  { name: "James", role: "Student", text: "Thanks!", time: "10:04 AM" },
];

const participants = [
  { name: "Dr. Sarah", role: "Lecturer", online: true },
  { name: "David", role: "You", online: true },
  { name: "Grace", role: "Student", online: true },
  { name: "James", role: "Student", online: true },
  { name: "Fatima", role: "Student", online: true },
  { name: "Kelvin", role: "Student", online: false },
];

export default function StudentLiveSession() {
  const navigate = useNavigate();
  const [mic, setMic] = useState(false);
  const [cam, setCam] = useState(false);
  const [tab, setTab] = useState("chat");
  const [raised, setRaised] = useState(false);

  return (
    <div className="flex h-screen flex-col bg-[#0f172a] text-white">
      {/* Top bar */}
      <header className="flex h-12 items-center justify-between border-b border-white/10 px-5">
        <div className="flex items-center gap-3">
          <h1 className="text-sm font-bold">Human Computer Interaction</h1>
          <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs font-medium text-white/80">
            HCI421
          </span>
          <span className="flex items-center gap-1 rounded-full border border-red-400/20 bg-red-500/15 px-2 py-0.5 text-xs font-semibold text-red-400">
            <Radio className="h-3 w-3 animate-pulse" />
            Live
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-white/60">
          <Users className="h-3.5 w-3.5" />
          24 students · Dr. Sarah
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Main video */}
        <div className="flex flex-1 flex-col">
          <div className="flex flex-1 items-center justify-center p-4">
            <div className="relative aspect-video w-full max-w-4xl rounded-2xl border border-white/10 bg-black/30 shadow-[0_1px_2px_rgba(0,0,0,0.2)] flex items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/5">
                  <User className="h-8 w-8 text-white/40" />
                </div>
                <p className="text-sm text-white/70">Dr. Sarah</p>
                <p className="text-xs text-white/35">Lecturer</p>
              </div>

              {/* Self view */}
              <div className="absolute bottom-4 right-4 flex h-28 w-40 items-center justify-center rounded-xl border border-white/10 bg-black/40 shadow-[0_1px_2px_rgba(0,0,0,0.2)]">
                <div className="text-center">
                  <div className="mx-auto mb-1 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5">
                    <User className="h-4 w-4 text-white/40" />
                  </div>
                  <p className="text-xs text-white/50">You</p>
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-3 border-t border-white/10 px-4 py-3">
            <button
              onClick={() => setMic(!mic)}
              className={`flex h-11 w-11 items-center justify-center rounded-full border transition-colors ${
                mic
                  ? "border-white/10 bg-white/10 text-white"
                  : "border-red-400/20 bg-red-500/20 text-red-400"
              }`}
            >
              {mic ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
            </button>

            <button
              onClick={() => setCam(!cam)}
              className={`flex h-11 w-11 items-center justify-center rounded-full border transition-colors ${
                cam
                  ? "border-white/10 bg-white/10 text-white"
                  : "border-red-400/20 bg-red-500/20 text-red-400"
              }`}
            >
              {cam ? <VideoIcon className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
            </button>

            <button
              onClick={() => setTab("chat")}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white transition-colors hover:bg-white/15"
            >
              <MessageSquare className="h-5 w-5" />
            </button>

            <button
              onClick={() => setRaised(!raised)}
              className={`flex h-11 w-11 items-center justify-center rounded-full border transition-colors ${
                raised
                  ? "border-yellow-400/20 bg-yellow-500/20 text-yellow-400"
                  : "border-white/10 bg-white/10 text-white hover:bg-white/15"
              }`}
            >
              <Hand className="h-5 w-5" />
            </button>

            <button
              onClick={() => navigate("/student")}
              className="flex h-11 items-center gap-2 rounded-full border border-red-500 bg-red-500 px-5 text-sm font-semibold text-white transition-colors hover:bg-red-600"
            >
              <LogOut className="h-4 w-4" />
              Leave
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="flex w-72 flex-col border-l border-white/10 bg-black/20">
          {/* Tabs */}
          <div className="flex border-b border-white/10">
            {["chat", "participants"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-2.5 text-xs font-semibold uppercase tracking-wide transition-colors ${
                  tab === t
                    ? "border-b-2 border-[#3b82f6] text-white"
                    : "text-white/40 hover:text-white/60"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto p-3">
            {tab === "chat" ? (
              <div className="space-y-3">
                {chatMessages.map((m, i) => (
                  <div
                    key={i}
                    className="rounded-[12px] border border-white/10 bg-white/[0.03] p-3"
                  >
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs font-semibold text-white">
                        {m.name}
                      </span>
                      <span className="text-[10px] text-white/30">
                        {m.role} · {m.time}
                      </span>
                    </div>
                    <p className="mt-0.5 text-sm text-white/70">{m.text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {participants.map((p, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-[12px] border border-white/10 bg-white/[0.03] px-3 py-2"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/10">
                      <User className="h-3.5 w-3.5 text-white/50" />
                    </div>

                    <div className="flex-1">
                      <p className="text-xs font-medium text-white">{p.name}</p>
                      <p className="text-[10px] text-white/40">{p.role}</p>
                    </div>

                    <span
                      className={`h-2 w-2 rounded-full ${
                        p.online ? "bg-green-400" : "bg-white/20"
                      }`}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Chat input */}
          {tab === "chat" && (
            <div className="border-t border-white/10 p-3">
              <input
                type="text"
                placeholder="Type a message..."
                className="h-10 w-full rounded-[12px] border border-white/10 bg-white/10 px-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-[#3b82f6]"
              />
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}