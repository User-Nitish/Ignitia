import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import quizService from "../../services/quizService";
import PageHeader from "../../components/common/PageHeader";
import Spinner from "../../components/common/Spinner";
import Button from "../../components/common/Button";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Trophy,
  Target,
  BookOpen,
} from "lucide-react";
import moment from "moment";

const QuizResultPage = () => {
  const { quizId } = useParams();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const data = await quizService.getQuizResults(quizId);
        setResults(data);
      } catch (error) {
        toast.error("Failed to fetch quiz results.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [quizId]);

  if (loading) {
    return (
      <div className="flex item-center justify-center min-h-[60vh]">
        <Spinner />
      </div>
    );
  }

  if (!results || !results.data) {
    return (
      <div className="flex item-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-slate-600 text-lg">Quiz results not found.</p>
        </div>
      </div>
    );
  }

  const {
    data: { quiz, results: detailedResults },
  } = results;

  const score = quiz.score;
  const totalQuestions = detailedResults.length;
  const correctAnswers = detailedResults.filter((r) => r.isCorrect).length;
  const incorrectAnswers = totalQuestions - correctAnswers;

  const getScoreColor = (score) => {
    if (score >= 80) return "from-emerald-500 to-teal-500";
    if (score >= 60) return "from-amber-500 to-orange-500";
    return "from-rose-500 to-red-500";
  };

  const getScoreMessage = (score) => {
    if (score >= 90) return "Outstanding!";
    if (score >= 80) return "Great job!";
    if (score >= 70) return "Good work!";
    if (score >= 60) return "Not bad!";
    return "Keep practicing!";
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      {/* Back Header */}
      <div className="flex items-center justify-between">
        <Link
          to={`/documents/${quiz.document._id}`}
          className="group inline-flex items-center gap-2.5 text-sm font-bold text-slate-500 hover:text-emerald-700 transition-all duration-300"
        >
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-emerald-50 transition-colors">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" strokeWidth={2.5} />
          </div>
          Back to Document
        </Link>
        <div className="text-right">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Assessment Completed</p>
          <p className="text-sm font-semibold text-slate-600">{moment(quiz.createdAt).format("MMMM Do, YYYY")}</p>
        </div>
      </div>

      <PageHeader title={`${quiz.title || "Quiz"} Results`} />

      {/* Hero Score Card */}
      <div className="relative overflow-hidden bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-[3rem] shadow-2xl shadow-slate-200/50 p-10 md:p-12">
        <div className={`absolute top-0 right-0 w-80 h-80 bg-gradient-to-br ${getScoreColor(score)} opacity-5 blur-[100px] -z-10`} />

        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
          <div className="relative">
            <div className={`w-48 h-48 rounded-full border-[12px] border-slate-50 flex items-center justify-center shadow-inner relative z-10`}>
              <div className="text-center">
                <span className={`text-6xl font-black bg-gradient-to-r ${getScoreColor(score)} bg-clip-text text-transparent`}>
                  {score}%
                </span>
              </div>
            </div>
            <div className={`absolute -inset-4 rounded-full bg-gradient-to-r ${getScoreColor(score)} opacity-20 blur-xl -z-0 animate-pulse`} />
            <div className="absolute -top-2 -right-2 w-12 h-12 rounded-2xl bg-white shadow-xl flex items-center justify-center border border-slate-100">
              <Trophy className="text-amber-500" size={24} strokeWidth={2.5} />
            </div>
          </div>

          <div className="flex-1 text-center md:text-left space-y-4">
            <h2 className="text-4xl font-black text-slate-800 tracking-tight">
              {getScoreMessage(score)}
            </h2>
            <p className="text-lg text-slate-500 font-medium max-w-md">
              You've completed the assessment on <span className="text-slate-800 font-bold">"{quiz.document.title}"</span>.
              Review your answers below to strengthen your understanding.
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-4">
              <div className="flex items-center gap-3 px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl">
                <Target className="text-slate-400" size={20} strokeWidth={2.5} />
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total</p>
                  <p className="text-sm font-bold text-slate-700">{totalQuestions} Questions</p>
                </div>
              </div>

              <div className="flex items-center gap-3 px-5 py-3 bg-emerald-50 border border-emerald-100 rounded-2xl">
                <CheckCircle2 className="text-emerald-500" size={20} strokeWidth={2.5} />
                <div>
                  <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Correct</p>
                  <p className="text-sm font-bold text-emerald-700">{correctAnswers} Hits</p>
                </div>
              </div>

              <div className="flex items-center gap-3 px-5 py-3 bg-rose-50 border border-rose-100 rounded-2xl">
                <XCircle className="text-rose-500" size={20} strokeWidth={2.5} />
                <div>
                  <p className="text-[10px] font-bold text-rose-400 uppercase tracking-widest">Missed</p>
                  <p className="text-sm font-bold text-rose-700">{incorrectAnswers} Incorrect</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Review Section */}
      <div className="space-y-8">
        <div className="flex items-center gap-4 px-2">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center shadow-lg shadow-slate-200">
            <BookOpen className="text-white" size={24} strokeWidth={2} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">Step-by-Step Review</h3>
            <p className="text-slate-500 font-medium">Analyze each response and explanation</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {detailedResults.map((result, index) => {
            const userAnswerIndex = result.options.findIndex(
              (opt) => opt === result.selectedAnswer
            );
            const correctAnswerIndex = result.options.findIndex(
              (opt) => opt === result.correctAnswer
            );
            const isCorrect = result.isCorrect;

            return (
              <div
                key={index}
                className={`group relative bg-white border-2 rounded-[2.5rem] overflow-hidden transition-all duration-300 ${isCorrect ? "border-emerald-100 hover:border-emerald-200" : "border-rose-100 hover:border-rose-200"
                  }`}
              >
                {/* Question Header */}
                <div className={`p-8 md:p-10 ${isCorrect ? "bg-emerald-50/30" : "bg-rose-50/30"}`}>
                  <div className="flex justify-between items-start gap-6 mb-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${isCorrect ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200" : "bg-rose-600 text-white shadow-lg shadow-rose-200"
                        }`}>
                        {index + 1}
                      </div>
                      <span className={`text-xs font-black uppercase tracking-[0.2em] ${isCorrect ? "text-emerald-600" : "text-rose-600"}`}>
                        {isCorrect ? "Correct Achievement" : "Learning Opportunity"}
                      </span>
                    </div>
                    {isCorrect ? (
                      <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-full text-xs font-black uppercase tracking-wider shadow-lg shadow-emerald-200">
                        <CheckCircle2 size={16} strokeWidth={3} />
                        Perfect
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 px-4 py-2 bg-rose-500 text-white rounded-full text-xs font-black uppercase tracking-wider shadow-lg shadow-rose-200">
                        <XCircle size={16} strokeWidth={3} />
                        Review
                      </div>
                    )}
                  </div>
                  <h4 className="text-xl md:text-2xl font-bold text-slate-800 leading-tight">
                    {result.question}
                  </h4>
                </div>

                {/* Options Review */}
                <div className="p-8 md:p-10 pt-0 space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    {result.options.map((option, optIndex) => {
                      const isCorrectOption = optIndex === correctAnswerIndex;
                      const isUserAnswer = optIndex === userAnswerIndex;
                      const isWrongChoice = isUserAnswer && !isCorrect;

                      return (
                        <div
                          key={optIndex}
                          className={`relative flex items-center p-5 rounded-2xl border-2 transition-all duration-300 ${isCorrectOption
                            ? "bg-emerald-50 border-emerald-500 shadow-lg shadow-emerald-100/50 scale-[1.01]"
                            : isWrongChoice
                              ? "bg-rose-50 border-rose-500"
                              : "bg-white border-slate-100"
                            }`}
                        >
                          <div className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${isCorrectOption ? "border-emerald-500 bg-emerald-500" : isWrongChoice ? "border-rose-500 bg-rose-500" : "border-slate-200"
                            }`}>
                            {isCorrectOption ? <CheckCircle2 size={14} className="text-white" strokeWidth={3} /> : isWrongChoice ? <XCircle size={14} className="text-white" strokeWidth={3} /> : null}
                          </div>

                          <span className={`ml-4 text-base font-bold ${isCorrectOption ? "text-emerald-900" : isWrongChoice ? "text-rose-900" : "text-slate-600"
                            }`}>
                            {option}
                          </span>

                          <div className="ml-auto">
                            {isCorrectOption && (
                              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-lg">Correct Answer</span>
                            )}
                            {isWrongChoice && (
                              <span className="px-3 py-1 bg-rose-100 text-rose-700 text-[10px] font-black uppercase tracking-widest rounded-lg">Your Selection</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation Block */}
                  {result.explanation && (
                    <div className={`mt-8 p-6 rounded-3xl border ${isCorrect ? "bg-emerald-50/50 border-emerald-100" : "bg-blue-50/50 border-blue-100"}`}>
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`p-2 rounded-xl ${isCorrect ? "bg-emerald-100 text-emerald-600" : "bg-blue-100 text-blue-600"}`}>
                          <BookOpen size={18} strokeWidth={2.5} />
                        </div>
                        <span className={`text-xs font-black uppercase tracking-widest ${isCorrect ? "text-emerald-700" : "text-blue-700"}`}>Explanation</span>
                      </div>
                      <p className={`text-sm font-medium leading-relaxed ${isCorrect ? "text-emerald-800/80" : "text-blue-800/80"}`}>
                        {result.explanation}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex justify-center pt-6">
        <Link to={`/documents/${quiz.document._id}`}>
          <Button className="px-12 py-8 bg-slate-800 hover:bg-slate-900 text-white rounded-[2rem] text-lg font-bold shadow-2xl shadow-slate-200 transition-all hover:scale-105 active:scale-95 flex items-center gap-4">
            <ArrowLeft strokeWidth={2.5} />
            Return to Study Deck
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default QuizResultPage;