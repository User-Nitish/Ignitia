import React, { useState, useEffect } from "react";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import Spinner from "../../components/common/Spinner";
import authService from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { User, Mail, Lock } from "lucide-react";

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
    <div className="max-w-2xl space-y-6 pb-12">
      <PageHeader title="Profile Settings" />

      {/* User Information Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
        <h3 className="text-base font-bold text-slate-800">
          User Information
        </h3>

        <div className="space-y-4">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-slate-500 mb-1.5">
              Username
            </label>
            <div className="flex items-center gap-3 w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700">
              <div className="text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <p className="text-sm font-semibold text-slate-700">{username}</p>
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-500 mb-1.5">
              Email Address
            </label>
            <div className="flex items-center gap-3 w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700">
              <div className="text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <p className="text-sm font-semibold text-slate-700">{email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
        <h3 className="text-base font-bold text-slate-800">
          Change Password
        </h3>

        <form onSubmit={handleChangePassword} className="space-y-4">
          {/* Current Password */}
          <div>
            <label className="block text-sm font-medium text-slate-500 mb-1.5">
              Current Password
            </label>
            <div className="flex items-center gap-3 w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100 transition-all">
              <div className="text-slate-400 flex-shrink-0">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                required
                className="flex-1 bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none"
              />
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-slate-500 mb-1.5">
              New Password
            </label>
            <div className="flex items-center gap-3 w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100 transition-all">
              <div className="text-slate-400 flex-shrink-0">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                required
                className="flex-1 bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none"
              />
            </div>
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="block text-sm font-medium text-slate-500 mb-1.5">
              Confirm New Password
            </label>
            <div className="flex items-center gap-3 w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100 transition-all">
              <div className="text-slate-400 flex-shrink-0">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="Confirm new password"
                required
                className="flex-1 bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              disabled={passwordLoading}
              className="flex items-center gap-2 px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-emerald-200 transition-all duration-200"
            >
              {passwordLoading ? "Updating..." : "Change Password"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;