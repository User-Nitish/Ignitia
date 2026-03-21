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
import { motion } from "framer-motion";

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

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
    if (score >= 80) return "from-emerald-500 to-[#6dadbe]";
    if (score >= 60) return "from-[#6dadbe] to-[#12768a]";
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
    <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }} className="max-w-5xl mx-auto space-y-10 pb-20">
      {/* Back Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between pb-4 border-b border-white/5 relative">
        <div className="absolute -left-4 top-0 w-1 h-3/4 bg-amber-500/30 rounded-full" />
        <Link
          to={`/documents/${quiz.document._id}`}
          className="h-12 px-6 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-slate-500 hover:text-[#6dadbe] bg-white/5 border border-white/10 rounded-2xl hover:border-[#6dadbe]/30 hover:bg-[#6dadbe]/5 transition-all active:scale-95 flex items-center gap-3"
        >
            <ArrowLeft size={16} />
            Back to Document
        </Link>
        <div className="text-right">
          <p className="text-[10px] font-mono font-bold text-[#6dadbe]/50 uppercase tracking-[0.2em] mb-1">Assessment Finalized</p>
          <p className="text-xs font-mono font-bold text-slate-400 uppercase tracking-tighter">{moment(quiz.createdAt).format("DD.MM.YY // HH:mm")}</p>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <PageHeader title={`${quiz.title || "Quiz"} Results`} subtitle="Assessment Overview" />
      </motion.div>

      {/* Hero Score Card */}
      <motion.div variants={itemVariants} className="relative overflow-hidden bg-black/60 border border-white/10 rounded-[3rem] shadow-[0_12px_64px_rgba(0,0,0,0.6)] p-10 md:p-14 relative group">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#6dadbe]/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-[120px] pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20 relative z-10">
          <div className="relative">
            <div className={`w-52 h-52 rounded-[3.5rem] bg-black border-[1px] border-[#6dadbe]/30 flex items-center justify-center relative z-10 overflow-hidden`}>
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[#6dadbe]/5 pointer-events-none" />
                <div className="text-center">
                    <span className="text-7xl font-mono font-bold text-[#6dadbe] drop-shadow-[0_0_15px_rgba(109,173,190,0.5)]">
                    {score}<span className="text-2xl opacity-50 ml-1">%</span>
                    </span>
                    <p className="text-[10px] font-mono font-bold text-[#6dadbe]/40 uppercase tracking-[0.3em] mt-2">Proficiency</p>
                </div>
            </div>
            <div className={`absolute -inset-6 rounded-full bg-[#6dadbe]/10 blur-3xl -z-0 animate-pulse`} />
            <div className="absolute -top-3 -right-3 w-14 h-14 rounded-2xl bg-black shadow-2xl flex items-center justify-center border border-[#6dadbe]/50">
              <Trophy className="text-[#6dadbe]" size={28} strokeWidth={1.5} />
            </div>
          </div>

          <div className="flex-1 text-center md:text-left space-y-6">
            <div className="space-y-2">
                <span className="text-[10px] font-mono font-bold text-[#6dadbe] uppercase tracking-[.4em]">Score Breakdown</span>
                <h2 className="text-5xl font-light text-slate-100 tracking-tighter lowercase">
                {getScoreMessage(score).split(' ').map((word, i) => i === 0 ? <span key={i} className="font-bold text-white uppercase not-italic tracking-tighter mr-2">{word}</span> : word + ' ')}
                </h2>
            </div>
            <p className="text-lg text-slate-400 font-medium max-w-lg leading-relaxed lowercase italic">
              Extracted results from assessment <span className="text-white font-bold uppercase not-italic tracking-tight">"{quiz.document.title}"</span>. 
              Review the data sets below to optimize knowledge retention.
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-4">
              <div className="flex flex-col gap-1 px-6 py-4 bg-white/5 border border-white/10 rounded-2xl min-w-[120px]">
                <p className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest">Questions</p>
                <p className="text-xl font-mono font-bold text-slate-200">{totalQuestions}</p>
              </div>

              <div className="flex flex-col gap-1 px-6 py-4 bg-[#6dadbe]/5 border border-[#6dadbe]/20 rounded-2xl min-w-[120px]">
                <p className="text-[9px] font-mono font-bold text-[#6dadbe] uppercase tracking-widest">Correct</p>
                <div className="flex items-center gap-2">
                    <p className="text-xl font-mono font-bold text-[#6dadbe]">{correctAnswers}</p>
                    <CheckCircle2 size={14} className="text-[#6dadbe]/50" />
                </div>
              </div>

              <div className="flex flex-col gap-1 px-6 py-4 bg-rose-500/5 border border-rose-500/20 rounded-2xl min-w-[120px]">
                <p className="text-[9px] font-mono font-bold text-rose-500 uppercase tracking-widest">Incorrect</p>
                <div className="flex items-center gap-2">
                    <p className="text-xl font-mono font-bold text-rose-500">{incorrectAnswers}</p>
                    <XCircle size={14} className="text-rose-500/50" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Detailed Review Section */}
      <motion.div variants={itemVariants} className="space-y-10">
        <div className="flex items-center gap-5 px-4 relative">
          <div className="absolute -left-2 top-0 w-1 h-full bg-[#6dadbe]/20 rounded-full" />
          <div className="w-14 h-14 rounded-2xl bg-black border border-white/10 flex items-center justify-center shadow-xl">
            <BookOpen className="text-[#6dadbe]/80" size={28} strokeWidth={1.5} />
          </div>
          <div>
            <h3 className="text-3xl font-light text-slate-100 tracking-tight lowercase">Detailed <span className="font-bold uppercase italic text-white text-2xl ml-1">Breakdown</span></h3>
            <p className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest mt-1">Review your answers below</p>
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
              <motion.div
                variants={itemVariants}
                key={index}
                className={`group relative bg-black/40 backdrop-blur-3xl border rounded-[3rem] overflow-hidden transition-all duration-500 ${isCorrect ? "border-[#6dadbe]/10 hover:border-[#6dadbe]/30" : "border-rose-500/10 hover:border-rose-500/30"
                  }`}
              >
                {/* Question Header */}
                <div className={`p-10 md:p-12 ${isCorrect ? "bg-[#6dadbe]/[0.02]" : "bg-rose-500/[0.02]"}`}>
                  <div className="flex justify-between items-start gap-8 mb-8">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-mono font-bold text-lg ${isCorrect ? "bg-black border border-[#6dadbe]/50 text-[#6dadbe] shadow-[0_0_20px_rgba(109,173,190,0.1)]" : "bg-black border border-rose-500/50 text-rose-500 shadow-[0_0_20px_rgba(225,29,72,0.1)]"
                        }`}>
                        {String(index + 1).padStart(2, '0')}
                      </div>
                      <div className="flex flex-col">
                        <span className={`text-[10px] font-mono font-bold uppercase tracking-[0.3em] ${isCorrect ? "text-[#6dadbe]" : "text-rose-500"}`}>
                            {isCorrect ? "Data Consistency Active" : "Logical Anomaly Detected"}
                        </span>
                        <div className="flex gap-1 mt-1">
                           {[...Array(3)].map((_, i) => <div key={i} className={`w-4 h-0.5 rounded-full ${isCorrect ? 'bg-[#6dadbe]/20' : 'bg-rose-500/20'}`} />)}
                        </div>
                      </div>
                    </div>
                  </div>
                  <h4 className="text-2xl md:text-3xl font-light text-slate-100 leading-tight lowercase italic">
                    {result.question?.split(' ').map((word, i) => i % 5 === 0 ? <span key={i} className="font-bold text-white uppercase not-italic tracking-tighter mr-2">{word}</span> : word + ' ')}
                  </h4>
                </div>

                {/* Options Review */}
                <div className="p-10 md:p-12 pt-0 space-y-5">
                  <div className="grid grid-cols-1 gap-4">
                    {result.options.map((option, optIndex) => {
                      const isCorrectOption = optIndex === correctAnswerIndex;
                      const isUserAnswer = optIndex === userAnswerIndex;
                      const isWrongChoice = isUserAnswer && !isCorrect;

                      return (
                        <div
                          key={optIndex}
                          className={`relative flex items-center p-6 rounded-[1.5rem] border transition-all duration-500 ${isCorrectOption
                            ? "bg-[#6dadbe]/10 border-[#6dadbe]/40 shadow-[0_0_20px_rgba(109,173,190,0.1)] scale-[1.01]"
                            : isWrongChoice
                              ? "bg-rose-500/10 border-rose-500/40"
                              : "bg-white/[0.01] border-white/5"
                            }`}
                        >
                          <div className={`shrink-0 w-6 h-6 rounded-lg border flex items-center justify-center ${isCorrectOption ? "border-[#6dadbe] bg-[#6dadbe] shadow-[0_0_10px_rgba(109,173,190,0.5)]" : isWrongChoice ? "border-rose-500 bg-rose-500 shadow-[0_0_10px_rgba(225,29,72,0.5)]" : "border-white/20 bg-black"
                            }`}>
                            {isCorrectOption ? <CheckCircle2 size={14} className="text-black" strokeWidth={3} /> : isWrongChoice ? <XCircle size={14} className="text-black" strokeWidth={3} /> : null}
                          </div>

                          <span className={`ml-5 text-lg font-bold tracking-tight ${isCorrectOption ? "text-white" : isWrongChoice ? "text-rose-400" : "text-slate-500"
                            }`}>
                            {option}
                          </span>

                          <div className="ml-auto">
                            {isCorrectOption && (
                              <span className="text-[9px] font-mono font-bold text-[#6dadbe] uppercase tracking-widest px-3 py-1 bg-[#6dadbe]/10 rounded-lg border border-[#6dadbe]/30">Target Result</span>
                            )}
                            {isWrongChoice && (
                              <span className="text-[9px] font-mono font-bold text-rose-400 uppercase tracking-widest px-3 py-1 bg-rose-500/10 rounded-lg border border-rose-500/30">User Input</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation Block */}
                  {result.explanation && (
                    <div className="mt-10 p-8 rounded-[2rem] border border-[#6dadbe]/20 bg-[#6dadbe]/[0.02] relative overflow-hidden group/exp">
                        <div className="absolute top-0 left-0 w-1 h-full bg-[#6dadbe]/20" />
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-xl bg-[#6dadbe]/10 text-[#6dadbe] shadow-[0_0_10px_rgba(109,173,190,0.2)]">
                          <BookOpen size={18} strokeWidth={1.5} />
                        </div>
                        <span className="text-[10px] font-mono font-bold text-[#6dadbe] uppercase tracking-[0.3em]">Knowledge Extraction</span>
                      </div>
                      <p className="text-base text-slate-300 leading-relaxed italic">
                        &gt; {result.explanation}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Footer Actions */}
      <motion.div variants={itemVariants} className="flex justify-center pt-10">
        <Link to={`/documents/${quiz.document._id}`}>
          <button className="h-16 px-12 text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-white bg-black border border-[#6dadbe] hover:bg-[#6dadbe]/10 rounded-[2rem] shadow-[0_0_40px_rgba(109,173,190,0.2)] transition-all hover:scale-105 active:scale-95 flex items-center gap-4">
            <ArrowLeft size={18} />
            Initialize Return Protocol
          </button>
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default QuizResultPage;
