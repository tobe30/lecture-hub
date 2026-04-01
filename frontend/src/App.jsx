import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Dashboard from "./Pages/Dashboard";
import Layout from "./Pages/Layout";
import CreateClass from "./Pages/CreateClass";
import StartSession from "./Pages/StartSession";
import MyClasses from "./Pages/MyClasses";
import StudentsPage from "./Pages/Students";
import Attendance from "./Pages/Attendance";
import JoinClass from "./Pages/student/JoinClass";
import StudentClassDetails from "./Pages/student/StudentClassDetails.jsx";
import StudentDashboard from "./Pages/student/StudentDashboard.jsx";
import StudentLiveSession from "./Pages/student/StudentLiveSession.jsx";
import StudentLayout from "./Pages/student/StudentLayout.jsx";
import StudentClasses from "./Pages/student/StudentClasses.jsx";
import StudentSessions from "./Pages/student/StudentSessions.jsx";
import Register from "./Pages/Register.jsx";
import Login from "./Pages/Login.jsx";
import { useQuery } from "@tanstack/react-query";
import { getAuthUser } from "./lib/api.js";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import RoleRoute from "./components/RoleRoute.jsx";
import { Toaster } from "react-hot-toast";
import EditClass from "./Pages/EditClass.jsx";
import SessionPage from "./Pages/SessionPage.jsx";

const App = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: getAuthUser,
    refetchOnWindowFocus: false,
    retry: false,
  });

  const authUser = data?.user || data;// Handle the case where data might be in the shape of { user: {...} } or directly the user object

  const getDefaultDashboard = () => {
    if (!authUser) return "/login";
    return authUser.role === "student" ? "/student" : "/dashboard";
  };

// console.log("authUser:", authUser);
// console.log("role:", authUser?.role);
  if (isLoading) return null;


  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="join-class" element={<JoinClass />} />

        <Route
          path="login"
          element={!authUser ? <Login /> : <Navigate to={getDefaultDashboard()} replace />}
        />

        <Route
          path="register"
          element={!authUser ? <Register /> : <Navigate to={getDefaultDashboard()} replace />}
        />

        {/* Logged in users only */}
        <Route element={<ProtectedRoute />}>
          <Route path="session/:id" element={<SessionPage />} />
        </Route>

        {/* Instructor routes */}
        <Route element={<RoleRoute allowedRoles={["instructor"]} />}>
          <Route path="/dashboard" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="create-class" element={<CreateClass />} />
            <Route path="sessions" element={<StartSession />} />
            <Route path="classes" element={<MyClasses />} />
            <Route path="students" element={<StudentsPage />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="edit-class/:id" element={<EditClass />} />
          </Route>
        </Route>

        {/* Student routes */}
        <Route element={<RoleRoute allowedRoles={["student"]} />}>
          <Route path="/student" element={<StudentLayout />}>
            <Route index element={<StudentDashboard />} />
            <Route path="class/:classId" element={<StudentClassDetails />} />
            <Route path="live-session" element={<StudentLiveSession />} />
            <Route path="classes" element={<StudentClasses />} />
            <Route path="sessions" element={<StudentSessions />} />
          </Route>
        </Route>

        {/* fallback */}
        <Route
          path="*"
          element={
            authUser ? (
              <Navigate to={getDefaultDashboard()} replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>

      <Toaster />
    </div>
  );
};

export default App;