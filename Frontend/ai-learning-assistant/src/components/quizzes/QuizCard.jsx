import React from "react";
import { Link } from "react-router-dom";
import { Play, BarChart2, Trash2, Award, BookOpen } from "lucide-react";
import moment from "moment";

const QuizCard = ({ quiz, onDelete }) => {
    return (
        <div className="group relative bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-[2rem] p-6 shadow-xl shadow-slate-200/50 hover:shadow-indigo-100/50 transition-all duration-300 hover:-translate-y-1">
            {/* Delete Button */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete(quiz);
                }}
                className="absolute top-4 right-4 p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all duration-200"
                title="Delete Quiz"
            >
                <Trash2 className="w-5 h-5" strokeWidth={2} />
            </button>

            <div className="space-y-5">
                {/* Score Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 shadow-sm">
                    <Award className="w-4 h-4 text-indigo-600" strokeWidth={2.5} />
                    <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
                        Score: {quiz?.score ?? 0}%
                    </span>
                </div>

                <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-1.5 line-clamp-1 group-hover:text-indigo-700 transition-colors">
                        {quiz.title || `Quiz - ${moment(quiz.createdAt).format("MMM D")}`}
                    </h3>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-tight">
                        Created {moment(quiz.createdAt).fromNow()}
                    </p>
                </div>

                {/* Quiz Info Stats */}
                <div className="flex items-center gap-4 py-1">
                    <div className="flex items-center gap-1.5 text-slate-600">
                        <BookOpen className="w-4 h-4" strokeWidth={2} />
                        <span className="text-sm font-semibold">
                            {quiz.questions.length} {quiz.questions.length === 1 ? "Question" : "Questions"}
                        </span>
                    </div>
                </div>

                {/* Action Button */}
                <div className="pt-2">
                    {quiz?.userAnswers?.length > 0 ? (
                        <Link to={`/quizzes/${quiz._id}/results`} className="block">
                            <button className="w-full relative group/btn flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 hover:from-purple-600 hover:via-fuchsia-600 hover:to-pink-600 text-white text-sm font-bold rounded-2xl overflow-hidden transition-all duration-300 shadow-lg shadow-fuchsia-300/50 hover:shadow-fuchsia-400/60 hover:scale-[1.02]">
                                <BarChart2 className="w-4 h-4" strokeWidth={2.5} />
                                View Results
                                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                            </button>
                        </Link>
                    ) : (
                        <Link to={`/quizzes/${quiz._id}`} className="block">
                            <button className="w-full relative group/btn flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-2xl overflow-hidden transition-all duration-200 shadow-lg shadow-indigo-200">
                                <Play className="w-4 h-4 fill-current" strokeWidth={2.5} />
                                Start Quiz
                                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-500" />
                            </button>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuizCard;