import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, Plus } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { createClass } from "../lib/api";

const CreateClass = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [schedule, setSchedule] = useState("");
  const [capacity, setCapacity] = useState("");

  const { mutate: addClass, isPending } = useMutation({
    mutationFn: createClass,
    onSuccess: () => {
      toast.success("Class created successfully!");
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      navigate("/dashboard/classes");
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
          "An error occurred during class creation."
      );
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || !code) {
      toast.error("Title and course code are required");
      return;
    }

    addClass({
      title,
      courseCode: code,
      description,
      schedule,
      capacity: capacity ? Number(capacity) : 0,
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

      
       <div className="mb-7 flex items-start gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eef4ff]">
              <BookOpen className="h-5 w-5 text-[#4f8dfd]" />
            </div>

            <div>
              <h1 className="text-[20px] font-bold leading-none text-[#111827]">
                Create New Class
              </h1>
              <p className="mt-1.5 text-[15px] text-[#64748b]">
                Set up a new lecture class for your students.
              </p>
            </div>
          </div>

      <div className="rounded-2xl border border-[#e5e7eb] bg-white px-7 py-7 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-[15px] font-medium text-[#111827]">
              Class Title
            </label>
            <input
              type="text"
              placeholder="e.g. Human Computer Interaction"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-11 w-full rounded-[12px] border border-[#dbe2ea] bg-white px-4 text-[15px] text-[#111827] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/20"
            />
          </div>

          <div>
            <label className="mb-2 block text-[15px] font-medium text-[#111827]">
              Course Code
            </label>
            <input
              type="text"
              placeholder="e.g. CSC 421"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="h-11 w-full rounded-[12px] border border-[#dbe2ea] bg-white px-4 text-[15px] text-[#111827] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/20"
            />
          </div>

          <div>
            <label className="mb-2 block text-[15px] font-medium text-[#111827]">
              Description
            </label>
            <textarea
              rows={4}
              placeholder="Brief description of the class..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-[12px] border border-[#dbe2ea] bg-white px-4 py-3 text-[15px] text-[#111827] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/20 resize-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-[15px] font-medium text-[#111827]">
              Schedule
            </label>
            <input
              type="text"
              placeholder="e.g. Mondays & Wednesdays, 10:00 AM"
              value={schedule}
              onChange={(e) => setSchedule(e.target.value)}
              className="h-11 w-full rounded-[12px] border border-[#dbe2ea] bg-white px-4 text-[15px] text-[#111827] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/20"
            />
          </div>

          <div>
            <label className="mb-2 block text-[15px] font-medium text-[#111827]">
              Capacity
            </label>
            <input
              type="number"
              min="0"
              placeholder="e.g. 50"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              className="h-11 w-full rounded-[12px] border border-[#dbe2ea] bg-white px-4 text-[15px] text-[#111827] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/20"
            />
          </div>

          <div className="mt-6 flex items-center justify-end gap-3 border-t border-[#e5e7eb] pt-5">
            <Link
              to="/dashboard/classes"
              className="flex h-11 items-center rounded-[12px] border border-[#dbe2ea] bg-white px-6 text-[15px] font-semibold text-[#111827] hover:bg-[#f8fafc]"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={isPending}
              className="inline-flex h-11 items-center gap-2 rounded-[12px] bg-[#3b82f6] px-6 text-[15px] font-semibold text-white transition hover:bg-[#2563eb] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isPending ? (
                "Creating..."
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Create Class
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateClass;