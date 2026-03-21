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
        <div className="relative w-full rounded-[2rem] bg-black/60 backdrop-blur-3xl border border-white/10 overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.8)] transition-all duration-500 group">
            {/* Ambient Retro Glow */}
            <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#6dadbe]/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-[#6dadbe]/15 transition-colors duration-700" />
            <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#12768a]/5 rounded-full blur-[100px] pointer-events-none" />

            {/* Vintage Tech Header */}
            <div className="px-8 py-5 border-b border-white/10 flex items-center justify-between bg-white/5 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="relative flex items-center justify-center w-8 h-8 rounded bg-black border border-[#6dadbe]/30 text-[#6dadbe] shadow-[0_0_15px_rgba(109,173,190,0.2)]">
                        <Sparkles className="w-4 h-4" strokeWidth={2} />
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-[#6dadbe]/50" />
                    </div>
                    <div className="flex flex-col">
                        <h3 className="text-sm font-bold text-slate-200 tracking-[0.2em] uppercase">AI // Tools</h3>
                        <p className="text-[10px] font-mono text-[#6dadbe]/70 tracking-widest uppercase">Ready</p>
                    </div>
                </div>
            </div>

            <div className="p-8 grid grid-cols-1 md:grid-cols-5 gap-6 relative z-10">
                {/* Generate Summary - Larger Impact Card */}
                <div className="md:col-span-2 group/card relative p-8 rounded-3xl bg-[#09090b] border border-white/5 hover:border-[#6dadbe]/30 transition-all duration-500 flex flex-col justify-between shadow-inner overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
                    
                    <div className="space-y-6 relative z-10">
                        <div className="flex flex-col gap-4">
                            <div className="w-12 h-12 rounded-xl bg-black border border-white/10 flex items-center justify-center text-[#6dadbe] group-hover/card:scale-110 group-hover/card:border-[#6dadbe]/50 transition-all duration-500 shadow-[0_0_10px_rgba(109,173,190,0)] group-hover/card:shadow-[0_0_15px_rgba(109,173,190,0.15)]">
                                <BookOpen className="w-5 h-5" strokeWidth={1.5} />
                            </div>
                            <h4 className="text-2xl font-light text-slate-100 tracking-wide">Document<br/><span className="font-bold text-white">Summary</span></h4>
                        </div>
                        <p className="text-slate-400 leading-relaxed text-sm font-medium">
                            Get a concise summary of the document's key points and concepts.
                        </p>
                    </div>
                    
                    <button
                        onClick={handleGenerateSummary}
                        disabled={loadingAction === "summary"}
                        className="mt-8 w-full relative px-6 py-4 bg-white/5 hover:bg-[#6dadbe]/10 border border-white/10 hover:border-[#6dadbe]/40 disabled:opacity-50 text-slate-300 hover:text-[#6dadbe] font-bold tracking-widest uppercase text-xs rounded-xl transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden group/btn"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#6dadbe]/10 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite]" />
                        {loadingAction === "summary" ? (
                            <>
                                <div className="w-4 h-4 border-2 border-[#6dadbe]/30 border-t-[#6dadbe] rounded-full animate-spin" />
                                Summarizing...
                            </>
                        ) : (
                            <>
                                <Sparkles size={14} />
                                Generate Summary
                            </>
                        )}
                    </button>
                </div>

                {/* Explain Concept - Wider Input Card */}
                <div className="md:col-span-3 group/card relative p-8 rounded-3xl bg-[#09090b] border border-white/5 hover:border-[#6dadbe]/30 transition-all duration-500 flex flex-col justify-between shadow-inner overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tl from-white/[0.02] to-transparent pointer-events-none" />
                    
                    <form onSubmit={handleExplainConcept} className="flex flex-col h-full justify-between relative z-10">
                        <div className="space-y-4 mb-8">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-black border border-white/10 flex items-center justify-center text-[#6dadbe] group-hover/card:rotate-12 group-hover/card:border-[#6dadbe]/50 transition-all duration-500 shadow-[0_0_10px_rgba(109,173,190,0)] group-hover/card:shadow-[0_0_15px_rgba(109,173,190,0.15)]">
                                    <Lightbulb className="w-5 h-5" strokeWidth={1.5} />
                                </div>
                                <h4 className="text-xl font-light text-slate-100 tracking-wide">Explain <span className="font-bold text-white">Concept</span></h4>
                            </div>
                            <p className="text-slate-400 leading-relaxed text-sm font-medium">
                                Ask the AI to elaborate on any complex terminology or specific concepts from the text.
                            </p>
                        </div>

                        <div className="flex flex-col gap-4 mt-auto">
                            <div className="relative group/input">
                                <input
                                    type="text"
                                    value={concept}
                                    onChange={(e) => setConcept(e.target.value)}
                                    className="w-full px-5 py-4 bg-black/60 border border-white/10 rounded-xl focus:outline-none focus:border-[#6dadbe]/50 focus:bg-black/80 transition-all placeholder:text-slate-600 text-slate-200 font-mono text-sm shadow-inner"
                                    placeholder="> Enter concept to explain..."
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-4 bg-[#6dadbe]/50 animate-pulse" />
                            </div>
                            <button
                                type="submit"
                                disabled={loadingAction === "explain" || !concept.trim()}
                                className="w-full px-6 py-4 bg-black border border-white/10 hover:border-[#6dadbe]/40 hover:bg-[#6dadbe]/10 disabled:opacity-50 text-slate-300 hover:text-[#6dadbe] font-bold uppercase tracking-widest text-xs rounded-xl transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden group/btn"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#6dadbe]/10 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite]" />
                                {loadingAction === "explain" ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-[#6dadbe]/30 border-t-[#6dadbe] rounded-full animate-spin" />
                                        Explaining...
                                    </>
                                ) : (
                                    <>
                                        <Lightbulb size={14} />
                                        Explain Concept
                                    </>
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