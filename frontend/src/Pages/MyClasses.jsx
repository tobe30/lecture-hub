import { Link } from "react-router-dom";
import {
  Plus,
  BookOpen,
  Users,
  ArrowRight,
  Video,
  Pencil,
  Trash2,
  MoreVertical,
  Loader2,
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { deleteClass, getClasses } from "../lib/api";
import toast from "react-hot-toast";

export default function MyClasses() {
  const queryClient = useQueryClient();
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["class"],
    queryFn: getClasses,
  });

  const classes = data?.classes || [];

  const { mutate: deleteClassMutation, isPending: isDeleting } = useMutation({
    mutationFn: deleteClass,
    onSuccess: (data) => {
      toast.success(data.message || "Class deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["class"] });
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to delete class"
      );
    },
  });

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this class?"
    );

    if (!confirmDelete) return;

    deleteClassMutation(id);
    setOpenMenuId(null);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

if (isLoading) {
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin mx-auto mb-3 text-[#3b82f6]" />
          <p className="text-sm text-slate-500">Loading Classes...</p>
        </div>
      </div>
    );
  }
  if (error) {
    return <div className="p-6 text-red-500">Failed to load classes</div>;
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-[24px] font-bold text-[#111827]">My Classes</h1>
          <p className="mt-1 text-[15px] text-[#64748b]">
            Manage all your lecture classes
          </p>
        </div>

        <Link
          to="/dashboard/create-class"
          className="inline-flex items-center gap-2 rounded-[12px] bg-[#3b82f6] px-4 py-2.5 text-[14px] font-semibold text-white hover:bg-[#2563eb]"
        >
          <Plus className="h-4 w-4" />
          New Class
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {classes.map((cls) => (
          <div
            key={cls._id}
            className="flex flex-col rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)]"
          >
            <div className="mb-3 flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef4ff]">
                <BookOpen className="h-5 w-5 text-[#3b82f6]" />
              </div>

              <div className="relative" ref={openMenuId === cls._id ? menuRef : null}>
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      cls.isActive
                        ? "bg-green-500/10 text-green-600"
                        : "bg-[#f1f5f9] text-[#64748b]"
                    }`}
                  >
                    {cls.isActive ? "Active" : "Completed"}
                  </span>

                  <button
                    onClick={() =>
                      setOpenMenuId(openMenuId === cls._id ? null : cls._id)
                    }
                    className="flex h-8 w-8 items-center justify-center rounded-full text-[#6b7280] hover:bg-[#f3f4f6]"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>

                {openMenuId === cls._id && (
                  <div className="absolute right-0 top-10 z-20 w-40 rounded-2xl border border-[#e5e7eb] bg-white py-2 shadow-[0_12px_30px_rgba(15,23,42,0.12)]">
                    <Link
                      to={`/dashboard/edit-class/${cls._id}`}
                      onClick={() => setOpenMenuId(null)}
                      className="flex w-full items-center gap-3 px-4 py-3 text-[14px] font-medium text-[#111827] hover:bg-[#f8fafc]"
                    >
                      <Pencil className="h-4 w-4" />
                      Edit
                    </Link>

                    <button
                      onClick={() => handleDelete(cls._id)}
                      className="flex w-full items-center gap-3 px-4 py-3 text-[14px] font-medium text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>

            <h3 className="text-[15px] font-bold text-[#111827] line-clamp-1">
              {cls.title}
            </h3>

            <p className="mt-1 text-[13px] text-[#64748b] line-clamp-1">
              {cls.courseCode} · Class Code: {cls.classCode}
            </p>

            <div className="mt-3 flex items-center gap-4 text-[13px] text-[#64748b]">
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                {cls.students?.length || 0}
              </span>
<span className="flex items-center gap-1">
  <Video className="h-3.5 w-3.5" />
  {cls.sessionCount || 0} sessions
</span>
            </div>

            <div className="mt-auto pt-5">
              <Link
                to="/dashboard/sessions"
                className="inline-flex items-center gap-1 text-[15px] font-semibold text-[#4f6ef7] hover:underline"
              >
                Start Session
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}