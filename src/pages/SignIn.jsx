import { Loader, Mail } from "lucide-react";
import React, { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import SocialAuthButton from "../components/auth/SocialAuthButton";
import { motion } from "framer-motion";
import PasswordField from "../components/auth/PasswordField";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import AnimatedInput from "../components/auth/AnimatedInput";
import { toast } from "react-toastify";
import { loginUser } from "../redux/features/authThunks";
import { useDispatch, useSelector } from "react-redux";
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaFacebook } from "react-icons/fa";
import BASE_URL from "../config/routes";
import { setCredentials } from "../redux/slices/authSlice";


const SignIn = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const dispatch=useDispatch()

  const wrapperRef = useRef(null);
  const passRef = useRef(null);
  const [isSubmitting, setIsSubmitting]=useState(false);
  const navigate=useNavigate();
  const [searchParams] = useSearchParams();

  const handleGoogleLogin = () => {
    try {
      window.location.href = `${BASE_URL}/api/auth/google`;
    } catch (error) {
      console.error("Google login initiation failed:", error);
      toast.error("Failed to initiate Google Login. Please try again.");
    }
  };

  useEffect(() => {
    const error = searchParams.get("error");
    const token = searchParams.get("token") || searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");
    const role = searchParams.get("role");
    const userName = searchParams.get("name");

    if (error) {
      toast.error(decodeURIComponent(error));
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

      toast.success(`Welcome Back ${userName || "User"}!!`);

      switch (role) {
        case "Admin":
          navigate("/admin");
          break;
        case "Co-Admin":
          navigate("/co-admin");
          break;
        default:
          navigate("/user-dashboard");
      }
    }
  }, [searchParams, dispatch, navigate]);

  const socialProviders = [
    {
      id: "google",
      icon: "/images/Auth/google.png",
      alt: "Google login",
      onClick: handleGoogleLogin,
    },
    {
      id: "github",
      icon: "/images/Auth/github.png",
      alt: "GitHub login",
      onClick: () => console.log("GitHub Login"),
    },
    {
      id: "facebook",
      icon: "/images/Auth/facebook.png",
      alt: "Facebook login",
      onClick: () => console.log("Facebook Login"),
    },
  ];

  const handleFocus = (ref) => {
    ref.current?.classList.add(
      "border-[#01509C]",
      "ring-2",
      "ring-[#01509C]/30",
    );
  };
  const handleBlur = (ref) => {
    ref.current?.classList.remove(
      "border-[#01509C]",
      "ring-2",
      "ring-[#01509C]/30",
    );
  };
  const onSubmit = async (data) => {
     try {
      setIsSubmitting(true)
       const res = await dispatch(loginUser(data)).unwrap();
       console.log(res);
       
 
       toast.success(`Welcome Back ${res?.user?.name}!!`);
 
       switch (res?.user?.role) {
         case "Admin":
           navigate("/admin");
           break;
         case "Co-Admin":
           navigate("/co-admin");
           break;
         default:
           navigate("/user-dashboard");
       }
     } catch (err) {
       toast.error(err || "Registration failed");
     }finally{
      setIsSubmitting(false)
     }
   };
 
   const onError = (errors) => {
    setIsSubmitting(false)
     const firstError = Object.values(errors)[0];
 
     if (firstError?.message) {
       toast.error(firstError.message);
     } else {
       toast.error("Please fix the form errors");
     }
 
     console.log(errors);
   };
 
 return (
  <div className="w-full h-screen bg-black flex items-center justify-center">

    {/* MAIN WHITE CONTAINER */}
    <div className="w-[95%] h-[90%] bg-white dark:bg-[#0F172A] rounded-3xl flex overflow-hidden relative">

      {/* LEFT SIDE */}
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

      {/* RIGHT SIDE */}
      <div className="w-full flex flex-col items-center max-w-md space-y-5">

// onSwitchToSignup: optional callback to navigate to the Signup page (e.g. via react-router)
export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logoWrap}>
          <div style={styles.logo}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2L21 7V17L12 22L3 17V7L12 2Z"
                fill="url(#grad1)"
                stroke="white"
                strokeWidth="0.5"
              />
              <defs>
                <linearGradient id="grad1" x1="3" y1="2" x2="21" y2="22">
                  <stop offset="0%" stopColor="#a78bfa" />
                  <stop offset="100%" stopColor="#6d28d9" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        <h1 style={styles.title}>Welcome Back 👋</h1>
        <p style={styles.subtitle}>Login to your account and continue</p>

          {/* EMAIL */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">📧</span>
            <input
              type="email"
              placeholder="Email Address"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Please enter a valid email",
                },
              })}
              className="w-full border border-gray-300 px-4 py-3 rounded-lg bg-white text-gray-700 placeholder-gray-400 focus:outline-none"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* PASSWORD */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">🔒</span>
            <input
              type="password"
              placeholder="Password"
              {...register("password", {
                required: "Password is required",
              })}
              className="w-full border border-gray-300 px-4 py-3 rounded-lg bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div style={styles.forgotWrap}>
            <a href="#" style={styles.link}>
              Forgot Password?
            </a>
          </div>

          <button type="submit" style={styles.primaryBtn}>
            Login
          </button>

          <div style={styles.dividerWrap}>
            <span style={styles.dividerLine} />
            <span style={styles.dividerText}>or</span>
            <span style={styles.dividerLine} />
          </div>

<div className="flex justify-center gap-4 mb-4">
  <button type="button" onClick={handleGoogleLogin} className="border p-2 rounded-md hover:shadow">
    <FcGoogle size={20} />
  </button>
  <button className="border p-2 rounded-md hover:shadow">
    <FaGithub size={20} />
  </button>
  <button className="border p-2 rounded-md hover:shadow">
    <FaFacebook size={20} className="text-blue-600" />
  </button>
</div>

          <p style={styles.switchText}>
            Don't have an account?{" "}
            <a
              href="#"
              style={styles.switchLink}
              onClick={(e) => {
                e.preventDefault();
                navigate("/signup");
              }}
            >
              Sign up
            </a>
          </p>
        </form>
      </div>

      <style>{`
        * { box-sizing: border-box; }
        input:focus {
          outline: none;
          border-color: #7c3aed !important;
          box-shadow: 0 0 0 3px rgba(124,58,237,0.12);
        }
        button:focus-visible {
          outline: 2px solid #7c3aed;
          outline-offset: 2px;
        }
        a:hover { text-decoration: underline; }
      `}</style>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #ede9fe 0%, #e0e7ff 50%, #ddd6fe 100%)",
    padding: "24px",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: "420px",
    background: "#ffffff",
    borderRadius: "20px",
    padding: "40px 36px",
    boxShadow: "0 20px 50px rgba(109, 40, 217, 0.12)",
  },
  logoWrap: { marginBottom: "20px" },
  logo: {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    background: "linear-gradient(135deg, #c4b5fd, #7c3aed)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontSize: "26px", fontWeight: 800, color: "#111827", margin: "0 0 6px 0" },
  subtitle: { fontSize: "14.5px", color: "#6b7280", margin: "0 0 28px 0" },
  form: { display: "flex", flexDirection: "column", gap: "18px" },
  field: { display: "flex", flexDirection: "column", gap: "8px" },
  label: { fontSize: "13.5px", fontWeight: 700, color: "#1f2937" },
  inputWrap: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    border: "1.5px solid #e5e7eb",
    borderRadius: "12px",
    padding: "13px 14px",
    background: "#fafafa",
    transition: "border-color 0.15s, box-shadow 0.15s",
  },
  input: {
    border: "none",
    outline: "none",
    background: "transparent",
    flex: 1,
    fontSize: "14.5px",
    color: "#111827",
    minWidth: 0,
  },
  eyeBtn: { background: "none", border: "none", padding: 0, display: "flex", cursor: "pointer" },
  forgotWrap: { display: "flex", justifyContent: "flex-end", marginTop: "-6px" },
  link: { color: "#7c3aed", fontSize: "13.5px", fontWeight: 600, textDecoration: "none" },
  primaryBtn: {
    border: "none",
    borderRadius: "12px",
    padding: "14px",
    background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
    color: "#fff",
    fontSize: "15.5px",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 8px 20px rgba(109, 40, 217, 0.25)",
  },
  dividerWrap: { display: "flex", alignItems: "center", gap: "12px", margin: "2px 0" },
  dividerLine: { flex: 1, height: "1px", background: "#e5e7eb" },
  dividerText: { fontSize: "13px", color: "#9ca3af" },
  googleBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    border: "1.5px solid #e5e7eb",
    borderRadius: "12px",
    padding: "13px",
    background: "#fff",
    fontSize: "14.5px",
    fontWeight: 600,
    color: "#374151",
    cursor: "pointer",
  },
  switchText: { textAlign: "center", fontSize: "13.5px", color: "#6b7280", margin: "4px 0 0 0" },
  switchLink: { color: "#7c3aed", fontWeight: 700, textDecoration: "none" },
};