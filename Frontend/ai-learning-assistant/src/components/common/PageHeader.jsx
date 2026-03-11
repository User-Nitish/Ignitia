import React from 'react';

const PageHeader = ({ title, subtitle, children }) => {
    return (
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2 bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                    {title}
                </h1>
                {subtitle && (
                    <p className="text-slate-500 text-sm font-medium tracking-wide">
                        {subtitle}
                    </p>
                )}
            </div>
            {children && <div className="flex items-center gap-4">{children}</div>}
        </div>
    );
};

export default PageHeader;