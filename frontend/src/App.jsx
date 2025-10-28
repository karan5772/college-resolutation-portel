import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import { useAuthStore } from "./store/auth.store";
import HomePage from "./pages/HomePage";
import { Loader } from "lucide-react";
import ProfessorDashboard from "./pages/ProfessorDashboard";
import StudentDashboard from "./pages/StudentDashboard";

const App = () => {
  const { authUser, check, isCheckingAuth } = useAuthStore();
  useEffect(() => {
    check();
  }, [check]);

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={authUser ? <Navigate to="/dashboard" /> : <LoginPage />}
      />
      <Route
        path="/dashboard"
        element={authUser ? <HomePage /> : <Navigate to="/" />}
      />
      <Route
        path="/professor-dashboard"
        element={
          authUser?.role === "PROFESSOR" ? (
            <ProfessorDashboard />
          ) : (
            <Navigate to="/dashboard" />
          )
        }
      />
      <Route
        path="/student-dashboard"
        element={
          authUser?.role === "STUDENT" ? (
            <StudentDashboard />
          ) : (
            <Navigate to="/dashboard" />
          )
        }
      />
    </Routes>
  );
};

export default App;
