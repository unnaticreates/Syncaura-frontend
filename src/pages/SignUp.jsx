import { Loader, Moon, Sun } from "lucide-react";
import React, { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import PasswordField from "../components/auth/PasswordField";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import AnimatedInput from "../components/auth/AnimatedInput";
import { useSelector, useDispatch } from "react-redux";
import { registerUser } from "../redux/features/authThunks";
import { toast } from "react-toastify";
import BASE_URL from "../config/routes";
import { setCredentials } from "../redux/slices/authSlice";


const SignUp = () => {
  const { register, handleSubmit, watch, formState:{errors}, } = useForm();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isLoading } = useSelector((state) => state.auth);

  const [isDark, setIsDark] = useState(false);
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
      navigate("/sign-up", { replace: true });
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

  const userRef = useRef(null);
  const wrapperRef = useRef(null);
  const passRef = useRef(null);
  const conPassRef = useRef(null);

  const t = isDark
    ? {
      pageBg: "#000000",
      leftBg: "#0d0d0d",

      titleColor: "#00e5cc",
      // labelColor: "#ffffff",
      labelColor: "#00e5cc",

      inputBg: "#1e1e1e",
      inputBorder: "#2e2e2e",
      inputText: "#cccccc",
      inputPlaceholder: "#666666",

      btnBg: "#00e5cc",
      btnText: "#000000",

      divColor: "#2e2e2e",
      orColor: "#555555",

      socialBg: "#1e1e1e",
      socialBorder: "#2e2e2e",

      loginMuted: "#888888",
      loginLink: "#00e5cc",

      toggleColor: "#ffffff",

      curveStart: "#00e5cc",
      curveEnd: "#00a896",

      btnShadow: "0 8px 22px rgba(0,229,204,0.4)",
    }
    : {
      pageBg: "#dce3ec",
      leftBg: "#ffffff",

      titleColor: "#2563eb",
      labelColor: "#2563eb",

      inputBg: "#f0f4fb",
      inputBorder: "#dce3ef",
      inputText: "#374151",
      inputPlaceholder: "#9ca3af",

      btnBg: "#2563eb",
      btnText: "#ffffff",

      divColor: "#d1d5db",
      orColor: "#9ca3af",

      socialBg: "#ffffff",
      socialBorder: "#e5e7eb",

      loginMuted: "#6b7280",
      loginLink: "#2563eb",

      toggleColor: "#000000",

      curveStart: "#3b82f6",
      curveEnd: "#1d4ed8",

      btnShadow: "0 8px 22px rgba(37,99,235,0.4)",
    };

  useEffect(() => {
    [userRef, wrapperRef, passRef, conPassRef].forEach((ref) => {
      if (!ref?.current) return;

      ref.current.style.backgroundColor = t.inputBg;
      ref.current.style.borderColor = t.inputBorder;
      ref.current.style.borderRadius = "0px";

      const input = ref.current.querySelector("input");

      if (input) {
        input.style.backgroundColor = t.inputBg;
        input.style.color = t.inputText;
        input.style.borderRadius = "0px";
      }
    });
  }, [isDark]);

  const handleFocus = (ref) => {
    if (!ref?.current) return;

    const c = isDark ? "#00e5cc" : "#0f2b67";

    ref.current.style.borderColor = c;
    ref.current.style.boxShadow = `0 0 0 2px ${c}33`;
  };

  const handleBlur = (ref) => {
    if (!ref?.current) return;

    ref.current.style.borderColor = t.inputBorder;
    ref.current.style.boxShadow = "";
  };

  const onSubmit = async (data) => {
    try {
      const res = await dispatch(registerUser(data)).unwrap();

      toast.success("Account created successfully");

      switch (res?.role || data?.role) {
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
    }
  };

  const onError = (errs) => {
    const first = Object.values(errs)[0];

    toast.error(first?.message || "Please fix the form errors");
  };

  const socialProviders = [
    {
      id: "google",
      icon: "/images/Auth/google.png",
      alt: "Google",
      onClick: handleGoogleLogin,
    },

    {
      id: "github",
      icon: "/images/Auth/github.png",
      alt: "GitHub",
      onClick: () => console.log("GitHub Signup"),
    },

    {
      id: "facebook",
      icon: "/images/Auth/facebook.png",
      alt: "Facebook",
      onClick: () => console.log("Facebook Signup"),
    },
  ];

  // Light mode → Sun icon (you're in light, click to go dark)
  // Dark mode  → Moon icon (you're in dark, click to go light)
  const ThemeIcon = isDark ? Moon : Sun;

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logoWrap}>
          <div style={styles.logo}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2L21 7V17L12 22L3 17V7L12 2Z"
                fill="url(#grad2)"
                stroke="white"
                strokeWidth="0.5"
              />

              {/* SMALL BOTTOM CIRCLE */}
              <circle
                cx="-20"
                cy="620"
                r="90"
                fill="url(#shapeGrad)"
              />

            </g>
          </svg>

          {/* LEFT SIDE */}
          <div
            style={{
              width: "36%",
              zIndex: 30,
              position: "centre",
            }}
            className="px-14 py-14 flex flex-col justify-center"
          >

            <h1
              style={{ color: t.titleColor }}
              className="text-3xl font-bold mb-4 text-center"
            >
              Create Account
            </h1>

            <form
              onSubmit={handleSubmit(onSubmit, onError)}
              className="su-form space-y-2"
            >

              {/* NAME */}
              <div className="flex flex-col gap-1">
                <label
                  style={{ color: t.labelColor }}
                  className="text-sm font-semibold"
                >
                  Full Name
                </label>

                <AnimatedInput
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  iconType="user"
                  register={register}
                  wrapperRef={userRef}
                  handleFocus={handleFocus}
                  handleBlur={handleBlur}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* EMAIL */}
              <div className="flex flex-col gap-1">
                <label
                  style={{ color: t.labelColor }}
                  className="text-sm font-semibold"
                >
                  Email Address
                </label>

                <AnimatedInput
                  type="email"
                  name="email"
                  placeholder="name@company.com"
                  iconType="mail"
                  register={register}
                  wrapperRef={wrapperRef}
                  handleFocus={handleFocus}
                  handleBlur={handleBlur}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* PASSWORD */}
              <div className="flex flex-col gap-1">
                <label
                  style={{ color: t.labelColor }}
                  className="text-sm font-semibold"
                >
                  Password
                </label>

                <PasswordField
                  name="password"
                  placeholder="Create a password"
                  register={register}
                  passRef={passRef}
                  handleFocus={handleFocus}
                  handleBlur={handleBlur}
                  validation={{
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  }}
                />
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>
          </div>

              {/* CONFIRM PASSWORD */}
              <div className="flex flex-col gap-1">
                <label
                  style={{ color: t.labelColor }}
                  className="text-sm font-semibold"
                >
                  Confirm Password
                </label>

                <PasswordField
                  name="confirmPassword"
                  placeholder="Confirm password"
                  register={register}
                  passRef={conPassRef}
                  handleFocus={handleFocus}
                  handleBlur={handleBlur}
                  validation={{
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === watch("password") ||
                      "Passwords do not match",
                  }}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <div style={styles.inputWrap}>
              <Lock size={18} color="#9ca3af" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                style={styles.input}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                style={styles.eyeBtn}
                aria-label="Toggle password visibility"
              >
                {isLoading ? (
                  <Loader className="size-4 animate-spin" />
                ) : (
                  "Create Account"
                )}
              </motion.button>

              {/* OR */}
              <div className="flex items-center gap-3 py-1">
                <span
                  style={{ backgroundColor: t.divColor }}
                  className="flex-1 h-px"
                />

                <span
                  style={{ color: t.orColor }}
                  className="text-xs font-semibold"
                >
                  OR
                </span>

                <span
                  style={{ backgroundColor: t.divColor }}
                  className="flex-1 h-px"
                />
              </div>

              {/* SOCIAL */}
              <div className="flex items-center justify-center gap-3">
                {socialProviders.map((p) => (
                  <motion.button
                    key={p.id}
                    type="button"
                    onClick={p.onClick}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.92 }}
                    style={{
                      backgroundColor: t.socialBg,
                      borderColor: t.socialBorder,
                      borderRadius: "0px",
                    }}
                    className="w-11 h-11 border flex items-center justify-center social-btn"
                  >
                    <img
                      src={p.icon}
                      alt={p.alt}
                      className="w-5 h-5 object-contain"
                    />
                  </motion.button>
                ))}
              </div>

              {/* LOGIN */}
              <div className="flex items-center justify-center gap-1 pt-2">
                <span
                  style={{ color: t.loginMuted }}
                  className="text-sm"
                >
                  Already have an account?
                </span>

                <Link to="/sign-in">
                  <span
                    style={{ color: t.loginLink }}
                    className="text-sm font-bold hover:underline"
                  >
                    Login
                  </span>
                </Link>
              </div>

            </form>
          </div>

          {/* RIGHT SIDE */}
          <div
            style={{ zIndex: 25 }}
            className="relative flex-1 overflow-hidden"
          >

            {/* TOGGLE */}
            <motion.button
              onClick={() => setIsDark((d) => !d)}
              whileHover={{
                scale: 1.15,
                rotate: 15,
              }}
              whileTap={{ scale: 0.9 }}
              style={{ color: t.toggleColor }}
              className="absolute top-5 right-5 z-50"
            >
              <ThemeIcon
                size={22}
                strokeWidth={2}
                fill={isDark ? "currentColor" : "none"}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                style={styles.eyeBtn}
                aria-label="Toggle confirm password visibility"
              >
                {showConfirm ? <EyeOff size={18} color="#9ca3af" /> : <Eye size={18} color="#9ca3af" />}
              </button>
            </div>
          </div>

          <label style={styles.checkboxRow}>
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              style={styles.checkbox}
            />
            <span style={styles.checkboxText}>
              I agree to the{" "}
              <a href="#" style={styles.link}>
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" style={styles.link}>
                Privacy Policy
              </a>
            </span>
          </label>

          <button type="submit" style={styles.primaryBtn}>
            Sign Up
          </button>

          <div style={styles.dividerWrap}>
            <span style={styles.dividerLine} />
            <span style={styles.dividerText}>or</span>
            <span style={styles.dividerLine} />
          </div>

          <button type="button" style={styles.googleBtn}>
            <GoogleIcon />
            <span>Continue with Google</span>
          </button>

          <p style={styles.switchText}>
            Already have an account?{" "}
            <a
              href="#"
              style={styles.switchLink}
              onClick={(e) => {
                e.preventDefault();
                navigate("/");
              }}
            >
              Login
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
    maxWidth: "440px",
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
  row: { display: "flex", gap: "12px", flexWrap: "wrap" },
  field: { display: "flex", flexDirection: "column", gap: "8px" },
  fieldHalf: { display: "flex", flexDirection: "column", gap: "8px", flex: "1 1 140px", minWidth: 0 },
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
  link: { color: "#7c3aed", fontSize: "13.5px", fontWeight: 600, textDecoration: "none" },
  checkboxRow: { display: "flex", alignItems: "flex-start", gap: "10px", cursor: "pointer" },
  checkbox: { marginTop: "3px", width: "16px", height: "16px", accentColor: "#7c3aed", cursor: "pointer" },
  checkboxText: { fontSize: "13.5px", color: "#4b5563", lineHeight: 1.5 },
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