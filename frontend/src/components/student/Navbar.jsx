import React from "react";
import { Menu, LogOut } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getAuthUser, logout } from "../../lib/api";

const Navbar = () => {
  const navigate = useNavigate();

  // ✅ Get logged-in user
  const { data } = useQuery({
    queryKey: ["authUser"],
    queryFn: getAuthUser,
  });

  const user = data?.user;

  // ✅ Logout
  const { mutate: logoutUser, isPending } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      toast.success("Logged out successfully");
      navigate("/login");
    },
    onError: () => {
      toast.error("Logout failed");
    },
  });

  // ✅ Initials generator
  const getInitials = (name = "") => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="flex h-[68px] items-center justify-between border-b border-[#e5e7eb] bg-white px-4 lg:px-6">
      {/* LEFT */}
      <div className="flex items-center gap-3">
        <label
          htmlFor="dashboard-drawer"
          className="btn btn-ghost btn-sm lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </label>

        <div className="relative hidden sm:block">
          <input
            type="text"
            placeholder="Search classes, sessions..."
            className="h-[40px] w-[260px] rounded-2xl border border-[#d9dee8] bg-[#f8fafc] pl-10 pr-4 text-sm text-[#475569] outline-none placeholder:text-[#64748b] focus:border-[#165DFF]"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-4.35-4.35m1.85-5.15a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
            />
          </svg>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        {/* USER INFO */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e8eefc] text-sm font-semibold text-[#165DFF]">
            {getInitials(user?.name)}
          </div>

          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-[#0f172a]">
              {user?.name || "Student"}
            </p>
            <p className="text-xs text-[#64748b] capitalize">
              {user?.role || "student"}
            </p>
          </div>
        </div>

        {/* LOGOUT */}
        <button
          onClick={logoutUser}
          disabled={isPending}
          className="flex items-center gap-2 rounded-xl border border-[#e5e7eb] px-3 py-2 text-sm text-[#475569] hover:bg-[#f1f5f9] transition"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;