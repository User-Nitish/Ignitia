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
          className="group inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" strokeWidth={2} />
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
          <div className="flex items-center gap-8 bg-slate-50/50 p-2 rounded-2xl border border-slate-100">
            <button
              onClick={handlePrevCard}
              disabled={selectedSet.cards.length <= 1}
              className="p-3 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
              title="Previous Card"
            >
              <ChevronLeft className="w-5 h-5" strokeWidth={2.5} />
            </button>

            <div className="flex items-center gap-1.5 font-semibold text-slate-700">
              <span className="text-blue-600">{currentCardIndex + 1}</span>
              <span className="text-slate-300">/</span>
              <span>{selectedSet.cards.length}</span>
            </div>

            <button
              onClick={handleNextCard}
              disabled={selectedSet.cards.length <= 1}
              className="p-3 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
              title="Next Card"
            >
              <ChevronRight className="w-5 h-5" strokeWidth={2.5} />
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
        <div className="flex flex-col items-center justify-center py-16 px-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-blue-100 to-cyan-100 mb-6">
            <Brain className="w-8 h-8 text-blue-600" strokeWidth={2} />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            No Flashcards Yet
          </h3>
          <p className="text-sm text-slate-500 mb-8 text-center max-w-sm">
            Generate flashcards from your document to start learning and reinforce
          </p>
          <button
            onClick={handleGenerateFlashcards}
            disabled={generating}
            className={`group relative inline-flex items-center gap-3 px-8 h-14 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-blue-200/50 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden`}
          >
            {generating ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Generating Flashcards...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-blue-100 group-hover:rotate-12 transition-transform duration-300" strokeWidth={2} />
                <span>Generate Flashcards</span>
              </>
            )}
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Header with Generate Button */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Your Flashcard Sets
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              {flashcardSets.length}{" "}
              {flashcardSets.length === 1 ? "set" : "sets"} available
            </p>
          </div>
          <button
            onClick={handleGenerateFlashcards}
            disabled={generating}
            className="group inline-flex items-center gap-2.5 px-6 h-12 bg-blue-50 text-blue-600 font-bold rounded-xl border border-blue-100 hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-sm"
          >
            {generating ? (
              <>
                <div className="w-4 h-4 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" strokeWidth={2.5} />
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
              className="group relative bg-white border border-slate-200 hover:border-blue-300 rounded-[2rem] p-6 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-blue-100/50 flex flex-col gap-6"
            >
              {/* Delete Button */}
              <button
                onClick={(e) => handleDeleteRequest(e, set)}
                className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-slate-50 text-slate-400 opacity-0 group-hover:opacity-100 hover:bg-rose-50 hover:text-rose-500 transition-all duration-300 flex items-center justify-center border border-slate-100"
                title="Delete Set"
              >
                <Trash2 className="w-4.5 h-4.5" strokeWidth={2} />
              </button>

              {/* Icon and Title */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300 shadow-sm">
                  <Brain className="w-7 h-7" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-800 truncate">
                    {set.title || "Flashcard Set"}
                  </h4>
                  <p className="text-xs text-slate-400 font-medium">
                    {moment(set.createdAt).format("MMM D, YYYY")}
                  </p>
                </div>
              </div>

              {/* Stats and Indicator */}
              <div className="flex items-center justify-between mt-2 pt-4 border-t border-slate-50">
                <div className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">
                  {set.cards.length} {set.cards.length === 1 ? "card" : "cards"}
                </div>
                <div className="text-blue-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
                  <ChevronRight className="w-5 h-5" strokeWidth={2.5} />
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
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl shadow-xl shadow-slate-200/50 p-8">
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