import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Trash2, BookOpen, BrainCircuit, Clock } from 'lucide-react';
import moment from 'moment';

// Helper function to format file size
const formatFileSize = (bytes) => {
    if (bytes === undefined || bytes === null) return 'N/A';

    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`;
};

const DocumentCard = ({ document, onDelete }) => {
    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate(`/documents/${document._id}`);
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        onDelete(document);
    };

    return (
        <div
            className="group relative bg-[#030a0a]/60 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-6 hover:border-[#6dadbe]/30 transition-all duration-500 flex flex-col justify-between cursor-pointer overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
            onClick={handleNavigate}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#6dadbe]/5 rounded-full blur-2xl group-hover:bg-[#6dadbe]/10 transition-colors duration-500 translate-x-1/2 -translate-y-1/2" />

            {/* Header Section */}
            <div>
                <div className="flex items-start justify-between gap-3 mb-6 relative z-10">
                    <div className="shrink-0 w-12 h-12 bg-black border border-white/10 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(109,173,190,0.1)] group-hover:border-[#6dadbe]/50 group-hover:shadow-[0_0_20px_rgba(109,173,190,0.2)] transition-all duration-500">
                        <FileText className="w-6 h-6 text-[#6dadbe]" strokeWidth={1.5} />
                    </div>
                    <button
                        onClick={handleDelete}
                        className="opacity-0 group-hover:opacity-100 w-10 h-10 flex items-center justify-center text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl border border-transparent hover:border-rose-500/30 transition-all duration-300"
                    >
                        <Trash2 className="w-4 h-4" strokeWidth={2} />
                    </button>
                </div>

                {/* Title */}
                <h3
                    className="text-lg font-bold text-slate-100 truncate mb-2 tracking-tight group-hover:text-white transition-colors relative z-10"
                    title={document.title}
                >
                    {document.title}
                </h3>

                {/* Document Info */}
                <div className="flex items-center gap-3 text-[10px] text-slate-500 mb-6 font-mono font-bold tracking-widest relative z-10">
                    {document.fileSize !== undefined && (
                        <span className="bg-white/5 border border-white/10 px-2 py-0.5 rounded uppercase">
                            SIZE // {formatFileSize(document.fileSize)}
                        </span>
                    )}
                </div>

                {/* Stats Section */}
                <div className="flex items-center gap-3 relative z-10">
                    {document.flashcardCount !== undefined && (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#6dadbe]/5 text-[#6dadbe]/80 border border-[#6dadbe]/20 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider group-hover:bg-[#6dadbe]/10 transition-colors">
                            <BookOpen className="w-3.5 h-3.5" strokeWidth={1.5} />
                            <span>{document.flashcardCount} NODES</span>
                        </div>
                    )}

                    {document.quizCount !== undefined && (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#12768a]/5 text-[#6dadbe]/80 border border-[#12768a]/20 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider group-hover:bg-[#12768a]/10 transition-colors">
                            <BrainCircuit className="w-3.5 h-3.5" strokeWidth={1.5} />
                            <span>{document.quizCount} SIMS</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer Section */}
            <div className="mt-8 pt-5 border-t border-white/5 relative z-10">
                <div className="flex items-center gap-2 text-[9px] font-mono font-bold text-slate-500 uppercase tracking-[0.2em]">
                    <Clock className="w-3.5 h-3.5 text-[#6dadbe]/40" strokeWidth={1.5} />
                    <span>Logged {moment(document.createdAt).fromNow()}</span>
                </div>
            </div>

            {/* Hover Indicator */}
            <div className="absolute inset-x-0 bottom-0 h-[2px] bg-[#6dadbe] scale-x-0 group-hover:scale-x-50 transition-transform duration-500 origin-center opacity-40 shadow-[0_0_10px_rgba(109,173,190,0.5)]" />
        </div>
    );
};
export default DocumentCard;