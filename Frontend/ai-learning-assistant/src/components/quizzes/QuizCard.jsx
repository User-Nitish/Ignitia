import React from "react";
import { Link } from "react-router-dom";
import { Play, BarChart2, Trash2, Award, BookOpen } from "lucide-react";
import moment from "moment";

const QuizCard = ({ quiz, onDelete }) => {
    return (
        <div className="group relative bg-black/60 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-7 transition-all duration-500 hover:border-[#6dadbe]/30 overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent pointer-events-none" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#6dadbe]/5 rounded-full blur-2xl group-hover:bg-[#6dadbe]/10 transition-colors duration-500 translate-x-1/2 -translate-y-1/2" />

            {/* Delete Button */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete(quiz);
                }}
                className="absolute top-6 right-6 p-2 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl border border-transparent hover:border-rose-500/30 transition-all duration-300 z-10"
                title="Delete Quiz"
            >
                <Trash2 className="w-4 h-4" strokeWidth={1.5} />
            </button>

            <div className="space-y-5">
                {/* Score Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black border border-white/10 group-hover:border-[#6dadbe]/30 transition-colors relative z-10">
                    <Award className="w-3.5 h-3.5 text-[#6dadbe]" strokeWidth={1.5} />
                    <span className="text-[10px] font-mono font-bold text-[#6dadbe]/80 uppercase tracking-widest">
                        SCORE: {quiz?.score ?? 0}
                    </span>
                </div>

                <div className="relative z-10">
                    <h3 className="text-lg font-bold text-slate-100 mb-2 truncate tracking-tight group-hover:text-white transition-colors">
                        {quiz.title || `Quiz_${moment(quiz.createdAt).format("MMDD")}`}
                    </h3>
                    <p className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-[0.2em]">
                        CREATED: {moment(quiz.createdAt).fromNow()}
                    </p>
                </div>

                {/* Quiz Info Stats */}
                <div className="flex items-center gap-4 py-1 relative z-10">
                    <div className="flex items-center gap-2 text-slate-400 font-mono text-[10px] uppercase font-bold tracking-wider">
                        <BookOpen className="w-3.5 h-3.5 text-[#6dadbe]/40" strokeWidth={1.5} />
                        <span>{quiz.questions.length} QUESTIONS</span>
                    </div>
                </div>

                {/* Action Button */}
                <div className="pt-4 relative z-10">
                    {quiz?.userAnswers?.length > 0 ? (
                        <Link to={`/quizzes/${quiz._id}/results`} className="block">
                            <button className="w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-white/5 hover:bg-[#6dadbe]/10 text-[#6dadbe] text-[10px] font-mono font-bold uppercase tracking-[0.2em] rounded-2xl border border-white/10 hover:border-[#6dadbe]/40 transition-all active:scale-[0.98]">
                                <BarChart2 className="w-4 h-4" strokeWidth={1.5} />
                                View Results
                            </button>
                        </Link>
                    ) : (
                        <Link to={`/quizzes/${quiz._id}`} className="block">
                            <button className="w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-black border border-[#6dadbe]/50 hover:bg-[#6dadbe]/10 hover:border-[#6dadbe] text-white text-[10px] font-mono font-bold uppercase tracking-[0.2em] rounded-2xl shadow-[0_4px_20px_rgba(109,173,190,0.1)] transition-all active:scale-[0.98]">
                                <Play className="w-3.5 h-3.5 fill-[#6dadbe] text-[#6dadbe]" strokeWidth={1.5} />
                                Start Quiz
                            </button>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuizCard;