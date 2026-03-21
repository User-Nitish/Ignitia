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
        <header className="sticky top-0 z-40 w-full h-16 glass border-b-0 flex items-center justify-between px-6">
            {/* Mobile Menu Button */}
            <button
                onClick={toggleSidebar}
                className="md:hidden inline-flex items-center justify-center w-10 h-10 text-slate-400 hover:text-slate-200 hover:bg-white/10 rounded-xl transition-all duration-200"
                aria-label="Toggle sidebar"
            >
                <Menu size={20} strokeWidth={2} />
            </button>

            <div className="flex-1 hidden md:block"></div>

            <div className="flex items-center gap-6">
                <div className="relative" ref={notificationRef}>
                    <button 
                        onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                        className={`group inline-flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${isNotificationsOpen ? 'text-[#6dadbe] bg-[#6dadbe]/10' : 'text-slate-400 hover:text-slate-200 hover:bg-white/10'}`}
                    >
                        <Bell size={18} strokeWidth={2} className={`${isNotificationsOpen ? '' : 'group-hover:scale-105'} transition-transform`} />
                        <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-[#6dadbe] rounded-full shadow-[0_0_8px_rgba(109,173,190,0.8)]"></span>
                    </button>

                    {/* Notification Dropdown */}
                    {isNotificationsOpen && (
                        <div className="absolute right-0 mt-4 w-96 bg-black/80 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] overflow-hidden z-50 animate-in fade-in slide-in-from-top-4 duration-500 origin-top-right shadow-[0_20px_80px_rgba(0,0,0,0.8)]">
                            <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                                <h3 className="text-[10px] font-mono font-bold text-[#6dadbe] uppercase tracking-[0.4em]">Notifications</h3>
                                <div className="w-1.5 h-1.5 rounded-full bg-[#6dadbe] animate-pulse" />
                            </div>
                            <div className="p-12 text-center">
                                <div className="w-16 h-16 bg-black border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(109,173,190,0.1)]">
                                    <Bell size={24} strokeWidth={1.5} className="text-[#6dadbe]/40" />
                                </div>
                                <p className="text-lg font-light text-slate-200 lowercase italic">No new <span className="font-bold uppercase not-italic tracking-tighter">notifications</span></p>
                                <p className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest mt-2">&gt; System synchronization active...</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* User Profile */}
                <div className="flex items-center gap-3 pl-6 border-l border-white/10 group cursor-pointer">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-semibold text-slate-100 leading-none mb-1 group-hover:text-[#6dadbe] transition-colors uppercase tracking-wider">
                            {user?.username || "User"}
                        </p>
                        <p className="text-[10px] font-mono tracking-widest text-slate-500 leading-none uppercase">
                            {user?.email || "user@example.com"}
                        </p>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 transition-all duration-300 group-hover:bg-[#6dadbe]/10 group-hover:text-[#6dadbe] group-hover:border-[#6dadbe]/30">
                        <User size={16} strokeWidth={2} />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;