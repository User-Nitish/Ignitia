import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import quizService from "../../services/quizService";
import PageHeader from "../../components/common/PageHeader";
import Spinner from "../../components/common/Spinner";
import toast from "react-hot-toast";
import Button from "../../components/common/Button";

const QuizTakePage = () => {
    const { quizId } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const response = await quizService.getQuizById(quizId);
                setQuiz(response.data);
            } catch (error) {
                toast.error("Failed to fetch quiz.");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchQuiz();
    }, [quizId]);

    const handleOptionChange = (questionId, optionIndex) => {
        setSelectedAnswers((prev) => ({
            ...prev,
            [questionId]: optionIndex,
        }));
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < quiz.questions.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex((prev) => prev - 1);
        }
    };

    const handleSubmitQuiz = async () => {
        setSubmitting(true);
        try {
            const formattedAnswers = Object.keys(selectedAnswers).map((questionId) => {
                const question = quiz.questions.find((q) => q._id === questionId);
                const questionIndex = quiz.questions.findIndex((q) => q._id === questionId);
                const optionIndex = selectedAnswers[questionId];
                const selectedAnswer = question.options[optionIndex];
                return { questionIndex, selectedAnswer };
            });

            await quizService.submitQuiz(quizId, formattedAnswers);
            toast.success("Quiz submitted successfully!");
            navigate(`/quizzes/${quizId}/results`);
        } catch (error) {
            toast.error(error.message || "Failed to submit quiz.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Spinner />
            </div>
        );
    }

    if (!quiz || quiz.questions.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <p className="text-slate-600 text-lg">Quiz not found or has no questions.</p>
                </div>
            </div>
        );
    }
    const currentQuestion = quiz.questions[currentQuestionIndex];
    const isAnswered = selectedAnswers.hasOwnProperty(currentQuestion._id);
    const answeredCount = Object.keys(selectedAnswers).length;

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
            <div className="flex items-center justify-between pb-2">
                <PageHeader title={quiz.title || "Take Quiz"} />
                <Button
                    variant="secondary"
                    onClick={() => navigate(-1)}
                    className="rounded-xl border-slate-200"
                >
                    <ChevronLeft size={18} className="mr-1" />
                    Exit Quiz
                </Button>
            </div>

            {/* Progress Section */}
            <div className="bg-white/50 backdrop-blur-md p-6 rounded-[2rem] border border-slate-200/60 shadow-sm space-y-4">
                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Current Progress</p>
                        <h3 className="text-xl font-bold text-slate-800">
                            Question {currentQuestionIndex + 1} <span className="text-slate-400 font-medium">/ {quiz.questions.length}</span>
                        </h3>
                    </div>
                    <div className="text-right">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100 uppercase tracking-wider">
                            {answeredCount} Answered
                        </span>
                    </div>
                </div>

                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/50 p-0.5">
                    <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500 ease-out shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                        style={{
                            width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%`,
                        }}
                    />
                </div>
            </div>

            {/* Question Card */}
            <div className="bg-white/80 backdrop-blur-xl border border-emerald-100 rounded-[2.5rem] p-8 md:p-10 shadow-2xl shadow-emerald-100/20 relative overflow-hidden ring-1 ring-white/50">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50/50 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl -z-10" />

                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-200">
                        <span className="text-white font-bold">{currentQuestionIndex + 1}</span>
                    </div>
                    <span className="text-sm font-bold text-emerald-600 uppercase tracking-widest">Question Information</span>
                </div>

                <h3 className="text-2xl md:text-3xl font-bold text-slate-800 mb-10 leading-tight">
                    {currentQuestion.question}
                </h3>

                {/* Options Grid */}
                <div className="grid grid-cols-1 gap-4">
                    {currentQuestion.options.map((option, index) => {
                        const isSelected = selectedAnswers[currentQuestion._id] === index;
                        return (
                            <label
                                key={index}
                                className={`group relative flex items-center p-5 border-2 rounded-2xl cursor-pointer transition-all duration-300 ${isSelected
                                        ? "border-emerald-500 bg-emerald-50 shadow-xl shadow-emerald-500/10 scale-[1.01]"
                                        : "border-slate-100 bg-white hover:border-emerald-200 hover:bg-slate-50/50"
                                    }`}
                            >
                                <input
                                    type="radio"
                                    className="hidden"
                                    name={`question-${currentQuestion._id}`}
                                    value={index}
                                    checked={isSelected}
                                    onChange={() => handleOptionChange(currentQuestion._id, index)}
                                />

                                {/* Custom Radio Button */}
                                <div
                                    className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${isSelected ? "border-emerald-500 bg-emerald-500 shadow-sm" : "border-slate-200 bg-slate-50"
                                        }`}
                                >
                                    {isSelected && (
                                        <div className="w-2.5 h-2.5 bg-white rounded-full shadow-inner" />
                                    )}
                                </div>

                                {/* Option Text */}
                                <span
                                    className={`ml-5 text-base font-semibold transition-colors duration-200 ${isSelected
                                            ? "text-emerald-900"
                                            : "text-slate-600 group-hover:text-slate-900"
                                        }`}
                                >
                                    {option}
                                </span>

                                {/* Selected Indicator */}
                                {isSelected && (
                                    <CheckCircle2
                                        className="ml-auto text-emerald-600 animate-in zoom-in duration-300"
                                        strokeWidth={2.5}
                                        size={24}
                                    />
                                )}
                            </label>
                        );
                    })}
                </div>
            </div>

            {/* Navigation Controls */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-4">
                <Button
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestionIndex === 0 || submitting}
                    variant="secondary"
                    className="w-full md:w-auto rounded-xl border-slate-200 px-8 py-6 text-sm font-bold shadow-sm"
                >
                    <ChevronLeft className="mr-2" strokeWidth={2.5} size={18} />
                    Previous
                </Button>

                {/* Question Quick-Nav Dots */}
                <div className="flex flex-wrap justify-center gap-2 px-6">
                    {quiz.questions.map((_, index) => {
                        const isAnsweredQuestion = selectedAnswers.hasOwnProperty(
                            quiz.questions[index]._id
                        );
                        const isCurrent = index === currentQuestionIndex;

                        return (
                            <button
                                key={index}
                                onClick={() => setCurrentQuestionIndex(index)}
                                disabled={submitting}
                                className={`w-10 h-10 rounded-xl font-bold text-sm transition-all duration-300 ${isCurrent
                                        ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200 scale-110 ring-4 ring-emerald-100"
                                        : isAnsweredQuestion
                                            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                                            : "bg-white text-slate-400 hover:bg-slate-50 border border-slate-100"
                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                {index + 1}
                            </button>
                        );
                    })}
                </div>

                {currentQuestionIndex === quiz.questions.length - 1 ? (
                    <Button
                        onClick={handleSubmitQuiz}
                        disabled={submitting || Object.keys(selectedAnswers).length < quiz.questions.length}
                        className={`w-full md:w-auto rounded-xl px-12 py-6 text-sm font-bold shadow-lg shadow-emerald-200 transition-all ${submitting ? 'bg-slate-400' : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            }`}
                    >
                        {submitting ? (
                            <div className="flex items-center gap-2">
                                <Spinner size="sm" />
                                Submitting...
                            </div>
                        ) : (
                            "Submit Final Quiz"
                        )}
                    </Button>
                ) : (
                    <Button
                        onClick={handleNextQuestion}
                        disabled={submitting}
                        variant="primary"
                        className="w-full md:w-auto bg-slate-800 hover:bg-slate-900 text-white rounded-xl px-12 py-6 text-sm font-bold shadow-lg shadow-slate-200"
                    >
                        Next Question
                        <ChevronRight className="ml-2" strokeWidth={2.5} size={18} />
                    </Button>
                )}
            </div>
        </div>
    );
};

export default QuizTakePage;