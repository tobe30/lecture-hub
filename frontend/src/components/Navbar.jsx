import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAuthUser } from "../lib/api";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const { data: authData } = useQuery({
    queryKey: ["authUser"],
    queryFn: getAuthUser,
    retry: false,
  });

  const user = authData?.user;

  const dashboardPath =
    user?.role === "instructor"
      ? "/dashboard"
      : user?.role === "student"
      ? "/student/dashboard"
      : "/dashboard";

  return (
    <header className="w-full border-b border-gray-100 bg-white">
      <nav className="mx-auto flex h-[90px] max-w-[1000px] items-center justify-between px-2 lg:px-0">
        <div className="mt-3 flex items-center">
          <img
            src="/lh-logo.png"
            alt="logo"
            className="h-[30px] w-auto origin-left scale-[1.4] object-contain"
          />
        </div>

        <ul className="hidden items-center gap-7 lg:flex">
          <li>
            <a
              href="#Home"
              className="text-[15px] font-medium text-gray-800 hover:text-[#165DFF]"
            >
              Home
            </a>
          </li>

          <li>
            <a
              href="#features"
              className="text-[15px] font-medium text-gray-800 hover:text-[#165DFF]"
            >
              Features
            </a>
          </li>

          <li>
            <a
              href="#testimonials"
              className="text-[15px] font-medium text-gray-800 hover:text-[#165DFF]"
            >
              Testimonials
            </a>
          </li>

          <li>
            <a
              href="#solutions"
              className="text-[15px] font-medium text-gray-800 hover:text-[#165DFF]"
            >
              Solutions
            </a>
          </li>
        </ul>

        <div className="hidden items-center gap-3 lg:flex">
          {user ? (
            <Link to={dashboardPath}>
              <button className="h-[36px] rounded-full bg-[#165DFF] px-5 text-[14px] font-medium text-white transition hover:bg-[#0f4fe0]">
                Dashboard
              </button>
            </Link>
          ) : (
            <>
              <Link to="/login">
                <button className="h-[36px] rounded-full px-4 text-[14px] font-medium text-gray-700 hover:text-[#165DFF]">
                  Login
                </button>
              </Link>

              <Link to="/register">
                <button className="h-[36px] rounded-full bg-[#165DFF] px-4 text-[14px] font-medium text-white transition hover:bg-[#0f4fe0]">
                  Sign Up
                </button>
              </Link>
            </>
          )}
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 lg:hidden"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {isOpen && (
        <div className="border-t border-gray-100 bg-white px-6 pb-6 pt-4 lg:hidden">
          <ul className="flex flex-col gap-4">
            <li>
              <a href="#" className="text-[15px] font-medium text-gray-800">
                Home
              </a>
            </li>

            <li>
              <a href="#" className="text-[15px] font-medium text-gray-800">
                Features
              </a>
            </li>

            <li>
              <a href="#" className="text-[15px] font-medium text-gray-800">
                Product
              </a>
            </li>

            <li>
              <a href="#" className="text-[15px] font-medium text-gray-800">
                Solutions
              </a>
            </li>
          </ul>

          <div className="mt-5 flex flex-col gap-3">
            {user ? (
              <Link to={dashboardPath} onClick={() => setIsOpen(false)}>
                <button className="h-[40px] w-full rounded-full bg-[#165DFF] font-medium text-white">
                  Dashboard
                </button>
              </Link>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsOpen(false)}>
                  <button className="h-[40px] w-full rounded-full border border-gray-200 text-gray-700">
                    Login
                  </button>
                </Link>

                <Link to="/register" onClick={() => setIsOpen(false)}>
                  <button className="h-[40px] w-full rounded-full bg-[#165DFF] font-medium text-white">
                    Sign Up
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}