import React from "react";
import "./index.scss";
import useActionLoader from "@/features/Outlet/useActionLoader";
import LoginForm from "./components/LoginForm";

function Login() {
  const isLoading = useActionLoader("auth/loginUser");

  return (
    <div className="login-container">
      <LoginForm loading={isLoading} />
    </div>
  );
}

export default Login;
