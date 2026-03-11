import React from "react";
import { FileText, Plus } from "lucide-react";

const EmptyState = ({ onActionClick, title, description, buttonText }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-gradient-to-t">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r">
        <FileText className="w-8 h-8 text-slate-400" strokeWidth={2} />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 mb-8 max-w-sm leading-relaxed">
        {description}
      </p>
      {buttonText && onActionClick && (
        <button
          onClick={onActionClick}
          className="group relative inline-flex items-center gap-2 px-6 h-11 bg-gradient-to-r"
        >
          <span className="relative z-10 flex items-center gap-2">
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            {buttonText}
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-white/80" />
        </button>
      )}
    </div>
  );
};

export default EmptyState;