import { Navigate, Outlet } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAuthUser } from "../lib/api";
import Loading from "./Loading";

const RoleRoute = ({ allowedRoles }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: getAuthUser,
    retry: false,
  });

  const authUser = data?.user || data;

  if (isLoading) return <Loading />;

  if (!authUser) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(authUser.role)) {
    if (authUser.role === "student") {
      return <Navigate to="/student" replace />;
    }

    if (authUser.role === "instructor") {
      return <Navigate to="/dashboard" replace />;
    }

    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default RoleRoute;