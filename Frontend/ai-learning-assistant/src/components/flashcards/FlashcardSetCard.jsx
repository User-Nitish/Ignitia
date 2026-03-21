import React from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Sparkles, TrendingUp } from "lucide-react";
import moment from "moment";

const FlashcardSetCard = ({ flashcardSet }) => {
    const navigate = useNavigate();

    const handleStudyNow = () => {
        // documentId may be a populated object {_id, title} or a raw ObjectId string
        const docId = flashcardSet?.documentId?._id || flashcardSet?.documentId;
        if (docId) navigate(`/documents/${docId}/flashcards`);
    };

    const reviewedCount = flashcardSet.cards.filter(card => card.lastReviewed).length;
    const totalCards = flashcardSet.cards.length;
    const progressPercentage = totalCards > 0 ? Math.round((reviewedCount / totalCards) * 100) : 0;

    return (
        <div
            className="group relative bg-black/60 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-7 transition-all duration-500 hover:border-[#6dadbe]/30 overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)] cursor-pointer"
            onClick={handleStudyNow}
        >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#6dadbe]/5 rounded-full blur-2xl group-hover:bg-[#6dadbe]/10 transition-colors duration-500 translate-x-1/2 -translate-y-1/2" />

            {/* Icon and Title */}
            <div className="flex items-start gap-4 relative z-10 mb-2">
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-black border border-white/5 flex items-center justify-center group-hover:border-[#6dadbe]/30 transition-all">
                    <BookOpen className="w-5 h-5 text-[#6dadbe]/50 group-hover:text-[#6dadbe] transition-all" strokeWidth={1.5} />
                </div>
                <div className="flex-1 min-w-0">
                    <h3
                        className="text-lg font-bold text-slate-100 truncate group-hover:text-white transition-colors tracking-tight"
                        title={flashcardSet?.documentId?.title}
                    >
                        {flashcardSet?.documentId?.title || "UNNAMED_DATA_SET"}
                    </h3>
                    <p className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-[.2em] mt-1">
                        RECORDED // {moment(flashcardSet.createdAt).fromNow()}
                    </p>
                </div>
            </div>

            {/* Stats Row */}
            <div className="flex items-center gap-3 relative z-10 mb-2">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-black border border-white/5 rounded-lg group-hover:border-[#6dadbe]/20 transition-all">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                        {totalCards} UNITS
                    </span>
                </div>

                {reviewedCount > 0 && (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#6dadbe]/5 border border-[#6dadbe]/20 rounded-lg">
                        <TrendingUp className="w-3.5 h-3.5 text-[#6dadbe]" strokeWidth={1.5} />
                        <span className="text-[10px] font-mono font-bold text-[#6dadbe]">
                            {progressPercentage}.0_RET
                        </span>
                    </div>
                )}
            </div>

            {/* Progress Bar */}
            {totalCards > 0 && (
                <div className="space-y-3 relative z-10">
                    <div className="flex justify-between items-center px-1">
                        <span className="text-[9px] font-mono font-bold text-slate-600 uppercase tracking-widest">NEURAL_SYNC</span>
                        <span className="text-[10px] font-mono font-bold text-slate-400">
                            {reviewedCount}/{totalCards} OK
                        </span>
                    </div>
                    <div className="h-1.5 bg-white/[0.03] rounded-full overflow-hidden border border-white/5">
                        <div
                            className="h-full bg-[#6dadbe] rounded-full transition-all duration-700 ease-out shadow-[0_0_10px_rgba(109,173,190,0.5)]"
                            style={{ width: `${progressPercentage}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Study Button */}
            <div className="pt-4 relative z-10">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleStudyNow();
                    }}
                    className="w-full h-12 flex items-center justify-center gap-3 bg-black border border-[#6dadbe]/50 hover:bg-[#6dadbe]/10 hover:border-[#6dadbe] text-white text-[10px] font-mono font-bold uppercase tracking-[0.2em] rounded-2xl shadow-[0_4px_20px_rgba(109,173,190,0.1)] transition-all active:scale-[0.98]"
                >
                    <Sparkles className="w-3.5 h-3.5 text-[#6dadbe]" strokeWidth={1.5} />
                    Begin Sync
                </button>
            </div>
        </div>
    );
};

export default FlashcardSetCard;