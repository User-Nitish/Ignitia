import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../services/authService"; // ✅ fixed path spacing
import { BrainCircuit, Mail, Lock, ArrowRight, User } from "lucide-react";
import toast from "react-hot-toast";

const RegisterPage = () => {
  const [username, setUsername] = useState(""); // ✅ fixed useState syntax
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // simple validation
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await authService.register(username, email, password);
      toast.success("Registered successfully! Please login.");
      navigate("/login");
    } catch (err) {
      const errorMessage = err.error || err.message || "Failed to register. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-[length:16px_16px] opacity-30"></div>

      <div className="relative w-full max-w-md px-6">
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl group relative bg-linear-to-r from-emerald-500 to-teal-500 hover:to-teal-600 active:scale-[0.98] text-white shadow-inner mb-6 transition-all">
              <BrainCircuit className="w-8 h-8" strokeWidth={2} />
            </div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Create an account</h1>
            <p className="text-slate-500">Start your AI-powered learning journey</p>
          </div>

          {/* Form */}
          <div className="space-y-6">
            {/* Username Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Username</label>
              <div className="relative">
                <div
                  className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200 ${focusedField === "username" ? "text-emerald-500" : "text-slate-400"
                    }`}
                >
                  <User className="h-5 w-5" strokeWidth={2} />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => setFocusedField("username")}
                  onBlur={() => setFocusedField(null)}
                  className="w-full pl-11 pr-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 shadow-sm"
                  placeholder="Enter your username"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Email</label>
              <div className="relative">
                <div
                  className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200 ${focusedField === "email" ? "text-emerald-500" : "text-slate-400"
                    }`}
                >
                  <Mail className="h-5 w-5" strokeWidth={2} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  className="w-full pl-11 pr-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 shadow-sm"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <div className="relative">
                <div
                  className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200 ${focusedField === "password" ? "text-emerald-500" : "text-slate-400"
                    }`}
                >
                  <Lock className="h-5 w-5" strokeWidth={2} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  className="w-full pl-11 pr-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 shadow-sm"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-2 p-3 bg-red-50 border border-red-100 rounded-xl">
                <p className="text-red-600 text-sm font-medium text-center">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="group relative w-full h-12 bg-linear-to-r from-emerald-500 to-teal-500 hover:to-teal-600 active:scale-[0.98] text-white text-sm font-semibold rounded-2xl transition-all disabled:opacity-70 disabled:hover:scale-100 overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Creating account...</span>
                  </div>
                ) : (
                  <>
                    Create account
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
                  </>
                )}
              </span>
            </button>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-slate-600">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-emerald-600 hover:text-emerald-700 hover:underline transition-all">
                Sign in
              </Link>
            </p>
          </div>

          {/* Subtle footer text */}
          <p className="mt-8 text-center text-xs text-slate-400">
            By continuing, you agree to our Terms & Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
