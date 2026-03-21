import React, { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

import quizService from "../../services/quizService";
import aiService from "../../services/aiService";
import Spinner from "../common/Spinner";
import Button from "../common/Button";
import Modal from "../common/Modal";
import QuizCard from "./QuizCard";
import EmptyState from "../common/EmptyState";

const QuizManager = ({ documentId }) => {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
    const [numQuestions, setNumQuestions] = useState(5);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [selectedQuiz, setSelectedQuiz] = useState(null);

    const fetchQuizzes = async () => {
        setLoading(true);
        try {
            const data = await quizService.getQuizzesForDocument(documentId);
            setQuizzes(data.data || []);
        } catch (error) {
            toast.error("Failed to fetch quizzes");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (documentId) {
            fetchQuizzes();
        }
    }, [documentId]);

    const handleGenerateQuiz = async (e) => {
        e.preventDefault();
        setGenerating(true);
        try {
            await aiService.generateQuiz(documentId, { numQuestions });
            toast.success("Quiz generated successfully!");
            setIsGenerateModalOpen(false);
            fetchQuizzes();
        } catch (error) {
            toast.error(error.message || "Failed to generate quiz.");
        } finally {
            setGenerating(false);
        }
    };

    const handleDeleteRequest = (quiz) => {
        setSelectedQuiz(quiz);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!selectedQuiz) return;

        setDeleting(true);
        try {
            await quizService.deleteQuiz(selectedQuiz._id);
            toast.success(`${selectedQuiz.title || "Quiz"} deleted.`);
            setIsDeleteModalOpen(false);
            setSelectedQuiz(null);
            setQuizzes(quizzes.filter((q) => q._id !== selectedQuiz._id));
        } catch (error) {
            toast.error(error.message || "Failed to delete quiz.");
        } finally {
            setDeleting(false);
        }
    };

    const renderQuizContent = () => {
        if (loading) {
            return (
                <div className="flex flex-col items-center justify-center py-24 gap-4">
                    <div className="w-12 h-12 border-2 border-[#6dadbe]/20 border-t-[#6dadbe] rounded-full animate-spin" />
                    <p className="text-[10px] font-mono font-bold text-[#6dadbe]/40 uppercase tracking-[0.3em]">Retrieving Data Logs...</p>
                </div>
            );
        }

        if (quizzes.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center min-h-[400px] border border-dashed border-white/10 rounded-[2.5rem] p-12 bg-black/40">
                    <div className="w-20 h-20 rounded-2xl bg-black border border-[#6dadbe]/30 text-[#6dadbe] flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(109,173,190,0.1)]">
                       <Plus size={32} strokeWidth={1.5} />
                    </div>
                    <h3 className="text-2xl font-light text-slate-100 mb-2 lowercase">No Quizzes <span className="font-bold uppercase italic text-white">Found</span></h3>
                    <p className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-10 max-w-sm text-center">
                       &gt; System awaiting data generation request...
                    </p>
                    <Button
                        variant="primary"
                        onClick={() => setIsGenerateModalOpen(true)}
                    >
                        Initialize Generation
                    </Button>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {quizzes.map((quiz) => (
                    <QuizCard key={quiz._id} quiz={quiz} onDelete={handleDeleteRequest} />
                ))}
            </div>
        );
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center bg-black border border-white/10 p-6 rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.4)] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#6dadbe]/5 rounded-full blur-2xl pointer-events-none translate-x-1/2 -translate-y-1/2" />
                
                <div className="relative z-10">
                    <h2 className="text-xl font-light text-slate-100 tracking-tight lowercase">Knowledge /<span className="font-bold uppercase italic text-white text-lg ml-1">Checks</span></h2>
                    <p className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest mt-1 ml-1 font-bold">Status: Logs Active</p>
                </div>
                <Button
                    variant="primary"
                    size="md"
                    onClick={() => setIsGenerateModalOpen(true)}
                >
                    <Plus size={16} strokeWidth={2.5} />
                    New Sim
                </Button>
            </div>

            <div className="min-h-[400px]">
                {renderQuizContent()}
            </div>

            {/* Generate Quiz Modal */}
            <Modal
                isOpen={isGenerateModalOpen}
                onClose={() => setIsGenerateModalOpen(false)}
                title="Generate New Quiz"
            >
                <form onSubmit={handleGenerateQuiz} className="space-y-8 py-4">
                    <div className="space-y-4">
                        <label className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-slate-500 ml-1">
                            Sim // Parameters // Units
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                value={numQuestions}
                                onChange={(e) => setNumQuestions(Math.max(1, parseInt(e.target.value) || 1))}
                                min="1"
                                max="20"
                                required
                                className="w-full h-14 px-6 bg-white/[0.03] border border-white/10 rounded-2xl focus:outline-none focus:border-[#6dadbe]/50 transition-all font-mono text-lg text-[#6dadbe]"
                            />
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-mono font-bold text-slate-600 uppercase tracking-widest pointer-events-none">
                                INT_ARRAY_SIZE
                            </div>
                        </div>
                        <p className="text-[10px] font-mono text-slate-600 uppercase tracking-tighter ml-1">&gt; RECOMMENDED BUFFER: 05-10 UNITS FOR OPTIMAL EXTRACTION.</p>
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => setIsGenerateModalOpen(false)}
                            className="px-8 py-3.5 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-slate-500 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-transparent hover:border-white/10 active:scale-95"
                        >
                            Abort
                        </button>
                        <button
                            type="submit"
                            disabled={generating}
                            className="px-10 py-3.5 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-white bg-black border border-[#6dadbe]/50 hover:bg-[#6dadbe]/10 hover:border-[#6dadbe] rounded-2xl shadow-[0_4px_20px_rgba(109,173,190,0.1)] transition-all active:scale-95 disabled:opacity-50"
                        >
                            {generating ? (
                                <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 border-2 border-[#6dadbe]/30 border-t-[#6dadbe] rounded-full animate-spin" />
                                    SYNCING...
                                </div>
                            ) : "Execute Sim"}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Delete Quiz"
            >
                <div className="space-y-10 py-4">
                    <div className="flex flex-col items-center text-center space-y-6">
                        <div className="w-20 h-20 bg-black border border-rose-500/30 text-rose-500 rounded-3xl flex items-center justify-center shadow-[0_0_20px_rgba(225,29,72,0.1)]">
                            <Trash2 size={32} strokeWidth={1.5} />
                        </div>
                        <div className="space-y-3">
                           <p className="text-xs text-slate-400 leading-relaxed font-mono uppercase tracking-wider">
                              PROTOCOL OVERRIDE: TERMINATE SIMULATION <span className="text-rose-400 font-bold italic">"{selectedQuiz?.title || 'UNNAMED_SIM'}"</span>? 
                           </p>
                           <p className="text-[10px] font-mono text-slate-600 uppercase tracking-tighter">&gt; DATA IRREVERSIBILITY WARNING // PERSISTENT LOGS WILL BE PURGED.</p>
                        </div>
                    </div>

                    <div className="flex justify-center gap-6">
                        <button
                            type="button"
                            onClick={() => setIsDeleteModalOpen(false)}
                            disabled={deleting}
                            className="flex-1 h-14 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-slate-500 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-transparent hover:border-white/10 active:scale-95"
                        >
                            Retain Data
                        </button>
                        <button
                            onClick={handleConfirmDelete}
                            disabled={deleting}
                            className="flex-1 h-14 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-white bg-rose-600/10 hover:bg-rose-600/20 border border-rose-500/40 rounded-2xl shadow-[0_4px_20px_rgba(225,29,72,0.1)] transition-all active:scale-95 disabled:opacity-50"
                        >
                            {deleting ? "PURGING..." : "Terminate"}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default QuizManager;