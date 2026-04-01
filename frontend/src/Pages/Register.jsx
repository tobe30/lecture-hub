import React, { useState } from "react";
import {
  GraduationCap,
  BookOpen,
  Users,
  Eye,
  EyeOff,
  BarChart3,
  Smartphone,
  Target,
  UserPlus,
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signup } from "../lib/api";

export default function Register() {
  const [role, setRole] = useState("instructor");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

console.log({
  ...formData,
  role,
});
  const queryClient = useQueryClient();

  const {mutate:registerMutation, isPending, error} = useMutation({
    mutationFn:signup,
    onSuccess:()=> queryClient.invalidateQueries({ queryKey: ["authUser"] }),
  })

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  const handleSubmit = (e) => {
    e.preventDefault();
      registerMutation({
    ...formData,
    role,
  });

  };

  const features = [
    { icon: BookOpen, title: "Live Attendance", subtitle: "Real-time tracking" },
    { icon: Target, title: "Smart Quizzes", subtitle: "Engage students" },
    { icon: Smartphone, title: "Mobile Ready", subtitle: "Join from anywhere" },
    { icon: BarChart3, title: "Analytics", subtitle: "Track progress" },
  ];

  return (
    <div className="min-h-screen bg-[#f3f4f6] p-2 md:p-4">
      <div className="mx-auto flex min-h-[96vh] w-full max-w-[1360px] overflow-hidden rounded-[20px] bg-white shadow-sm">

        {/* LEFT */}
        <section className="relative hidden w-1/2 overflow-hidden bg-gradient-to-br from-[#4f8df7] via-[#4a86f0] to-[#3d7deb] lg:flex lg:flex-col lg:items-center lg:justify-center">
          <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-white/6" />
          <div className="absolute -bottom-20 right-[-40px] h-56 w-56 rounded-full bg-white/10" />

          <div className="relative z-10 flex max-w-[520px] flex-col items-center px-10 text-center text-white">
            <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-[18px] bg-white/18">
              <GraduationCap className="h-10 w-10" />
            </div>

            <h1 className="mb-5 text-5xl font-bold">Join AttendEase</h1>
            <p className="mb-14 max-w-[460px] text-2xl text-white/90">
              Simplify attendance tracking, engage students with
              live quizzes, and manage your classes effortlessly.
            </p>

            <div className="grid w-full max-w-[420px] grid-cols-2 gap-4">
              {features.map((f) => {
                const Icon = f.icon;
                return (
                  <div key={f.title} className="rounded-2xl bg-white/10 p-6 text-left">
                    <Icon className="mb-4 h-7 w-7" />
                    <h3 className="text-xl font-semibold">{f.title}</h3>
                    <p className="text-white/80">{f.subtitle}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* RIGHT */}
        <section className="flex w-full items-center justify-center bg-[#f8f8f9] px-4 py-8 lg:w-1/2">
          <div className="w-full max-w-[430px]">

            <h2 className="text-[40px] font-bold">Create account</h2>
            <p className="mb-6 text-[#64748b]">Get started with your free account</p>


              {error && (
            <div className="mb-4 rounded-lg border border-red-400 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-sm">
              <span className="font-medium">Error: </span>
              {error?.response?.data?.error ||
                error?.response?.data?.message ||
                error.message ||
                "Something went wrong. Please try again."}
            </div>
          )}
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* ROLE */}
              <div>
                <p className="mb-3 font-medium">I am a</p>
                <div className="grid grid-cols-2 gap-3">

                  <button
                    type="button"
                    onClick={() => setRole("student")}
                    className={`rounded-xl border p-5 text-center ${
                      role === "student" ? "border-blue-500" : "border-gray-300"
                    }`}
                  >
                    <BookOpen className="mx-auto mb-2" />
                    Student
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole("instructor")}
                    className={`rounded-xl border p-5 text-center ${
                      role === "instructor" ? "border-blue-500" : "border-gray-300"
                    }`}
                  >
                    <Users className="mx-auto mb-2" />
                    Lecturer
                  </button>

                </div>
              </div>

              {/* FULL NAME */}
              <div>
                <label className="block mb-1">Full name</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                required
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* EMAIL */}
              <div>
                <label className="block mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="name@university.edu"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* PASSWORD */}
              <div>
                <label className="block mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="******"
                    required
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>

              <button type="submit" className="w-full bg-blue-500 text-white p-3 rounded-lg flex items-center justify-center gap-2">
                {isPending ?(
                  <>
                    <span className="loading loading-spinner loading-xs"></span>
                         Loading...                
                  </>
                ) : (
<>
<UserPlus /> Create account
</>
                )
              
              }
              </button>

            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
