import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import quizService from "../../services/quizService";
import PageHeader from "../../components/common/PageHeader";
import Spinner from "../../components/common/Spinner";
import toast from "react-hot-toast";
import Button from "../../components/common/Button";
import { motion } from "framer-motion";

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

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
        <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }} className="max-w-4xl mx-auto space-y-8 pb-12">
            <motion.div variants={itemVariants} className="flex items-center justify-between pb-4 border-b border-white/5 relative">
                <div className="absolute -left-4 top-0 w-1 h-3/4 bg-[#6dadbe]/30 rounded-full" />
                <PageHeader title={quiz.title || "Take Quiz"} subtitle="Quiz in Progress" />
                <button
                    onClick={() => navigate(-1)}
                    className="h-12 px-6 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-slate-500 hover:text-[#6dadbe] bg-white/5 border border-white/10 rounded-2xl hover:border-[#6dadbe]/30 hover:bg-[#6dadbe]/5 transition-all active:scale-95 flex items-center gap-2"
                >
                    <ChevronLeft size={16} />
                    Exit Quiz
                </button>
            </motion.div>

            {/* Progress Section */}
            <motion.div variants={itemVariants} className="bg-black/60 border border-white/10 p-8 rounded-[2.5rem] shadow-[0_8px_32px_rgba(0,0,0,0.4)] space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#6dadbe]/5 rounded-full blur-2xl pointer-events-none translate-x-1/2 -translate-y-1/2" />
                
                <div className="flex justify-between items-end relative z-10">
                    <div>
                        <p className="text-[10px] font-mono font-bold text-[#6dadbe]/50 uppercase tracking-[0.3em] mb-2">Quiz Progress</p>
                        <h3 className="text-3xl font-light text-slate-100 lowercase">
                            Question {currentQuestionIndex + 1} <span className="text-slate-500 font-bold uppercase italic text-xl ml-1">/ {quiz.questions.length}</span>
                        </h3>
                    </div>
                    <div className="text-right">
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#6dadbe]/5 text-[#6dadbe] text-[10px] font-mono font-bold border border-[#6dadbe]/20 uppercase tracking-widest">
                           {answeredCount} Answered
                        </span>
                    </div>
                </div>

                <div className="h-2 w-full bg-white/[0.03] rounded-full overflow-hidden border border-white/5 relative z-10">
                    <div
                        className="h-full bg-[#6dadbe] tracking-widest rounded-full transition-all duration-700 ease-out shadow-[0_0_15px_rgba(109,173,190,0.5)]"
                        style={{
                            width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%`,
                        }}
                    />
                </div>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-black/80 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 md:p-14 shadow-2xl shadow-black/60 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-80 h-80 bg-[#6dadbe]/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px] pointer-events-none" />

                <div className="flex items-center gap-4 mb-10 relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-black border border-[#6dadbe]/30 flex items-center justify-center shadow-[0_0_20px_rgba(109,173,190,0.1)] text-[#6dadbe] font-mono font-bold text-xl">
                        {String(currentQuestionIndex + 1).padStart(2, '0')}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-mono font-bold text-[#6dadbe] uppercase tracking-[0.3em]">Question Item</span>
                        <div className="flex gap-1 mt-1">
                           {[...Array(3)].map((_, i) => <div key={i} className="w-4 h-0.5 bg-[#6dadbe]/20 rounded-full" />)}
                        </div>
                    </div>
                </div>

                <h3 className="text-3xl md:text-4xl font-light text-slate-100 mb-12 leading-tight lowercase relative z-10 italic">
                    {currentQuestion.question?.split(' ').map((word, i) => i % 5 === 0 ? <span key={i} className="font-bold text-white uppercase not-italic tracking-tighter mr-2">{word}</span> : word + ' ')}
                </h3>

                <div className="grid grid-cols-1 gap-5 relative z-10">
                    {currentQuestion.options.map((option, index) => {
                        const isSelected = selectedAnswers[currentQuestion._id] === index;
                        return (
                            <label
                                key={index}
                                className={`group relative flex items-center p-6 border rounded-[1.5rem] cursor-pointer transition-all duration-500 ${isSelected
                                        ? "border-[#6dadbe] bg-[#6dadbe]/10 shadow-[0_0_20px_rgba(109,173,190,0.1)] scale-[1.01]"
                                        : "border-white/5 bg-white/[0.02] hover:border-[#6dadbe]/30 hover:bg-white/[0.05]"
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
                                    className={`shrink-0 w-6 h-6 rounded-lg border flex items-center justify-center transition-all duration-500 ${isSelected ? "border-[#6dadbe] bg-black" : "border-white/20 bg-black"
                                        }`}
                                >
                                    {isSelected && (
                                        <div className="w-2.5 h-2.5 bg-[#6dadbe] rounded-sm shadow-[0_0_8px_rgba(109,173,190,0.8)]" />
                                    )}
                                </div>

                                {/* Option Text */}
                                <span
                                    className={`ml-6 text-lg font-bold tracking-tight transition-colors duration-500 ${isSelected
                                            ? "text-white"
                                            : "text-slate-500 group-hover:text-slate-300"
                                        }`}
                                >
                                    {option}
                                </span>

                                {/* Selected Indicator */}
                                {isSelected && (
                                    <div className="ml-auto flex items-center gap-3">
                                       <span className="text-[9px] font-mono font-bold text-[#6dadbe] uppercase tracking-widest">SELECTED</span>
                                        <CheckCircle2
                                            className="text-[#6dadbe]"
                                            strokeWidth={1.5}
                                            size={20}
                                        />
                                    </div>
                                )}
                            </label>
                        );
                    })}
                </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-col md:flex-row items-center justify-between gap-8 pt-8 relative">
                <button
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestionIndex === 0 || submitting}
                    className="w-full md:w-auto h-14 px-8 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-slate-500 bg-white/5 border border-white/10 rounded-2xl hover:border-white/20 hover:bg-white/10 transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                    <ChevronLeft size={16} />
                    Previous
                </button>

                <div className="flex flex-wrap justify-center gap-3 px-6">
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
                                className={`w-11 h-11 rounded-xl font-mono text-xs font-bold transition-all duration-500 relative flex items-center justify-center ${isCurrent
                                        ? "bg-[#6dadbe] text-black shadow-[0_0_20px_rgba(109,173,190,0.5)] scale-110 z-10"
                                        : isAnsweredQuestion
                                            ? "bg-[#6dadbe]/10 text-[#6dadbe]/60 border border-[#6dadbe]/30"
                                            : "bg-black border border-white/10 text-slate-600 hover:border-white/20"
                                    } disabled:opacity-50`}
                            >
                                {String(index + 1).padStart(2, '0')}
                                {isCurrent && (
                                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-black/40 rounded-full" />
                                )}
                            </button>
                        );
                    })}
                </div>

                {currentQuestionIndex === quiz.questions.length - 1 ? (
                    <button
                        onClick={handleSubmitQuiz}
                        disabled={submitting || Object.keys(selectedAnswers).length < quiz.questions.length}
                        className="w-full md:w-auto h-14 px-12 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-white bg-black border border-[#6dadbe] hover:bg-[#6dadbe]/10 rounded-2xl shadow-[0_4px_30px_rgba(109,173,190,0.2)] transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    >
                        {submitting ? (
                            <div className="flex items-center gap-3">
                                <div className="w-4 h-4 border-2 border-[#6dadbe]/30 border-t-[#6dadbe] rounded-full animate-spin" />
                                SUBMITTING...
                            </div>
                        ) : (
                            "Submit Quiz"
                        )}
                    </button>
                ) : (
                    <button
                        onClick={handleNextQuestion}
                        disabled={submitting}
                        className="w-full md:w-auto h-14 px-12 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-white bg-white/[0.05] border border-white/10 hover:border-[#6dadbe]/50 hover:bg-[#6dadbe]/5 rounded-2xl shadow-xl transition-all active:scale-95 disabled:opacity-30 flex items-center justify-center gap-3"
                    >
                        Next
                        <ChevronRight size={16} />
                    </button>
                )}
            </motion.div>
        </motion.div>
    );
};

export default QuizTakePage;
