import React, { useState, useEffect } from "react";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import Spinner from "../../components/common/Spinner";
import authService from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { User, Mail, Lock } from "lucide-react";
import { motion } from "framer-motion";

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

const ProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await authService.getProfile();
        setUsername(data.username);
        setEmail(data.email);
      } catch (error) {
        toast.error("Failed to fetch profile data.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long.");
      return;
    }

    setPasswordLoading(true);
    try {
      await authService.changePassword({ currentPassword, newPassword });
      toast.success("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (error) {
      toast.error(error.message || "Failed to change password.");
      console.error(error);
    } finally {
      setPasswordLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      <div>
         <PageHeader title="Profile Settings" />
      </div>

      {/* User Information Card */}
      <motion.div 
        variants={itemVariants} initial="hidden" animate="visible"
        className="bg-black/60 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 md:p-12 shadow-[0_12px_64px_rgba(0,0,0,0.6)] relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#6dadbe]/5 rounded-full blur-[80px] pointer-events-none translate-x-1/2 -translate-y-1/2" />
        
        <div className="flex items-center gap-4 mb-10 relative z-10">
            <div className="w-1.5 h-1.5 rounded-full bg-[#f59e0b] animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
            <h3 className="text-2xl font-light text-slate-100 tracking-tight lowercase">
                Profile /<span className="font-bold uppercase italic text-white text-xl ml-1">Account</span>
            </h3>
        </div>

        <div className="space-y-5">
          {/* Username */}
          <div className="relative z-10">
            <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-[.3em] mb-3 ml-1">
              &gt; SYSTEM_ALIAS
            </label>
            <div className="flex items-center gap-5 w-full px-6 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-slate-200 transition-all hover:bg-white/[0.05] hover:border-[#6dadbe]/30 group">
              <div className="text-[#6dadbe]/50 bg-black border border-white/5 p-2.5 rounded-xl group-hover:border-[#6dadbe]/30 group-hover:text-[#6dadbe] transition-all">
                <User className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <p className="text-lg font-bold tracking-tight">{username}</p>
            </div>
          </div>

          {/* Email */}
          <div className="relative z-10">
            <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-[.3em] mb-3 ml-1">
              &gt; COMMS_TERMINAL
            </label>
            <div className="flex items-center gap-5 w-full px-6 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-slate-200 transition-all hover:bg-white/[0.05] hover:border-[#6dadbe]/30 group">
               <div className="text-[#6dadbe]/50 bg-black border border-white/5 p-2.5 rounded-xl group-hover:border-[#6dadbe]/30 group-hover:text-[#6dadbe] transition-all">
                <Mail className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <p className="text-lg font-bold tracking-tight">{email}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Change Password Card */}
      <motion.div 
        variants={itemVariants} initial="hidden" animate="visible" transition={{ delay: 0.1 }}
        className="bg-black/60 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 md:p-12 shadow-[0_12px_64px_rgba(0,0,0,0.6)] relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-64 h-64 bg-[#6dadbe]/5 rounded-full blur-[80px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />
        
        <div className="flex items-center gap-4 mb-10 relative z-10">
            <div className="w-1.5 h-1.5 rounded-full bg-[#f59e0b] animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
            <h3 className="text-2xl font-light text-slate-100 tracking-tight lowercase">
                Security /<span className="font-bold uppercase italic text-white text-xl ml-1">Settings</span>
            </h3>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-5">
          {/* Current Password */}
          <div className="relative z-10">
            <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-[.3em] mb-3 ml-1">
              &gt; AUTH_KEY_CURRENT
            </label>
            <div className="flex items-center gap-5 w-full px-6 py-4 bg-black border border-white/10 rounded-2xl focus-within:border-[#6dadbe]/50 transition-all group">
              <div className="text-slate-600 group-focus-within:text-[#6dadbe] transition-colors shrink-0">
                <Lock className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current token"
                required
                className="flex-1 bg-transparent text-lg text-slate-100 placeholder:text-slate-700 outline-none font-mono"
              />
            </div>
          </div>

          {/* New Password */}
          <div className="relative z-10">
            <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-[.3em] mb-3 ml-1">
              &gt; AUTH_KEY_NEW
            </label>
            <div className="flex items-center gap-5 w-full px-6 py-4 bg-black border border-white/10 rounded-2xl focus-within:border-[#6dadbe]/50 transition-all group">
              <div className="text-slate-600 group-focus-within:text-[#6dadbe] transition-colors shrink-0">
                <Lock className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new token"
                required
                className="flex-1 bg-transparent text-lg text-slate-100 placeholder:text-slate-700 outline-none font-mono"
              />
            </div>
          </div>

          {/* Confirm New Password */}
          <div className="relative z-10">
             <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-[.3em] mb-3 ml-1">
              &gt; AUTH_KEY_CONFIRM
            </label>
            <div className="flex items-center gap-5 w-full px-6 py-4 bg-black border border-white/10 rounded-2xl focus-within:border-[#6dadbe]/50 transition-all group">
              <div className="text-slate-600 group-focus-within:text-[#6dadbe] transition-colors shrink-0">
                <Lock className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <input
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="Confirm new token"
                required
                className="flex-1 bg-transparent text-lg text-slate-100 placeholder:text-slate-700 outline-none font-mono"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-6 relative z-10">
            <button
                type="submit"
                disabled={passwordLoading}
                className="h-14 px-10 text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-white bg-black border border-[#f59e0b] hover:bg-[#f59e0b]/10 rounded-2xl shadow-[0_4px_30px_rgba(245,158,11,0.2)] transition-all active:scale-95 disabled:opacity-30 flex items-center justify-center gap-3"
            >
              {passwordLoading ? (
                <div className="flex items-center gap-3">
                    <div className="w-4 h-4 border-2 border-[#f59e0b]/30 border-t-[#f59e0b] rounded-full animate-spin" />
                    UPDATING...
                </div>
              ) : "Save Changes"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
