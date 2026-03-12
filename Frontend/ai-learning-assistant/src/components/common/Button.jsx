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
            "bg-blue-600 border border-blue-600 text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 hover:border-blue-700 hover:-translate-y-0.5 active:translate-y-0 relative overflow-hidden before:absolute before:inset-0 before:bg-white/10 before:opacity-0 hover:before:opacity-100 before:transition-opacity",
        secondary:
            "bg-slate-100/80 border border-slate-200 text-slate-700 shadow-sm hover:shadow-md hover:bg-slate-200 hover:border-slate-300 hover:-translate-y-0.5 active:translate-y-0",
        outline:
            "border-2 border-slate-200 text-slate-700 bg-white hover:bg-slate-50 hover:border-blue-300 hover:text-blue-600 hover:-translate-y-0.5 active:translate-y-0",
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