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
                className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ${isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                onClick={toggleSidebar}
            />

            {/* Sidebar aside */}
            <aside
                className={`fixed md:sticky top-0 left-0 z-50 w-72 h-screen bg-white border-r border-slate-200/60 transition-transform duration-300 ease-in-out flex flex-col ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                    }`}
            >
                {/* Logo and Close button */}
                <div className="flex items-center justify-between h-16 px-6 border-b border-slate-200/60 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-md shadow-emerald-200">
                            <BrainCircuit className="text-white" size={20} strokeWidth={2.5} />
                        </div>
                        <h1 className="text-sm font-bold text-slate-900 tracking-tight">
                            AI Learning Assistant
                        </h1>
                    </div>
                    <button
                        onClick={toggleSidebar}
                        className="md:hidden text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5 custom-scrollbar">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            onClick={() => isSidebarOpen && toggleSidebar()}
                            className={({ isActive }) =>
                                `group flex items-center gap-3 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${isActive
                                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25"
                                    : "text-slate-600 hover:bg-slate-50 hover:text-emerald-600"
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <link.icon
                                        size={18}
                                        strokeWidth={isActive ? 2.5 : 2}
                                        className={`transition-transform duration-200 ${isActive ? "scale-110" : "group-hover:scale-110"
                                            }`}
                                    />
                                    <span>{link.text}</span>
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* Logout Section */}
                <div className="p-4 border-t border-slate-200/60 shrink-0">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 group"
                    >
                        <LogOut
                            size={18}
                            strokeWidth={2}
                            className="group-hover:-translate-x-1 transition-transform"
                        />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
};


export default Sidebar;