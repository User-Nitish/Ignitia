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
        "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 whitespace-nowrap";

    const variantStyles = {
        primary:
            "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5 active:translate-y-0",
        secondary:
            "bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 shadow-sm hover:shadow-md hover:bg-slate-200 hover:-translate-y-0.5 active:translate-y-0",
        outline:
            "border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-300 hover:-translate-y-0.5 active:translate-y-0",
    };

    const sizeStyles = {
        sm: "h-9 px-4 text-xs",
        md: "h-11 px-5 text-sm",
        lg: "h-13 px-6 text-base",
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