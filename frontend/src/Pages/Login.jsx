import React, { useState } from "react";
import { GraduationCap, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../lib/api";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const queryClient = useQueryClient();
    // const navigate = useNavigate()

    const {mutate:loginMutation, isPending, error} = useMutation({
        mutationFn: login,
        onSuccess: async () => {
        await queryClient.invalidateQueries({queryKey: ['authUser']});
        // navigate('/dashboard');
}

    })


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation(formData);
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] p-2 md:p-4">
      <div className="mx-auto flex min-h-[96vh] w-full max-w-[1360px] overflow-hidden rounded-[20px] bg-white shadow-sm">
        <section className="relative hidden w-1/2 overflow-hidden bg-gradient-to-br from-[#4f8df7] via-[#4a86f0] to-[#3d7deb] lg:flex lg:flex-col lg:items-center lg:justify-center">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/5" />
          <div className="absolute -left-16 -bottom-16 h-44 w-44 rounded-full bg-white/10" />

          <div className="relative z-10 flex max-w-[520px] flex-col items-center px-10 text-center text-white">
            <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-[18px] bg-white/18">
              <GraduationCap className="h-10 w-10" />
            </div>

            <h1 className="mb-5 text-5xl font-bold">Welcome Back</h1>

            <p className="mb-12 max-w-[470px] text-2xl leading-relaxed text-white/90">
              Sign in to access your classes, track attendance,
              and manage your academic journey.
            </p>

            <div className="flex items-center gap-12 text-white">
              <div className="text-center">
                <h3 className="text-4xl font-bold">500+</h3>
                <p className="mt-1 text-xl text-white/85">Active Classes</p>
              </div>

              <div className="text-center">
                <h3 className="text-4xl font-bold">10K+</h3>
                <p className="mt-1 text-xl text-white/85">Students</p>
              </div>

              <div className="text-center">
                <h3 className="text-4xl font-bold">25K+</h3>
                <p className="mt-1 text-xl text-white/85">Sessions</p>
              </div>
            </div>
          </div>
        </section>

        <section className="flex w-full items-center justify-center bg-[#f8f8f9] px-4 py-8 lg:w-1/2">
          <div className="w-full max-w-[450px] rounded-2xl border border-[#d7dde7] bg-[#f8f8f9] px-7 py-8 shadow-[0_4px_10px_rgba(15,23,42,0.03)] sm:px-8">
            <h2 className="text-[42px] font-bold leading-none text-[#0f172a]">Sign in</h2>
            <p className="mt-3 text-[22px] text-[#64748b]">
              Enter your credentials to access your account
            </p>


{/* ERROR MESSAGE IF ANY */}
                          {error && (
                <div className="mb-4 rounded-lg border border-red-400 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-sm">
                  <span className="font-medium"></span>
                  {error?.response?.data?.error ||
                    error?.response?.data?.message ||
                    error.message ||
                    "Something went wrong. Please try again."}
                </div>
              )}
              
            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div>
                <label className="mb-3 block text-[22px] font-medium text-[#111827]">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@university.edu"
                  className="h-14 w-full rounded-xl border border-gray-300 bg-[#f1f5f9] px-4 text-[18px] text-[#0f172a] outline-none placeholder:text-[#64748b] focus:border-blue-500"
                />
              </div>

              <div>
                <div className="mb-3 flex items-center justify-between">
                  <label className="text-[22px] font-medium text-[#111827]">
                    Password
                  </label>
                  <button
                    type="button"
                    className="text-[18px] font-medium text-[#3b82f6]"
                  >
                    Forgot password?
                  </button>
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="h-14 w-full rounded-xl border border-gray-300 bg-[#f1f5f9] px-4 pr-12 text-[18px] text-[#0f172a] outline-none placeholder:text-[#64748b] focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#64748b]"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#4a86f0] text-[22px] font-semibold text-white"
              >

                {isPending ? (
                    <>
                      <span className="loading loading-spinner loading-xs"></span>
                      Signing in...
                    </>
                  ) : (
                    <>
                  <ArrowRight className="h-5 w-5" />
                          Sign in
                          </>
                  )}

              </button>
            </form>

           <p className="mt-8 text-center text-[20px] text-[#475569]">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-[#3b82f6] hover:underline"
            >
              Create account
            </Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
