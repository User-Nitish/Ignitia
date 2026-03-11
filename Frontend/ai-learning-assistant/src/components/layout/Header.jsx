import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Bell, User, Menu } from "lucide-react";

const Header = ({ toggleSidebar }) => {
    const { user } = useAuth();

    return (
        <header className="sticky top-0 z-40 w-full h-16 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 flex items-center justify-between px-6">
            {/* Mobile Menu Button */}
            <button
                onClick={toggleSidebar}
                className="md:hidden inline-flex items-center justify-center w-10 h-10 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all duration-200"
                aria-label="Toggle sidebar"
            >
                <Menu size={24} />
            </button>

            <div className="flex-1 hidden md:block"></div>

            <div className="flex items-center gap-4">
                <button className="relative group inline-flex items-center justify-center w-10 h-10 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all duration-200">
                    <Bell size={20} strokeWidth={2} className="group-hover:scale-110 transition-transform" />
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white"></span>
                </button>

                {/* User Profile */}
                <div className="flex items-center gap-3 pl-4 border-l border-slate-200/60">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-semibold text-slate-900 leading-none mb-1">
                            {user?.username || "User"}
                        </p>
                        <p className="text-xs font-medium text-slate-500 leading-none">
                            {user?.email || "user@example.com"}
                        </p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm">
                        <User size={20} strokeWidth={2.5} />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;