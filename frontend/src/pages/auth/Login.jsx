import { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth.js";
import { useNavigate } from "react-router-dom";
import { forgotPassword, resetPassword } from "../../services/authService.js";
import ASTU_LOGO from "../../assets/astu-logo.svg";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState("");

  useEffect(() => {
    const savedEmail = localStorage.getItem("astuRememberedEmail");
    const savedRememberMe = localStorage.getItem("astuRememberMe") === "true";

    if (savedEmail) {
      setFormData((prev) => ({ ...prev, email: savedEmail }));
    }

    if (savedRememberMe) {
      setRememberMe(true);
    }
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleRememberMeChange = (event) => {
    const nextValue = event.target.checked;
    setRememberMe(nextValue);
    localStorage.setItem("astuRememberMe", String(nextValue));

    if (nextValue) {
      localStorage.setItem("astuRememberedEmail", formData.email);
    } else {
      localStorage.removeItem("astuRememberedEmail");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login({ ...formData, remember: rememberMe });

      if (rememberMe) {
        localStorage.setItem("astuRememberedEmail", formData.email);
        localStorage.setItem("astuRememberMe", "true");
      } else {
        localStorage.removeItem("astuRememberedEmail");
        localStorage.setItem("astuRememberMe", "false");
      }

      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Invalid credentials. Please verify your email and password.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    setResetMode(true);
    setResetEmail(formData.email || "");
    setResetToken("");
    setNewPassword("");
    setError("");
    setResetSuccess("");
  };

  const handleRequestResetCode = async () => {
    if (!resetEmail.trim()) {
      setError("Please enter your email address first.");
      return;
    }

    setResetLoading(true);
    setError("");
    setResetSuccess("");

    try {
      const response = await forgotPassword(resetEmail.trim());
      const generatedCode = response?.resetToken || "";

      if (generatedCode) {
        setResetToken(generatedCode);
      }

      setResetSuccess(
        response?.message + (generatedCode ? ` Code: ${generatedCode}` : "") ||
          "A reset code has been sent to your email."
      );
      setResetMode(true);
    } catch (err) {
      setError(err.message || "Unable to request a password reset.");
    } finally {
      setResetLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!resetEmail.trim() || !resetToken.trim() || !newPassword.trim()) {
      setError("Please complete the email, reset code, and new password fields.");
      return;
    }

    setResetLoading(true);
    setError("");
    setResetSuccess("");

    try {
      const response = await resetPassword({
        email: resetEmail.trim(),
        token: resetToken.trim(),
        newPassword,
      });

      setResetSuccess(response.message || "Password reset successful.");
      setResetToken("");
      setNewPassword("");
      setTimeout(() => {
        setResetMode(false);
        setFormData((prev) => ({ ...prev, password: "" }));
      }, 1200);
    } catch (err) {
      setError(err.message || "Password reset failed.");
    } finally {
      setResetLoading(false);
    }
  };

  const fillCredentials = (email, password) => {
    setFormData({ email, password });
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 px-4 py-8 relative">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 sm:p-10 relative z-10 border border-slate-100">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <img
            src={ASTU_LOGO}
            alt="ASTU logo"
            className="w-16 h-16 mx-auto rounded-2xl object-contain shadow-lg shadow-blue-600/20 mb-4 bg-slate-100 p-2"
          />
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            ASTU Stock System
          </h1>
          <p className="text-xs font-semibold text-blue-600 mt-1 uppercase tracking-wider">
            Adama Science & Technology University
          </p>
          <p className="text-xs text-slate-400 mt-0.5">
            Inventory & Logistics Portal
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700 flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {resetMode ? (
          <div className="space-y-4 rounded-xl border border-blue-100 bg-blue-50/40 p-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-bold text-slate-900">Reset password</h2>
              <button
                type="button"
                onClick={() => setResetMode(false)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-700"
              >
                Back to login
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none transition"
              />
            </div>

            <button
              type="button"
              onClick={handleRequestResetCode}
              disabled={resetLoading}
              className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800 transition disabled:opacity-50"
            >
              {resetLoading ? "Requesting..." : "Send reset code"}
            </button>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Reset code
              </label>
              <input
                type="text"
                value={resetToken}
                onChange={(e) => setResetToken(e.target.value)}
                placeholder="Enter the code from the server response"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                New password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none transition"
              />
            </div>

            <button
              type="button"
              onClick={handleResetPassword}
              disabled={resetLoading}
              className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition disabled:opacity-50"
            >
              {resetLoading ? "Resetting..." : "Reset password"}
            </button>

            {resetSuccess && (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
                {resetSuccess}
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
              >
                University Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="e.g. megersa@astu.edu.et"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-sm text-slate-900 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none transition"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-xs font-bold text-slate-700 uppercase tracking-wider"
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter system password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-sm text-slate-900 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none transition"
              />
            </div>

            <div className="flex items-center justify-between gap-3 mt-2 text-xs">
              <label className="inline-flex items-center gap-2 text-slate-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={handleRememberMeChange}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                Remember me
              </label>

              <button
                type="button"
                onClick={handleForgotPassword}
                className="font-semibold text-blue-600 hover:text-blue-700"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition disabled:opacity-50"
            >
              {loading ? "Authenticating..." : "Sign In to Inventory Portal"}
            </button>

            <div className="text-center text-sm text-slate-600 mt-3">
              Don’t have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="font-semibold text-blue-600 hover:text-blue-700"
              >
                Register here
              </button>
            </div>
            <div className="text-center text-xs text-slate-500 mt-2">
              For assistance, contact IT at <a href="mailto:it@astu.edu.et" className="text-blue-600 font-semibold">it@astu.edu.et</a>
            </div>
          </form>
        )}

      </div>

      <div className="mt-6 text-center text-xs text-slate-400 z-10 font-medium">
        ASTU Stock Management System • Adama Science & Technology University
      </div>
    </div>
  );
};

export default Login;