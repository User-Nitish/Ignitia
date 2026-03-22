import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import documentsService from '../../services/documentsService';
import Spinner from '../../components/common/Spinner';
import toast from 'react-hot-toast';
import { FileText, Clock, File, MoreVertical, Download, ArrowLeft, ExternalLink } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import Tabs from "../../components/common/Tab";
import ChatInterface from "../../components/chat/Chatinterface";
import AIActions from '../../components/ai/AIActions';
import FlashcardManager from '../../components/flashcards/FlashcardManager';
import QuizManager from '../../components/quizzes/QuizManager';
import { motion } from 'framer-motion';

const DocumentDetailPage = () => {
  const { id } = useParams();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Content');

  useEffect(() => {
    const fetchDocumentDetails = async () => {
      try {
        const response = await documentsService.getDocumentById(id);
        console.log("Document fetch response:", response);
        // documentsService returns response.data (the body), which has a .data property containing the document
        if (response.success && response.data) {
          setDocument(response.data);
        } else {
          toast.error("Document not found or error in response");
        }
      } catch (error) {
        console.error("Document fetch error:", error);
        toast.error('Failed to fetch document details.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocumentDetails();
  }, [id]);

  // Helper function to get the full PDF URL
  const getPdfUrl = () => {
    if (!document?.filePath) return null;

    const filePath = document.filePath;

    if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
      return filePath;
    }

    const baseUrl = process.env.REACT_APP_API_URL || 'https://ignitia-a3oj.onrender.com';
    return `${baseUrl}${filePath.startsWith('/') ? '' : '/'}${filePath}`;
  };

  const renderContent = () => {
    if (loading) {
      return <Spinner />;
    }

    if (!document?.filePath) {
      return <div className="p-12 text-center text-slate-500 bg-white/5 rounded-2xl border border-dashed border-white/10">PDF not available</div>;
    }

    const pdfUrl = getPdfUrl();

    return (
      <div className="flex-1 flex flex-col min-h-[800px] bg-black border border-white/10 rounded-[2rem] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)] mb-8">
        <div className="flex items-center justify-between px-6 py-4 bg-white/[0.02] border-b border-white/10">
          <div className="flex items-center gap-3">
             <div className="w-1.5 h-1.5 rounded-full bg-[#6dadbe] animate-pulse" />
             <span className="text-[10px] font-mono font-bold text-[#6dadbe]/60 uppercase tracking-widest">Visual // Data // Output</span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-[10px] font-mono font-bold text-[#6dadbe]/60 hover:text-[#6dadbe] bg-white/5 hover:bg-[#6dadbe]/10 px-4 py-2 rounded-xl transition-all border border-white/10 hover:border-[#6dadbe]/40 uppercase tracking-widest"
            >
              <ExternalLink size={14} /> Link Out
            </a>
          </div>
        </div>

        <div className="flex-1 relative bg-[#030a0a] rounded-2xl overflow-hidden border border-white/5 shadow-2xl group">
          <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              download={`${document.title}.pdf`}
              className="flex items-center gap-2 px-4 py-2 bg-black/80 backdrop-blur-md border border-white/10 rounded-xl text-xs font-mono font-bold text-white hover:bg-[#6dadbe] hover:border-[#6dadbe] transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              Download PDF
            </a>
          </div>
          <iframe
            src={pdfUrl}
            className="absolute inset-0 w-full h-full border-none opacity-90"
            title="PDF Viewer"
          />
        </div>
      </div>
    );
  };

  const renderChat = () => {
    return <ChatInterface />

  };

  const renderAIActions = () => {
    return <AIActions />
  };

  const renderFlashcardsTab = () => {
    return <FlashcardManager documentId={id} />
  };

  const renderQuizzesTab = () => {
    return <QuizManager documentId={id} />
  };

  const tabs = [
    { name: 'Content', label: 'Content', content: renderContent() },
    { name: 'Chat', label: 'Chat', content: renderChat() },
    { name: 'AI Actions', label: 'AI Actions', content: renderAIActions() },
    { name: 'Flashcards', label: 'Flashcards', content: renderFlashcardsTab() },
    { name: 'Quizzes', label: 'Quizzes', content: renderQuizzesTab() },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner />
      </div>
    );
  }

  if (!document) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h2 className="text-xl font-bold text-slate-100 mb-2">Document Not Found</h2>
        <Link to="/documents" className="text-indigo-400 font-medium hover:underline">
          Return to Documents
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex flex-col h-[calc(100vh-120px)] pb-4">
      <div className="mb-6 shrink-0">
        <Link
          to="/documents"
          className="inline-flex items-center gap-3 px-5 py-3 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-slate-500 hover:text-[#6dadbe] bg-white/5 border border-white/10 rounded-2xl hover:border-[#6dadbe]/30 hover:bg-[#6dadbe]/5 shadow-sm transition-all duration-300 group active:scale-95"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Abort // Return
        </Link>
      </div>

      <div className="shrink-0 mb-6">
        <PageHeader title={document?.title || "Document Details"} />
      </div>

      <div className="flex-1 flex flex-col min-h-0 bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-black/50">
        <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </motion.div>
  );
};

export default DocumentDetailPage;