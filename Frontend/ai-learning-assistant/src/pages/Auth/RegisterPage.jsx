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
    <div className="flex items-center justify-center min-h-screen bg-[#030a0a] relative overflow-hidden">
        {/* Ambient Retro Glows */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#6dadbe]/5 rounded-full blur-[120px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#f59e0b]/5 rounded-full blur-[120px] pointer-events-none translate-y-1/2 translate-x-1/2" />
        
        {/* Scanline Effect */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_4px,3px_100%] pointer-events-none z-10 opacity-20" />

      <div className="relative w-full max-w-md px-6 z-20">
        <div className="bg-black/60 backdrop-blur-3xl border border-white/10 rounded-[3rem] shadow-[0_12px_64px_rgba(0,0,0,0.6)] p-10 md:p-12 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-[#6dadbe]/40 to-transparent" />
          
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-black border border-[#6dadbe]/30 text-[#6dadbe] shadow-[0_0_20px_rgba(109,173,190,0.2)] mb-8 transition-all duration-500 group-hover:shadow-[0_0_30px_rgba(109,173,190,0.3)] group-hover:border-[#6dadbe]/50">
              <BrainCircuit className="w-10 h-10" strokeWidth={1.5} />
            </div>
            <h1 className="text-4xl font-light text-slate-100 tracking-tighter mb-2 lowercase">
                Ignitia /<span className="font-bold uppercase italic text-white text-3xl ml-1">Registry</span>
            </h1>
            <p className="text-[10px] font-mono font-bold text-[#6dadbe]/50 uppercase tracking-[0.4em]">&gt; Create neural account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div className="space-y-2">
              <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-[.3em] ml-1">
                &gt; SYSTEM_ALIAS
              </label>
              <div className="relative group/input">
                <div
                  className={`absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-colors duration-300 ${focusedField === "username" ? "text-[#6dadbe]" : "text-slate-600"
                    }`}
                >
                  <User className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <input
                  type="text"
                  value={username}
                  required
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => setFocusedField("username")}
                  onBlur={() => setFocusedField(null)}
                  className="w-full pl-14 pr-6 py-4 bg-black border border-white/10 rounded-2xl focus:outline-none focus:border-[#6dadbe]/50 transition-all duration-300 text-slate-100 placeholder:text-slate-700 font-mono text-sm"
                  placeholder="Enter username"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
               <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-[.3em] ml-1">
                &gt; COMMS_ADDR
              </label>
              <div className="relative group/input">
                <div
                  className={`absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-colors duration-300 ${focusedField === "email" ? "text-[#6dadbe]" : "text-slate-600"
                    }`}
                >
                  <Mail className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <input
                  type="email"
                  value={email}
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  className="w-full pl-14 pr-6 py-4 bg-black border border-white/10 rounded-2xl focus:outline-none focus:border-[#6dadbe]/50 transition-all duration-300 text-slate-100 placeholder:text-slate-700 font-mono text-sm"
                  placeholder="Enter email address"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
               <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-[.3em] ml-1">
                &gt; SECURE_TOKEN
              </label>
              <div className="relative group/input">
                <div
                  className={`absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-colors duration-300 ${focusedField === "password" ? "text-[#6dadbe]" : "text-slate-600"
                    }`}
                >
                  <Lock className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <input
                  type="password"
                  value={password}
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  className="w-full pl-14 pr-6 py-4 bg-black border border-white/10 rounded-2xl focus:outline-none focus:border-[#6dadbe]/50 transition-all duration-300 text-slate-100 placeholder:text-slate-700 font-mono text-sm"
                  placeholder="Create password"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl animate-in fade-in duration-300">
                <p className="text-rose-500 text-[10px] font-mono font-bold uppercase tracking-widest text-center">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="group relative w-full h-14 bg-black border border-[#f59e0b] hover:bg-[#f59e0b]/10 text-white text-[10px] font-mono font-bold uppercase tracking-[0.3em] rounded-2xl transition-all duration-300 disabled:opacity-30 flex items-center justify-center gap-3 shadow-[0_4px_30px_rgba(245,158,11,0.2)] active:scale-95"
            >
                {loading ? (
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 border-2 border-[#f59e0b]/30 border-t-[#f59e0b] rounded-full animate-spin" />
                    <span>Synchronizing...</span>
                  </div>
                ) : (
                  <>
                    Create Identity
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
                  </>
                )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-slate-500 text-[11px] font-medium tracking-wide">
              Already registered?{" "}
              <Link to="/login" className="font-bold text-[#6dadbe] hover:text-[#12768a] transition-all uppercase tracking-widest ml-1 underline decoration-[#6dadbe]/30 underline-offset-4">
                Access Terminal
              </Link>
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
             <p className="text-[9px] font-mono text-slate-600 uppercase tracking-widest leading-relaxed">
                Integration signifies approval of the <br/> Ignitia Knowledge Contract.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
