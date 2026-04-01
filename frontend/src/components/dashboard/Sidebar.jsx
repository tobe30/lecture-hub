import React from "react";
import {
  BookOpen,
  LayoutDashboard,
  UserCheck,
  Users,
  Video,
  VideoIcon,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const sidebarLinks = [
  { name: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
  { name: "My Classes", icon: BookOpen, to: "/dashboard/classes" },
  { name: "Live Sessions", icon: VideoIcon, to: "/dashboard/sessions" },
  { name: "Students", icon: Users, to: "/dashboard/students" },
  { name: "Attendance", icon: UserCheck, to: "/dashboard/attendance" },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="flex min-h-full w-[250px] flex-col border-r border-[#e5e7eb] bg-white">
      <div className="flex h-[68px] items-center border-b border-[#e5e7eb] px-5">
        <div className="flex items-center gap-3">
<div className="flex items-center justify-center">
  <img
    src="/lh-logo.png"
    alt="LectureHub logo"
    className="h-10 w-auto object-contain"
  />
</div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-1.5">
          {sidebarLinks.map((item) => {
            const isActive =
              location.pathname === item.to ||
              (item.to !== "/dashboard" && location.pathname.startsWith(item.to));

            return (
              <li key={item.name}>
                <Link
                  to={item.to}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-[15px] font-medium transition ${
                    isActive
                      ? "bg-[#edf4ff] text-[#3b82f6]"
                      : "text-[#475569] hover:bg-[#f8fafc] hover:text-[#165DFF]"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;