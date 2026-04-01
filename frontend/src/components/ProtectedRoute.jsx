import { Navigate, Outlet } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAuthUser } from "../lib/api";
import Loading from "./Loading";

const ProtectedRoute = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: getAuthUser,
    retry: false,
    refetchOnWindowFocus: false,
  });
  
const authUser = data?.user || data;

  if (isLoading) {
    return <Loading />;
  }

  // ❌ Not logged in
  if (!authUser) {
    return <Navigate to="/login" replace/>;
  }

  // ✅ Logged in
  return <Outlet />;
};

export default ProtectedRoute;
