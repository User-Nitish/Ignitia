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
            className="group bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all duration-300 cursor-pointer flex flex-col gap-4"
            onClick={handleStudyNow}
        >
            {/* Icon and Title */}
            <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-100">
                    <BookOpen className="w-5 h-5 text-emerald-600" strokeWidth={1.5} />
                </div>
                <div className="flex-1 min-w-0">
                    <h3
                        className="text-sm font-bold text-slate-800 truncate group-hover:text-emerald-700 transition-colors"
                        title={flashcardSet?.documentId?.title}
                    >
                        {flashcardSet?.documentId?.title}
                    </h3>
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mt-0.5">
                        Created {moment(flashcardSet.createdAt).fromNow()}
                    </p>
                </div>
            </div>

            {/* Stats Row */}
            <div className="flex items-center gap-3">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 rounded-full">
                    <span className="text-xs font-semibold text-slate-600">
                        {totalCards} {totalCards === 1 ? 'Card' : 'Cards'}
                    </span>
                </div>

                {reviewedCount > 0 && (
                    <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 border border-emerald-100 rounded-full">
                        <TrendingUp className="w-3 h-3 text-emerald-600" strokeWidth={2.5} />
                        <span className="text-xs font-bold text-emerald-600">
                            {progressPercentage}%
                        </span>
                    </div>
                )}
            </div>

            {/* Progress Bar */}
            {totalCards > 0 && (
                <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-medium text-slate-500">Progress</span>
                        <span className="text-xs font-semibold text-slate-600">
                            {reviewedCount}/{totalCards} reviewed
                        </span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-500"
                            style={{ width: `${progressPercentage}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Study Button */}
            <div className="pt-1">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleStudyNow();
                    }}
                    className="w-full relative group/btn flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-50 border border-emerald-200 hover:bg-emerald-500 hover:border-emerald-500 text-emerald-700 hover:text-white text-sm font-bold rounded-xl overflow-hidden transition-all duration-300"
                >
                    <Sparkles className="w-4 h-4" strokeWidth={2.5} />
                    Study Now
                </button>
            </div>
        </div>
    );
};

export default FlashcardSetCard;