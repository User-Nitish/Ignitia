import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Bell, User, Menu } from "lucide-react";

const Header = ({ toggleSidebar }) => {
    const { user } = useAuth();
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const notificationRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setIsNotificationsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="sticky top-0 z-40 w-full h-16 bg-white/60 backdrop-blur-2xl border-b border-slate-200/50 flex items-center justify-between px-6 transition-all duration-300">
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
                <div className="relative" ref={notificationRef}>
                    <button 
                        onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                        className={`group inline-flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 ${isNotificationsOpen ? 'text-amber-600 bg-amber-100' : 'text-slate-600 hover:text-amber-500 hover:bg-amber-50'}`}
                    >
                        <Bell size={20} strokeWidth={2} className={`${isNotificationsOpen ? '' : 'group-hover:scale-110'} transition-transform`} />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border border-white"></span>
                    </button>

                    {/* Notification Dropdown */}
                    {isNotificationsOpen && (
                        <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200 origin-top-right">
                            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                <h3 className="font-bold text-slate-800">Notifications</h3>
                                <span className="text-xs font-semibold px-2 py-1 bg-amber-100 text-amber-700 rounded-md">
                                    New
                                </span>
                            </div>
                            <div className="p-6 text-center">
                                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Bell size={20} className="text-slate-400" />
                                </div>
                                <p className="text-sm font-medium text-slate-600">No new notifications</p>
                                <p className="text-xs text-slate-400 mt-1">We'll let you know when something arrives.</p>
                            </div>
                        </div>
                    )}
                </div>

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
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm transition-transform duration-300 hover:scale-105 hover:shadow-md cursor-pointer">
                        <User size={20} strokeWidth={2.5} />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;