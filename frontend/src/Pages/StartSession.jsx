import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Video } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createSession, getClasses } from "../lib/api";
import toast from "react-hot-toast";

const toggles = [
  { id: "chatEnabled", label: "Enable Chat", default: true },
  { id: "raiseHandEnabled", label: "Enable Raise Hand", default: true },
  { id: "attendanceEnabled", label: "Enable Attendance Tracking", default: true },
  { id: "quizEnabled", label: "Enable Live Quiz", default: false },
];

export default function StartSession() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["class"],
    queryFn: getClasses,
  });

  const classes = data?.classes || [];

  const [formData, setFormData] = useState({
    classId: "",
    title: "",
    description: "",
    meetingCode: "",
  });

  const [toggleState, setToggleState] = useState(
    Object.fromEntries(toggles.map((t) => [t.id, t.default]))
  );

  const { mutate: addSession, isPending } = useMutation({
    mutationFn: createSession,
    onSuccess: (data) => {
      toast.success("Session created successfully!");
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      queryClient.invalidateQueries({ queryKey: ["sessions"] });

      navigate(`/session/${data.session._id}`);
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
          "An error occurred during session creation."
      );
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.classId || !formData.title) {
      toast.error("Please select a class and enter a session title");
      return;
    }

    addSession({
      classId: formData.classId,
      title: formData.title,
      description: formData.description,
      meetingCode: formData.meetingCode,
      options: toggleState,
    });
  };

  return (
    <div className="mx-auto max-w-[880px] px-6 py-8">
      <Link
        to="/dashboard"
        className="mb-6 flex items-center gap-2 text-[15px] font-medium text-[#5b6b84] hover:text-[#1e293b]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      <h1 className="mb-6 text-[22px] font-bold text-[#111827]">
        Start Live Session
      </h1>

      <div className="rounded-2xl border border-[#e5e7eb] bg-white px-7 py-7 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-[15px] font-medium text-[#111827]">
              Select Class
            </label>
            <select
              value={formData.classId}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, classId: e.target.value }))
              }
              className="h-11 w-full rounded-[12px] border border-[#dbe2ea] bg-white px-4 text-[15px] text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/20"
            >
              <option value="">
                {isLoading ? "Loading classes..." : "Select a class"}
              </option>
              {classes.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.courseCode} — {cls.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-[15px] font-medium text-[#111827]">
              Session Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="e.g. Week 8 — Usability Testing"
              className="h-11 w-full rounded-[12px] border border-[#dbe2ea] bg-white px-4 text-[15px] text-[#111827] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/20"
            />
          </div>

          <div>
            <label className="mb-2 block text-[15px] font-medium text-[#111827]">
              Meeting Code <span className="text-[#94a3b8]">(optional)</span>
            </label>
            <input
              type="text"
              value={formData.meetingCode}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  meetingCode: e.target.value,
                }))
              }
              placeholder="Auto-generated if left blank"
              className="h-11 w-full rounded-[12px] border border-[#dbe2ea] bg-white px-4 text-[15px] text-[#111827] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/20"
            />
          </div>

          <div>
            <label className="mb-2 block text-[15px] font-medium text-[#111827]">
              Description
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Brief description of the session..."
              className="w-full rounded-[12px] border border-[#dbe2ea] bg-white px-4 py-3 text-[15px] text-[#111827] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/20 resize-none"
            />
          </div>

          <div className="border-t border-[#e5e7eb] pt-5">
            <p className="mb-3 text-[15px] font-medium text-[#111827]">
              Session Options
            </p>

            <div className="space-y-3">
              {toggles.map((t) => (
                <label
                  key={t.id}
                  className="flex items-center justify-between rounded-[12px] py-1"
                >
                  <span className="text-[15px] text-[#111827]">{t.label}</span>

                  <button
                    type="button"
                    role="switch"
                    aria-checked={toggleState[t.id]}
                    onClick={() =>
                      setToggleState((s) => ({
                        ...s,
                        [t.id]: !s[t.id],
                      }))
                    }
                    className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 ${
                      toggleState[t.id] ? "bg-[#3b82f6]" : "bg-[#dbe2ea]"
                    }`}
                  >
                    <span
                      className={`absolute left-[2px] h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                        toggleState[t.id] ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </label>
              ))}
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3 border-t border-[#e5e7eb] pt-5">
            <Link
              to="/dashboard"
              className="flex h-11 items-center rounded-[12px] border border-[#dbe2ea] bg-white px-6 text-[15px] font-semibold text-[#111827] hover:bg-[#f8fafc]"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={isPending}
              className="inline-flex h-11 items-center gap-2 rounded-[12px] bg-[#3b82f6] px-6 text-[15px] font-semibold text-white hover:bg-[#2563eb] disabled:opacity-70"
            >
              <Video className="h-4 w-4" />
              {isPending ? "Starting..." : "Start Session Now"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}