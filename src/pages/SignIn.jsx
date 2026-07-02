import React, { useRef, useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaFacebook } from "react-icons/fa";
import { validationRules } from "../constant/validationRules";
import { handleError, handleSuccess } from "../services/errorHandler";
import BASE_URL from "../config/routes";
import { setCredentials } from "../redux/slices/authSlice";
import { Loader } from "lucide-react";
import { useForm } from "react-hook-form";
// import SocialAuthButton from "../components/auth/SocialAuthButton";
// import { motion } from "framer-motion";
// import PasswordField from "../components/auth/PasswordField";
// import AnimatedInput from "../components/auth/AnimatedInput";
// import { toast } from "react-toastify";
import { loginUser } from "../redux/features/authThunks";

const SignIn = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isLoading } = useSelector((state) => state.auth);

  const handleGoogleLogin = () => {
    try {
      window.location.href = `${BASE_URL}/api/auth/google`;
    } catch (error) {
      console.error("Google login initiation failed:", error);
      handleError("Failed to initiate Google Login. Please try again.");
    }
  };

  useEffect(() => {
    const error = searchParams.get("error");
    const token = searchParams.get("token") || searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");
    const role = searchParams.get("role");
    const userName = searchParams.get("name");

    if (error) {
      handleError(decodeURIComponent(error));
      navigate("/sign-in", { replace: true });
    } else if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("accessToken", token);
      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }

      dispatch(
        setCredentials({
          user: { name: userName || "User", role: role || "user" },
          token,
        })
      );

      handleSuccess(`Welcome Back ${userName || "User"}!!`);

      switch (role) {
        case "admin":
          navigate("/admin");
          break;
        case "co-admin":
          navigate("/co-admin");
          break;
        default:
          navigate("/user-dashboard");
      }
    }
  }, [searchParams, dispatch, navigate]);

  const onSubmit = async (data) => {
    try {
      // 🚀 LOGIN API (Aarav): Dispatch login payload to auth slice
      const res = await dispatch(loginUser(data)).unwrap();
      
      // 🎉 TOASTS (Vedant): Trigger success message
      handleSuccess(`Welcome Back ${res?.user?.name || "User"}!!`);

      switch (res?.user?.role) {
        case "admin":
          navigate("/admin");
          break;
        case "co-admin":
          navigate("/co-admin");
          break;
        default:
          navigate("/user-dashboard");
      }
    } catch (err) {
      // ❌ ERROR HANDLING (Vedant): Process server error toast
      handleError(err || "Login failed");
    }
  };

  
  const onError = (formErrors) => {
    // ❌ ERROR HANDLING (Vedant): Display validation errors as toasts
    const firstError = Object.values(formErrors)[0];
    if (firstError?.message) {
      handleError(firstError.message);
    } else {
      handleError("Please fix the form errors before submitting");
    }
  };

  return (
    <div className="w-full h-screen bg-black flex items-center justify-center">
      {/* MAIN CONTAINER */}
      <div className="w-[95%] h-[90%] bg-white dark:bg-[#0F172A] rounded-3xl flex overflow-hidden relative">
        
        {/* LEFT SIDE ILLUSTRATION */}
        <div className="w-[45%] bg-[#1E4D7B] relative flex items-center justify-center">
          {/* CURVE */}
          <div className="absolute right-0 top-0 w-[70%] h-full bg-white dark:bg-[#0F172A] rounded-l-[100px]"></div>
          {/* IMAGE */}
          <img
            src="/images/Auth/loginHuman.png"
            alt="login"
            className="w-[420px] lg:w-[500px] z-10 scale-x-[-1]"
          />
        </div>

        {/* RIGHT SIDE FORM */}
        <div className="w-full flex flex-col items-center justify-center">
          <form
            onSubmit={handleSubmit(onSubmit, onError)}
            className="w-[380px] space-y-6"
          >
            <h1 className="text-2xl font-semibold text-center text-gray-800 dark:text-white">
              Welcome Back
            </h1>

            {/* EMAIL */}
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">📧</span>
              <input
                type="email"
                placeholder="Email Address"
                {...register("email", validationRules.email)}
                className="w-full border border-gray-300 px-10 py-3 rounded-lg bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* PASSWORD */}
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">🔒</span>
              <input
                type="password"
                placeholder="Password"
                {...register("password", validationRules.password)}
                className="w-full border border-gray-300 px-10 py-3 rounded-lg bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            <p className="text-sm text-right text-blue-500 cursor-pointer hover:underline">
              Forgot Password?
            </p>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-all text-white py-3 rounded-md shadow-md flex items-center justify-center gap-2 cursor-pointer font-medium"
            >
              {isSubmitting || isLoading ? (
                <>
                  <Loader className="size-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                "Sign In"
              )}
            </button>

            {/* SOCIAL LOGIN */}
            <div className="flex items-center my-6">
              <div className="flex-grow h-px bg-gray-300"></div>
              <span className="mx-4 text-sm text-gray-400">Or continue with</span>
              <div className="flex-grow h-px bg-gray-300"></div>
            </div>

            <div className="flex justify-center gap-4 mb-4">
              <button type="button" onClick={handleGoogleLogin} className="border p-2 rounded-md hover:shadow cursor-pointer">
                <FcGoogle size={20} />
              </button>
              <button type="button" className="border p-2 rounded-md hover:shadow cursor-pointer">
                <FaGithub size={20} className="dark:text-white" />
              </button>
              <button type="button" className="border p-2 rounded-md hover:shadow cursor-pointer">
                <FaFacebook size={20} className="text-blue-600" />
              </button>
            </div>

            <p className="text-center text-sm text-gray-500">
              Don’t have an account?{" "}
              <Link to="/sign-up" className="text-blue-500 hover:underline font-semibold">
                Sign Up
              </Link>
            </p>
          </form>
        </div>

      </div>
    </div>
  );
};

export default SignIn;