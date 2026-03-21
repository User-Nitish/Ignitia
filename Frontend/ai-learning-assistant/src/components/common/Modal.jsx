import React from "react";
import { X } from "lucide-react";

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/90 backdrop-blur-xl transition-opacity duration-500"
                onClick={onClose}
            ></div>

            {/* Modal Container */}
            <div className="relative w-full max-w-3xl bg-[#0a0a0c] border border-white/10 rounded-[3rem] shadow-[0_12px_64px_rgba(0,0,0,0.8)] transform transition-all duration-500 scale-100 opacity-100 overflow-hidden animate-in fade-in zoom-in-95">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-[80px] pointer-events-none translate-x-1/2 -translate-y-1/2" />
                
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center rounded-2xl bg-white/[0.03] text-slate-500 hover:text-white hover:bg-white/10 hover:border-white/10 border border-transparent active:scale-95 transition-all duration-300 z-50"
                    aria-label="Close modal"
                >
                    <X className="w-5 h-5" strokeWidth={1.5} />
                </button>

                <div className="p-8">
                    {/* Title */}
                    <div className="mb-8 pr-12 relative z-10">
                        <div className="flex items-center gap-3 mb-2">
                           <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                           <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-amber-500 uppercase">Input Required</span>
                        </div>
                        <h3 className="text-3xl font-light text-slate-100 tracking-tight lowercase">
                            {title?.split(' ').map((word, i) => i === title.split(' ').length - 1 ? <span key={i} className="font-bold text-white uppercase italic text-2xl ml-1">{word}</span> : word + ' ')}
                        </h3>
                    </div>

                    {/* Content */}
                    <div className="relative z-10">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;