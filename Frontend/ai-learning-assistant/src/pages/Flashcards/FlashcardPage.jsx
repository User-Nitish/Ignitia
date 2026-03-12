import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  ChevronLeft,
  ChevronRight,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";

import flashcardService from "../../services/flashcardService";
import aiService from "../../services/aiService";
import PageHeader from "../../components/common/PageHeader";
import Spinner from "../../components/common/Spinner";
import EmptyState from "../../components/common/EmptyState";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import Flashcard from "../../components/flashcards/Flashcard";

const FlashcardPage = () => {
  const { id: documentId } = useParams();
  const [flashcardSets, setFlashcardSets] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchFlashcards = async () => {
    setLoading(true);
    try {
      const response = await flashcardService.getFlashcardsForDocument(documentId);
      setFlashcardSets(response.data[0]);
      setFlashcards(response.data[0]?.cards || []);
    } catch (error) {
      toast.error("Failed to fetch flashcards.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlashcards();
  }, [documentId]);

  const handleGenerateFlashcards = async () => {
    setGenerating(true);
    try {
      await aiService.generateFlashcards(documentId);
      toast.success("Flashcards generated successfully!");
      fetchFlashcards();
    } catch (error) {
      toast.error(error.message || "Failed to generate flashcards.");
    } finally {
      setGenerating(false);
    }
  };

  const markCardReviewed = async (index) => {
    const card = flashcards[index];
    if (!card || card.lastReviewed) return; // only call if not already reviewed
    try {
      await flashcardService.reviewFlashcard(card._id, index);
      // Optimistically update local state so progress bar reflects immediately
      setFlashcards((prev) =>
        prev.map((c, i) =>
          i === index ? { ...c, lastReviewed: new Date(), reviewCount: (c.reviewCount || 0) + 1 } : c
        )
      );
    } catch (error) {
      // silent — don't block navigation on review errors
      console.error("Failed to mark card as reviewed", error);
    }
  };

  const handleNextCard = () => {
    markCardReviewed(currentCardIndex);
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
  };

  const handlePrevCard = () => {
    markCardReviewed(currentCardIndex);
    setCurrentCardIndex(
      (prevIndex) => (prevIndex - 1 + flashcards.length) % flashcards.length
    );
  };

  const handleToggleStar = async (cardId) => {
    try {
      await flashcardService.toggleStar(cardId);
      setFlashcards((prevFlashcards) =>
        prevFlashcards.map((card) =>
          card._id === cardId ? { ...card, isStarred: !card.isStarred } : card
        )
      );
    } catch (error) {
      toast.error("Failed to update flashcard star status.");
    }
  };

  const handleDeleteFlashcardSet = async () => {
    setDeleting(true);
    try {
      await flashcardService.deleteFlashcardSet(flashcardSets._id);
      toast.success("Flashcard set deleted successfully!");
      setIsDeleteModalOpen(false);
      fetchFlashcards();
    } catch (error) {
      toast.error(error.message || "Failed to delete flashcard set.");
    } finally {
      setDeleting(false);
    }
  };

  const currentCard = flashcards[currentCardIndex];

  const renderFlashcardContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-20">
          <Spinner />
        </div>
      );
    }

    if (flashcards.length === 0) {
      return (
        <div className="bg-white border border-dashed border-slate-200 rounded-2xl">
          <EmptyState
            title="No Flashcards Yet"
            description="Generate flashcards from your document to start learning."
          />
        </div>
      );
    }

    return (
      <div className="space-y-8">
        {/* Flashcard Viewer */}
        <div className="max-w-2xl mx-auto">
          <Flashcard flashcard={currentCard} onToggleStar={handleToggleStar} />
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-center gap-6 py-2">
          <Button
            onClick={handlePrevCard}
            variant="secondary"
            disabled={flashcards.length <= 1}
            className="rounded-xl border-slate-200 px-6 font-bold shadow-sm"
          >
            <ChevronLeft size={18} className="mr-1" /> Previous
          </Button>

          <div className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl shadow-sm">
            <span className="text-base font-black text-blue-600">{currentCardIndex + 1}</span>
            <span className="text-slate-400 font-medium">/</span>
            <span className="text-base font-bold text-slate-600">{flashcards.length}</span>
          </div>

          <Button
            onClick={handleNextCard}
            variant="secondary"
            disabled={flashcards.length <= 1}
            className="rounded-xl border-slate-200 px-6 font-bold shadow-sm"
          >
            Next <ChevronRight size={18} className="ml-1" />
          </Button>
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center gap-2 flex-wrap px-4">
          {flashcards.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentCardIndex(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${index === currentCardIndex
                ? "bg-blue-500 scale-125"
                : "bg-slate-200 hover:bg-slate-300"
                }`}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Back Link */}
      <div>
        <Link
          to={`/documents/${documentId}`}
          className="group inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Document
        </Link>
      </div>

      {/* Header + Actions */}
      <div className="flex items-center justify-between">
        <PageHeader title="Flashcards" />
        <div className="flex items-center gap-3">
          {!loading && flashcards.length > 0 && (
            <Button
              onClick={() => setIsDeleteModalOpen(true)}
              disabled={deleting}
              className="flex items-center gap-2 rounded-xl border border-rose-200 text-rose-600 bg-rose-50 hover:bg-rose-500 hover:text-white px-5 font-bold shadow-sm transition-all"
            >
              <Trash2 size={16} /> Delete Set
            </Button>
          )}
          {!loading && flashcards.length === 0 && (
            <Button
              onClick={handleGenerateFlashcards}
              disabled={generating}
              className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-6 font-bold shadow-lg shadow-blue-200 transition-all"
            >
              {generating ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating...
                </div>
              ) : (
                <>
                  <Plus size={18} /> Generate Flashcards
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <div>{renderFlashcardContent()}</div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Flashcard Set"
      >
        <div className="space-y-6 p-2">
          <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl">
            <p className="text-sm text-slate-700">
              Are you sure you want to delete all flashcards for this document?
              This action <span className="font-bold text-rose-600">cannot be undone</span>.
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={deleting}
              className="rounded-xl px-6"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteFlashcardSet}
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

export default FlashcardPage;