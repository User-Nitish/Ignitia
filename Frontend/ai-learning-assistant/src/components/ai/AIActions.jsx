import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Sparkles, BookOpen, Lightbulb } from "lucide-react";
import aiService from "../../services/aiService";
import toast from "react-hot-toast";
import MarkdownRenderer from "../common/MarkdownRenderer";
import Modal from "../common/Modal";

const AIActions = () => {
    const { id: documentId } = useParams();
    const [loadingAction, setLoadingAction] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [concept, setConcept] = useState("");
    const [modalContent, setModalContent] = useState("");
    const [modalTitle, setModalTitle] = useState("");

    const handleGenerateSummary = async () => {
        setLoadingAction("summary");
        try {
            const { summary } = await aiService.generateSummary(documentId);
            setModalTitle("Generated Summary");
            setModalContent(summary);
            setIsModalOpen(true);
        } catch (error) {
            toast.error("Failed to generate summary.");
        } finally {
            setLoadingAction(null);
        }
    };

    const handleExplainConcept = async (e) => {
        e.preventDefault();
        if (!concept.trim()) {
            toast.error("Please enter a concept to explain.");
            return;
        }

        setLoadingAction("explain");
        try {
            const { explanation } = await aiService.explainConcept(documentId, concept);
            setModalTitle(`Explanation of "${concept}"`);
            setModalContent(explanation);
            setIsModalOpen(true);
            setConcept("");
        } catch (error) {
            toast.error("Failed to explain concept.");
        } finally {
            setLoadingAction(null);
        }
    };

    return (
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl shadow-xl shadow-slate-200/40 overflow-hidden transition-all duration-300">
            {/* Header */}
            <div className="px-8 py-6 border-b border-slate-200/60 bg-white">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/50 text-white">
                        <Sparkles className="w-6 h-6" strokeWidth={2} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 tracking-tight">AI Assistant</h3>
                        <p className="text-sm font-medium text-slate-500">Powered by advanced AI</p>
                    </div>
                </div>
            </div>

            <div className="p-8 space-y-8">
                {/* Generate Summary */}
                <div className="group relative p-6 rounded-2xl bg-slate-50/50 border border-slate-100 hover:border-blue-200 hover:bg-white transition-all duration-300">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform duration-300">
                                    <BookOpen className="w-5 h-5" strokeWidth={2.5} />
                                </div>
                                <h4 className="text-lg font-bold text-slate-800">Generate Summary</h4>
                            </div>
                            <p className="text-slate-600 leading-relaxed text-sm">
                                Get a concise summary of the entire document to grasp the key concepts quickly.
                            </p>
                        </div>
                        <button
                            onClick={handleGenerateSummary}
                            disabled={loadingAction === "summary"}
                            className="relative px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:shadow-blue-500/50 disabled:from-slate-300 disabled:to-slate-300 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center min-w-[140px]"
                        >
                            {loadingAction === "summary" ? (
                                <span className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Processing...
                                </span>
                            ) : (
                                "Summarize"
                            )}
                        </button>
                    </div>
                </div>

                <div className="group relative p-6 rounded-2xl bg-slate-50/50 border border-slate-100 hover:border-rose-200 hover:bg-white transition-all duration-300">
                    <form onSubmit={handleExplainConcept} className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-orange-100/50 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform duration-300">
                                    <Lightbulb className="w-5 h-5" strokeWidth={2.5} />
                                </div>
                                <h4 className="text-lg font-bold text-slate-800">Explain a Concept</h4>
                            </div>
                            <p className="text-slate-500 leading-relaxed text-sm">
                                Enter a topic or concept from the document to get a detailed explanation.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <input
                                type="text"
                                value={concept}
                                onChange={(e) => setConcept(e.target.value)}
                                className="flex-1 px-5 py-3 bg-white border border-rose-500/30 rounded-xl focus:outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all placeholder:text-slate-300 text-slate-700 font-medium"
                                placeholder="e.g. 'React Hooks'"
                            />
                            <button
                                type="submit"
                                disabled={loadingAction === "explain"}
                                className="px-8 py-3 bg-gradient-to-r from-rose-500 to-orange-500 hover:shadow-rose-500/50 disabled:from-slate-300 disabled:to-slate-300 text-white font-bold rounded-xl shadow-lg shadow-rose-500/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center min-w-[120px]"
                            >
                                {loadingAction === "explain" ? (
                                    <span className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Analyzing...
                                    </span>
                                ) : (
                                    "Explain"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Result Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={modalTitle}
            >
                <div className="max-h-[60vh] overflow-y-auto prose prose-indigo prose-slate max-w-none scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent pr-4">
                    <MarkdownRenderer content={modalContent} />
                </div>
            </Modal>
        </div>
    );
};

export default AIActions;