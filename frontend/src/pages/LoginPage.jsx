import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, User, Lock, UserPlus, Loader } from "lucide-react";
import { useAuthStore } from "../store/auth.store.js";
import toast from "react-hot-toast";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().min(1, "Student/Staff ID is required"),
  password: z.string().min(1, "Password is required"),
});

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    sid: "",
    password: "",
  });
  const { login, isLoggingIn } = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    setFormErrors({});

    try {
      // Validate form data
      const validationResult = loginSchema.safeParse({
        email: loginData.sid,
        password: loginData.password,
      });

      if (!validationResult.success) {
        const errors = {};
        validationResult.error.errors.forEach((error) => {
          if (error.path[0] === "email") errors.sid = error.message;
          if (error.path[0] === "password") errors.password = error.message;
        });
        setFormErrors(errors);
        return;
      }

      await login(loginData);
      toast.success("Login successful!");
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 flex">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-linear-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-linear-to-tr from-indigo-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-linear-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"></div>
      </div>

      {/* Left Side - Login Form */}
      <div className="w-full lg:w-1/3 flex items-center justify-center p-4 lg:p-8">
        <div className="w-full max-w-md">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="mb-4">
                <div className="w-16 h-16 bg-linear-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <img src="clglogo.webp" alt="BKBIET Logo" />
                </div>
              </div>
              <h1 className="text-3xl font-bold bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                BKBIET Grievance Portal
              </h1>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} noValidate className="space-y-6">
              {/* Student/Staff ID Field */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 mr-2 text-gray-500" />
                  Student/Staff ID
                </label>
                <div className="relative">
                  <input
                    type="text"
                    className={`w-full px-4 py-3 border-2 rounded-xl bg-white/50 backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${
                      formErrors.sid
                        ? "border-red-300 focus:border-red-500"
                        : "border-gray-200 focus:border-blue-500"
                    }`}
                    placeholder="Enter your ID"
                    value={loginData.sid}
                    onChange={(e) => {
                      setLoginData({ ...loginData, sid: e.target.value });
                      if (formErrors.sid) {
                        setFormErrors({ ...formErrors, sid: "" });
                      }
                    }}
                    required
                  />
                </div>
                {formErrors.sid && (
                  <p className="text-red-500 text-sm flex items-center">
                    <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                    {formErrors.sid}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Lock className="w-4 h-4 mr-2 text-gray-500" />
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className={`w-full px-4 py-3 pr-12 border-2 rounded-xl bg-white/50 backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${
                      formErrors.password
                        ? "border-red-300 focus:border-red-500"
                        : "border-gray-200 focus:border-blue-500"
                    }`}
                    placeholder="Enter your password"
                    value={loginData.password}
                    onChange={(e) => {
                      setLoginData({ ...loginData, password: e.target.value });
                      if (formErrors.password) {
                        setFormErrors({ ...formErrors, password: "" });
                      }
                    }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {formErrors.password && (
                  <p className="text-red-500 text-sm flex items-center">
                    <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                    {formErrors.password}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                disabled={isLoggingIn}
              >
                {isLoggingIn ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    <span>Sign In</span>
                  </>
                )}
              </button>
            </form>

            {/* Help Text */}
            <div className="mt-8 text-center">
              <p className="text-gray-500 text-sm">
                Need help? Contact your system administrator
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - College Photo */}
      <div className="hidden lg:block w-2/3 relative overflow-hidden">
        <div className="absolute inset-0 "></div>
        <img
          src="College.jpg"
          alt="College Campus"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0  flex items-start justify-center">
          <div className="text-center bg-gray-50  rounded-2xl m-9 mt-15 p-4 items-center  text-gray-700 ">
            <img
              className="rounded-xl  mx-auto w-17 h-17"
              src="clglogo.webp"
              alt="BKBIET Logo"
            />
            <h2 className="text-4xl font-bold mt-3">
              B K Birla Institute of Engineering & Technology, Pilani
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
