import React from 'react';

const PageHeader = ({ title, subtitle, children }) => {
    return (
        <div className="flex items-center justify-between mb-10 pb-8 border-b border-white/5 relative">
            <div className="absolute -left-4 top-0 w-1 h-8 bg-amber-500/30 rounded-full" />
            <div>
                <h1 className="text-4xl font-light tracking-tight text-slate-100 flex items-center gap-4 lowercase">
                    {title?.split(' ').map((word, i) => i === title.split(' ').length - 1 ? <span key={i} className="font-bold text-white uppercase italic tracking-tighter">{word}</span> : word + ' ')}
                </h1>
                {subtitle && (
                    <p className="mt-3 text-slate-500 font-mono text-[10px] uppercase tracking-[0.3em] font-bold">
                        &gt; {subtitle}
                    </p>
                )}
            </div>
            {children && <div className="flex items-center gap-6">{children}</div>}
        </div>
    );
};

export default PageHeader;