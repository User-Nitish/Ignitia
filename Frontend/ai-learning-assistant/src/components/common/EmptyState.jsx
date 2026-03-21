import React from "react";
import { FileText, Plus } from "lucide-react";

const EmptyState = ({ onActionClick, title, description, buttonText }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 border border-white/10">
        <FileText className="w-8 h-8 text-slate-500" strokeWidth={2} />
      </div>
      <h3 className="text-lg font-semibold text-slate-100 mb-2 mt-4">{title}</h3>
      <p className="text-sm text-slate-400 mb-8 max-w-sm leading-relaxed">
        {description}
      </p>
      {buttonText && onActionClick && (
        <button
          onClick={onActionClick}
          className="group relative inline-flex items-center gap-2 px-6 h-11 bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20 text-indigo-400 font-semibold rounded-xl shadow-sm transition-all"
        >
          <span className="relative z-10 flex items-center gap-2">
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            {buttonText}
          </span>
        </button>
      )}
    </div>
  );
};

export default EmptyState;