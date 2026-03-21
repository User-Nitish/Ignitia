import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
    LayoutDashboard,
    FileText,
    User,
    LogOut,
    BrainCircuit,
    BookOpen,
    X,
} from "lucide-react";

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const navLinks = [
        { to: "/dashboard", icon: LayoutDashboard, text: "Dashboard" },
        { to: "/documents", icon: FileText, text: "Documents" },
        { to: "/flashcards", icon: BookOpen, text: "Flashcards" },
        { to: "/profile", icon: User, text: "Profile" },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ${isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                onClick={toggleSidebar}
            />

            {/* Sidebar aside */}
            <aside
                className={`fixed md:sticky top-0 left-0 z-50 w-72 h-screen bg-[#030a0a]/80 backdrop-blur-3xl border-r border-[#6dadbe]/10 transition-transform duration-500 ease-in-out flex flex-col ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                    }`}
            >
                {/* Logo and Close button */}
                <div className="flex items-center justify-between h-16 px-8 shrink-0 mt-8 mb-6">
                    <div className="flex items-center gap-4 group">
                        <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-[#030a0a] border border-[#6dadbe]/50 text-[#6dadbe] shadow-[0_0_20px_rgba(109,173,190,0.2)] group-hover:rotate-12 transition-all duration-500">
                            <BrainCircuit size={22} strokeWidth={1.5} />
                        </div>
                        <h1 className="text-2xl font-mono font-bold text-white tracking-[0.2em] uppercase">
                            Ignitia
                        </h1>
                    </div>
                    <button
                        onClick={toggleSidebar}
                        className="md:hidden text-slate-500 hover:text-slate-300 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-4 px-4 space-y-1 overflow-y-auto custom-scrollbar">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            onClick={() => isSidebarOpen && toggleSidebar()}
                            className={({ isActive }) =>
                                `group flex items-center gap-4 px-6 py-4 text-[10px] font-mono font-bold uppercase tracking-[.3em] rounded-2xl transition-all duration-500 ${isActive
                                    ? "bg-[#6dadbe]/10 text-[#6dadbe] border border-[#6dadbe]/30 shadow-[0_0_20px_rgba(109,173,190,0.1)]"
                                    : "text-slate-500 border border-transparent hover:bg-white/5 hover:text-[#6dadbe] hover:border-white/10"
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <link.icon
                                        size={18}
                                        strokeWidth={isActive ? 2 : 1.5}
                                        className={`transition-colors duration-300 ${isActive ? "text-[#6dadbe]" : "text-slate-500 group-hover:text-[#6dadbe]"
                                            }`}
                                    />
                                    <span>{link.text}</span>
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-6 mb-4 shrink-0 border-t border-white/5">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-4 px-6 py-4 text-[10px] font-mono font-bold uppercase tracking-[.3em] text-slate-600 hover:text-rose-500 hover:bg-rose-500/10 hover:border-rose-500/30 border border-transparent rounded-2xl transition-all duration-500 group"
                    >
                        <LogOut
                            size={18}
                            strokeWidth={1.5}
                            className="text-slate-600 group-hover:text-rose-500 transition-colors"
                        />
                        <span>Terminate</span>
                    </button>
                </div>
            </aside>
        </>
    );
};


export default Sidebar;