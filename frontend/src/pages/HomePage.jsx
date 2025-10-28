import React from "react";
import { useAuthStore } from "../store/auth.store";
import { Navigate } from "react-router-dom";
import { Loader } from "lucide-react";

const HomePage = () => {
  const { authUser, check, isCheckingAuth, logout } = useAuthStore();

  if (authUser.role === "PROFESSOR") {
    return <Navigate to="/professor-dashboard" replace />;
  }

  if (authUser.role === "STUDENT") {
    return <Navigate to="/student-dashboard" replace />;
  }

  return <Navigate to="/" replace />;
};

export default HomePage;
