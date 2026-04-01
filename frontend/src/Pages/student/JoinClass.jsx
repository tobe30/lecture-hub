import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Video, ArrowRight } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { joinClass } from "../../lib/api";
import toast from "react-hot-toast";

export default function JoinClass() {
  const navigate = useNavigate();
  const [classCode, setClassCode] = useState("");


  const queryClient = useQueryClient();

   const { mutate: addClass, isPending } = useMutation({
    mutationFn: joinClass,
    onSuccess: () => {
      toast.success("Class joined successfully!");
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      navigate("/student/classes");
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
          "An error occurred during class joining."
      );
    },
  });

const handleSubmit = (e) => {
    e.preventDefault();

    if (!classCode) {
      toast.error("Title and course code are required");
      return;
    }

    addClass({
      classCode,
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8fafc] p-4">

      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="mb-8 flex items-center justify-center gap-3">

          <div className="flex items-center justify-center">
  <img
    src="/lh-logo.png"
    alt="LectureHub logo"
    className="h-10 w-auto object-contain"
  />
</div>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">

          <h1 className="mb-1 text-center text-[20px] font-bold text-[#111827]">
            Join a Class
          </h1>

          <p className="mb-6 text-center text-[14px] text-[#64748b]">
            Enter your class code to join a lecture class on LectureHub
          </p>

          <div className="space-y-4">

            <div>
              <label className="mb-1.5 block text-[14px] font-medium text-[#111827]">
                Class Code
              </label>

              <input
                type="text"
                value={classCode}
                onChange={(e) => setClassCode(e.target.value)}
                placeholder="e.g. HCI421"
                className="h-11 w-full rounded-[12px] border border-[#dbe2ea] bg-white px-4 text-[14px] text-[#111827] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/20"
              />
            </div>
            <button
              onClick={handleSubmit}
              type="submit"
              disabled={isPending}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-[12px] bg-[#3b82f6] text-[14px] font-semibold text-white transition hover:bg-[#2563eb]"
            >

              {isPending ? (
                "Joining..."
              ) : (
                <>
                  Join Class
                   <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

          </div>
        </div>

      </div>

    </div>
  );
}