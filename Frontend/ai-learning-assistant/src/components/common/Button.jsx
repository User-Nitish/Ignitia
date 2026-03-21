import React from "react";

const Button = ({
    children,
    onClick,
    type = "button",
    disabled = false,
    className = "",
    variant = "primary",
    size = "md",
}) => {
    const baseStyles =
        "inline-flex items-center justify-center gap-3 font-bold uppercase tracking-widest rounded-xl transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 whitespace-nowrap outline-none relative overflow-hidden group/btn shadow-[0_4px_15px_rgba(0,0,0,0.5)]";

    const variantStyles = {
        primary:
            "bg-black border border-white/10 hover:border-amber-500/50 hover:bg-amber-500/10 text-slate-200 hover:text-amber-400",
        secondary:
            "bg-white/5 border border-white/10 hover:border-amber-500/30 hover:bg-white/10 text-slate-300 hover:text-amber-500",
        outline:
            "border border-white/10 text-amber-500/70 bg-transparent hover:bg-amber-500/5 hover:border-amber-500/40 hover:text-amber-400",
    };

    const sizeStyles = {
        sm: "h-10 px-5 text-[10px]",
        md: "h-12 px-8 text-xs",
        lg: "h-14 px-10 text-sm",
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={[
                baseStyles,
                variantStyles[variant],
                sizeStyles[size],
                className,
            ].join(" ")}
        >
            {children}
        </button>
    );
};

export default Button;