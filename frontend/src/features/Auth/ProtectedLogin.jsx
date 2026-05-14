import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { selectAuth } from "./auth.slice";
import PATH from "@/configs/paths/PATH";
import Login from "@/features/Auth";

export default function ProtectedLogin() {
  const { isAuthenticated } = useSelector(selectAuth);

  if (isAuthenticated) {
    return <Navigate to={PATH.HOME} replace />;
  }

  return <Login />;
}
