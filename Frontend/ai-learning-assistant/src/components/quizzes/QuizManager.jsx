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
                <div className="flex justify-center py-12">
                    <Spinner />
                </div>
            );
        }

        if (quizzes.length === 0) {
            return (
                <EmptyState
                    title="No Quizzes Yet"
                    description="Generate a quiz from your document to test your knowledge."
                    buttonText="Generate First Quiz"
                    onActionClick={() => setIsGenerateModalOpen(true)}
                />
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
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white/50 backdrop-blur-md p-4 rounded-[1.5rem] border border-slate-200/60 shadow-sm">
                <h2 className="text-lg font-bold text-slate-800 px-2">Knowledge Checks</h2>
                <Button
                    onClick={() => setIsGenerateModalOpen(true)}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-lg shadow-emerald-200 transition-all duration-200"
                >
                    <Plus size={18} className="mr-1" />
                    New Quiz
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
                <form onSubmit={handleGenerateQuiz} className="space-y-6 p-2">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Number of Questions</label>
                        <input
                            type="number"
                            value={numQuestions}
                            onChange={(e) => setNumQuestions(Math.max(1, parseInt(e.target.value) || 1))}
                            min="1"
                            max="20"
                            required
                            className="w-full h-12 px-4 border-2 border-slate-100 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none text-lg font-medium"
                        />
                        <p className="mt-2 text-xs text-slate-500 italic">Try 5-10 questions for the best results from this document.</p>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setIsGenerateModalOpen(false)}
                            className="rounded-xl px-6"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={generating}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl px-8 shadow-lg shadow-emerald-200"
                        >
                            {generating ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Generating...
                                </div>
                            ) : "Generate"}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Delete Quiz"
            >
                <div className="space-y-6 p-2">
                    <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl">
                        <p className="text-sm text-slate-700">
                            Are you sure you want to delete <span className="font-bold text-slate-900">{selectedQuiz?.title || 'this quiz'}</span>?
                            This action cannot be undone and your progress will be lost.
                        </p>
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsDeleteModalOpen(false)}
                            disabled={deleting}
                            className="rounded-xl px-6"
                        >
                            Keep Quiz
                        </Button>
                        <Button
                            onClick={handleConfirmDelete}
                            disabled={deleting}
                            className="bg-rose-500 hover:bg-rose-600 text-white rounded-xl px-8 shadow-lg shadow-rose-200"
                        >
                            {deleting ? "Deleting..." : "Yes, Delete"}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default QuizManager;