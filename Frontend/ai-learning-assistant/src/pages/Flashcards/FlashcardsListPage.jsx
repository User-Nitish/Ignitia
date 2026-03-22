import React, { useState, useEffect } from 'react';
import flashcardService from '../../services/flashcardService';
import PageHeader from '../../components/common/PageHeader';
import Spinner from '../../components/common/Spinner';
import EmptyState from '../../components/common/EmptyState';
import FlashcardSetCard from '../../components/flashcards/FlashcardSetCard';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

const FlashcardsListPage = () => {
  const [flashcardSets, setFlashcardSets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlashcardSets = async () => {
      try {
        const response = await flashcardService.getAllFlashcardSets();
        setFlashcardSets(response.data || []);
      } catch (error) {
        toast.error('Failed to fetch flashcard sets.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchFlashcardSets();
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-12 h-12 border-2 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
          <p className="text-[10px] font-mono font-bold text-amber-500/40 uppercase tracking-[0.3em]">Retrieving Flashcard Clusters...</p>
        </div>
      );
    }

    if (flashcardSets.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] border border-dashed border-white/10 rounded-[3rem] p-12 bg-black/40">
            <div className="w-20 h-20 rounded-2xl bg-black border border-amber-500/30 text-amber-500 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(245,158,11,0.1)]">
               <BookOpen size={32} strokeWidth={1.5} />
            </div>
            <h3 className="text-2xl font-light text-slate-100 mb-2 lowercase">No Flashcard <span className="font-bold uppercase italic text-white">Archives</span></h3>
            <p className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-10 max-w-sm text-center">
               &gt; Neural training data sets not yet initialized...
            </p>
        </div>
      );
    }

    return (
      <motion.div 
        initial="hidden" animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.1 } }
        }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
      >
        {flashcardSets.map((set, index) => (
          <motion.div key={set._id} className="h-full" variants={itemVariants}>
            <FlashcardSetCard flashcardSet={set} />
          </motion.div>
        ))}
      </motion.div>
    );
  };

  return (
    <div className="space-y-8 pb-12">
      <div>
         <PageHeader title="All Flashcard Sets" />
      </div>
      {renderContent()}
    </div>
  );
};

export default FlashcardsListPage;