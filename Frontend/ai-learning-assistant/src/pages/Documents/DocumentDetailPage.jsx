import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import documentsService from '../../services/documentsService';
import Spinner from '../../components/common/Spinner';
import toast from 'react-hot-toast';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import PageHeader from "../../components/common/PageHeader";
import Tabs from "../../components/common/Tab";
import ChatInterface from "../../components/chat/Chatinterface";
import AIActions from '../../components/ai/AIActions';
import FlashcardManager from '../../components/flashcards/FlashcardManager';
import QuizManager from '../../components/quizzes/QuizManager';

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
      return <div className="p-12 text-center text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-200">PDF not available</div>;
    }

    const pdfUrl = getPdfUrl();

    return (
      <div className="flex-1 flex flex-col min-h-[800px] bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xl mb-8">
        <div className="flex items-center justify-between p-4 bg-slate-50 border-b border-slate-200">
          <span className="text-sm font-semibold text-slate-700">Document Viewer</span>
          <div className="flex items-center gap-3">
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg transition-colors"
            >
              <ExternalLink size={14} /> Open in new tab
            </a>
          </div>
        </div>

        <div className="flex-1 w-full relative bg-slate-100" style={{ height: '800px' }}>
          <iframe
            src={pdfUrl}
            className="absolute inset-0 w-full h-full border-none"
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
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Document Not Found</h2>
        <Link to="/documents" className="text-emerald-600 font-medium hover:underline">
          Return to Documents
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] pb-4">
      <div className="mb-6 shrink-0">
        <Link
          to="/documents"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-600 hover:text-emerald-600 bg-white border border-slate-200 rounded-xl hover:border-emerald-200 shadow-sm transition-all duration-200 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to Documents
        </Link>
      </div>

      <div className="shrink-0 mb-6">
        <PageHeader title={document?.title || "Document Details"} />
      </div>

      <div className="flex-1 flex flex-col min-h-0 bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200/50">
        <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </div>
  );
};

export default DocumentDetailPage;