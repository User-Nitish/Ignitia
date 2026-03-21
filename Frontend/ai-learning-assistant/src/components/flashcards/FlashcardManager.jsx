import React, { useState, useEffect } from "react";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Trash2,
  ArrowLeft,
  Sparkles,
  Brain,
} from "lucide-react";
import toast from "react-hot-toast";
import moment from "moment";

import flashcardService from "../../services/flashcardService";
import aiService from "../../services/aiService";
import Spinner from "../common/Spinner";
import Modal from "../common/Modal";
import Flashcard from "./Flashcard";

const FlashcardManager = ({ documentId }) => {
  const [flashcardSets, setFlashcardSets] = useState([]);
  const [selectedSet, setSelectedSet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [setToDelete, setSetToDelete] = useState(null);

  const fetchFlashcardSets = async () => {
    setLoading(true);
    try {
      const response = await flashcardService.getFlashcardsForDocument(documentId);
      setFlashcardSets(response.data);
    } catch (error) {
      toast.error("Failed to fetch flashcard sets.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (documentId) {
      fetchFlashcardSets();
    }
  }, [documentId]);

  const handleGenerateFlashcards = async () => {
    setGenerating(true);
    try {
      await aiService.generateFlashcards(documentId);
      toast.success("Flashcards generated successfully!");
      fetchFlashcardSets();
    } catch (error) {
      toast.error(error.message || "Failed to generate flashcards.");
    } finally {
      setGenerating(false);
    }
  };

  const handleNextCard = () => {
    if (selectedSet) {
      handleReview(currentCardIndex);
      setCurrentCardIndex(
        (prevIndex) => (prevIndex + 1) % selectedSet.cards.length
      );
    }
  };

  const handlePrevCard = () => {
    if (selectedSet) {
      handleReview(currentCardIndex);
      setCurrentCardIndex(
        (prevIndex) =>
          (prevIndex - 1 + selectedSet.cards.length) % selectedSet.cards.length
      );
    }
  };

  const handleReview = async (index) => {
    const currentCard = selectedSet?.cards[currentCardIndex];
    if (!currentCard) return;

    try {
      await flashcardService.reviewFlashcard(currentCard._id, index);
      toast.success("Flashcard reviewed!");
    } catch (error) {
      toast.error("Failed to review flashcard.");
    }
  };

  const handleToggleStar = async (cardId) => {

    try {
      await flashcardService.toggleStar(cardId);
      const updatedSets = flashcardSets.map((set) => {
        if (set._id === selectedSet._id) {
          const updatedCards = set.cards.map((card) =>
            card._id === cardId ? { ...card, isStarred: !card.isStarred } : card
          );
          return { ...set, cards: updatedCards };
        }
        return set;
      });

      setFlashcardSets(updatedSets);
      setSelectedSet(updatedSets.find((set) => set._id === selectedSet._id));
      toast.success("Flashcard starred status updated!");
    } catch (error) {
      toast.error(error.message || "Failed to update star status.");
    }

  };

  const handleDeleteRequest = (e, set) => {
    e.stopPropagation();
    setSetToDelete(set);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!setToDelete) return;
    setDeleting(true);
    try {
      await flashcardService.deleteFlashcardSet(setToDelete._id);
      toast.success("Flashcard set deleted successfully!");
      setIsDeleteModalOpen(false);
      setSetToDelete(null);
      fetchFlashcardSets();
    } catch (error) {
      toast.error(error.message || "Failed to delete flashcard set.");
    } finally {
      setDeleting(false);
    }
  };

  const handleSelectSet = (set) => {
    setSelectedSet(set);
    setCurrentCardIndex(0);
  };

  const renderFlashcardViewer = () => {
    const currentCard = selectedSet.cards[currentCardIndex];

    return (
      <div className="space-y-8">
        {/* Back Button */}
        <button
          onClick={() => setSelectedSet(null)}
          className="group inline-flex items-center gap-3 text-sm font-bold tracking-widest uppercase text-slate-400 hover:text-[#6dadbe] transition-colors duration-300"
        >
          <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center group-hover:bg-[#6dadbe]/10 border border-transparent group-hover:border-[#6dadbe]/30 shadow-[0_0_10px_rgba(109,173,190,0)] group-hover:shadow-[0_0_15px_rgba(109,173,190,0.2)] transition-all">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" strokeWidth={2} />
          </div>
          Back to Sets
        </button>

        {/* Flashcard Display */}
        <div className="flex flex-col items-center space-y-10">
          <div className="w-full max-w-xl">
            <Flashcard
              flashcard={currentCard}
              onToggleStar={handleToggleStar}
            />
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-8 bg-black/60 backdrop-blur-xl p-3 rounded-2xl border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
            <button
              onClick={handlePrevCard}
              disabled={selectedSet.cards.length <= 1}
              className="p-3 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-[#6dadbe] hover:border-[#6dadbe]/40 hover:bg-[#6dadbe]/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-inner"
              title="Previous Card"
            >
              <ChevronLeft className="w-5 h-5" strokeWidth={2} />
            </button>

            <div className="flex items-center gap-2 font-mono text-sm tracking-widest text-slate-300">
              <span className="text-[#6dadbe] font-bold">{currentCardIndex + 1}</span>
              <span className="text-white/20">/</span>
              <span>{selectedSet.cards.length}</span>
            </div>

            <button
              onClick={handleNextCard}
              disabled={selectedSet.cards.length <= 1}
              className="p-3 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-[#6dadbe] hover:border-[#6dadbe]/40 hover:bg-[#6dadbe]/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-inner"
              title="Next Card"
            >
              <ChevronRight className="w-5 h-5" strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderSetList = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-20">
          <Spinner />
        </div>
      );
    }

    if (flashcardSets.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-20 px-6 bg-[#09090b]/80 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.8)] overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#6dadbe]/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-black border border-[#6dadbe]/30 mb-8 shadow-[0_0_20px_rgba(109,173,190,0.15)] relative z-10">
            <Brain className="w-10 h-10 text-[#6dadbe]" strokeWidth={1.5} />
          </div>
          <h3 className="text-2xl font-light text-slate-100 mb-3 tracking-wide z-10">
            No <span className="font-bold text-white">Flashcards</span> Yet
          </h3>
          <p className="text-xs font-mono tracking-widest uppercase text-[#6dadbe]/60 mb-10 text-center max-w-md z-10 leading-relaxed">
            &gt; Generate flashcard sets to begin your study session.
          </p>
          <button
            onClick={handleGenerateFlashcards}
            disabled={generating}
            className={`group inline-flex items-center gap-3 px-8 h-14 bg-black border border-white/10 hover:border-[#6dadbe]/50 hover:bg-[#6dadbe]/10 text-slate-200 hover:text-[#6dadbe] font-bold uppercase tracking-widest text-xs rounded-xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed z-10 overflow-hidden relative group/btn`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#6dadbe]/10 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite]" />
            {generating ? (
              <>
                <div className="w-5 h-5 border-2 border-[#6dadbe]/30 border-t-[#6dadbe] rounded-full animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" strokeWidth={1.5} />
                <span>Generate Flashcards</span>
              </>
            )}
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-8 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-[#6dadbe]/5 rounded-full blur-[120px] pointer-events-none -z-10" />
        
        {/* Header with Generate Button */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-light text-slate-100 tracking-wider">
              Flashcard <span className="font-bold text-white">Sets</span>
            </h3>
            <p className="text-xs font-mono tracking-widest uppercase text-[#6dadbe]/60 mt-2">
              &gt; {flashcardSets.length}{" "}
              {flashcardSets.length === 1 ? "Set" : "Sets"} Created.
            </p>
          </div>
          <button
            onClick={handleGenerateFlashcards}
            disabled={generating}
            className="group inline-flex items-center gap-3 px-6 h-12 bg-black border border-white/10 hover:border-[#6dadbe]/40 hover:bg-[#6dadbe]/10 text-slate-300 hover:text-[#6dadbe] font-bold uppercase tracking-widest text-xs rounded-xl transition-all duration-300 disabled:opacity-70 shadow-[0_4px_15px_rgba(0,0,0,0.5)] relative overflow-hidden group/btn"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#6dadbe]/10 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite]" />
            {generating ? (
              <>
                <div className="w-4 h-4 border-2 border-[#6dadbe]/30 border-t-[#6dadbe] rounded-full animate-spin" />
                <span>Creating...</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" strokeWidth={2} />
                <span>New Set</span>
              </>
            )}
          </button>
        </div>

        {/* Flashcard Sets Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {flashcardSets.map((set) => (
            <div
              key={set._id}
              onClick={() => handleSelectSet(set)}
              className="group relative bg-[#0a0a0c] backdrop-blur-md border border-white/5 hover:border-[#6dadbe]/30 rounded-[2rem] p-8 cursor-pointer transition-all duration-500 hover:shadow-[0_8px_32px_rgba(109,173,190,0.1)] hover:-translate-y-1 flex flex-col gap-6 overflow-hidden h-full shadow-inner"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#6dadbe]/5 rounded-full blur-2xl -z-10 group-hover:bg-[#6dadbe]/10 transition-colors duration-500 translate-x-1/2 -translate-y-1/2" />
              
              {/* Delete Button */}
              <button
                onClick={(e) => handleDeleteRequest(e, set)}
                className="absolute top-6 right-6 w-10 h-10 rounded-xl bg-black text-slate-500 opacity-0 group-hover:opacity-100 hover:bg-rose-500/10 hover:text-rose-500 hover:border-rose-500/30 transition-all duration-300 flex items-center justify-center border border-white/5 z-10"
                title="Delete Set"
              >
                <Trash2 className="w-4.5 h-4.5" strokeWidth={1.5} />
              </button>

              {/* Icon and Title */}
              <div className="flex flex-col gap-5 pt-2 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-black border border-white/10 flex items-center justify-center text-[#6dadbe] group-hover:border-[#6dadbe]/50 transition-all duration-500 shadow-inner group-hover:shadow-[0_0_15px_rgba(109,173,190,0.2)]">
                  <Brain className="w-6 h-6" strokeWidth={1.5} />
                </div>
                <div className="flex-1 min-w-0 pr-8">
                  <h4 className="text-xl font-bold text-slate-100 truncate mb-2">
                    {set.title || "Study Set"}
                  </h4>
                  <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#6dadbe]/50">
                    Created: {moment(set.createdAt).format("MM.DD.YY")}
                  </p>
                </div>
              </div>

              {/* Stats and Indicator */}
              <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5 relative z-10">
                <div className="px-3 py-1 rounded bg-black border border-white/5 text-slate-400 font-mono text-[10px] uppercase tracking-widest">
                  {set.cards.length} {set.cards.length === 1 ? "CARD" : "CARDS"}
                </div>
                <div className="text-[#6dadbe] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
                  <ChevronRight className="w-5 h-5" strokeWidth={2} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="relative z-10">
        {selectedSet ? renderFlashcardViewer() : renderSetList()}
      </div>
      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Flashcard Set?"
      >
        <div className="space-y-6">
          <p className="text-sm text-slate-600">
            Are you sure you want to delete this flashcard set? This action
            cannot be undone and all cards will be permanently removed.
          </p>
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={deleting}
              className="px-5 h-11 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmDelete}
              disabled={deleting}
              className="px-6 h-11 bg-rose-500 hover:bg-rose-600 text-white font-bold text-sm rounded-xl transition-colors duration-200 disabled:opacity-50"
            >
              {deleting ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Deleting...
                </span>
              ) : (
                "Delete Set"
              )}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default FlashcardManager;