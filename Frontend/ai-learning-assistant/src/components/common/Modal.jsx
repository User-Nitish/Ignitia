import React from "react";
import { X } from "lucide-react";

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity duration-300"
                onClick={onClose}
            ></div>

            {/* Modal Container */}
            <div className="relative w-full max-w-3xl bg-white/95 backdrop-blur-2xl border border-slate-200/60 rounded-3xl shadow-2xl shadow-slate-900/20 transform transition-all duration-300 scale-100 opacity-100 overflow-hidden">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-600 active:scale-95 transition-all duration-200 z-10"
                    aria-label="Close modal"
                >
                    <X className="w-5 h-5" strokeWidth={1.5} />
                </button>

                <div className="p-8">
                    {/* Title */}
                    <div className="mb-6 pr-10">
                        <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                            {title}
                        </h3>
                    </div>

                    {/* Content */}
                    <div className="relative">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;