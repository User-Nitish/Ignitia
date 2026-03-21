import React, { useState, useEffect } from "react";
import { Plus, Upload, Trash2, FileText, X } from "lucide-react";
import toast from "react-hot-toast";

import documentsService from "../../services/documentsService";
import Spinner from "../../components/common/Spinner";
import Button from "../../components/common/Button";
import DocumentCard from "../../components/documents/DocumentCard";
import { motion } from "framer-motion";

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

const DocumentListPage = () => {

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for upload modal
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploading, setUploading] = useState(false);

  // State for delete confirmation modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);

  const fetchDocuments = async () => {
    try {
      const data = await documentsService.getDocuments();
      setDocuments(data);
    } catch (error) {
      toast.error("Failed to fetch documents.");
      console.error(error);
    }
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadFile(file);
      setUploadTitle(file.name.replace(/\.[^/.]+$/, ""));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile || !uploadTitle) {
      toast.error("Please provide a title and select a file.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", uploadFile);
    formData.append("title", uploadTitle);

    try {
      await documentsService.uploadDocument(formData);
      toast.success("Document uploaded successfully!");
      setIsUploadModalOpen(false);
      setUploadFile(null);
      setUploadTitle("");
      setLoading(true);
      fetchDocuments();
    } catch (error) {
      toast.error(error.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteRequest = (doc) => {
    setSelectedDoc(doc);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedDoc) return;
    setDeleting(true);
    try {
      await documentsService.deleteDocument(selectedDoc._id);
      toast.success(`${selectedDoc.title} deleted.`);
      setIsDeleteModalOpen(false);
      setSelectedDoc(null);
      setDocuments(documents.filter((d) => d._id !== selectedDoc._id));
    } catch (error) {
      toast.error(error.message || "Failed to delete document.");
    } finally {
      setDeleting(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <Spinner />
        </div>
      );
    }

    if (documents.length === 0) {
      return (
        <motion.div variants={itemVariants} initial="hidden" animate="visible" className="flex flex-col items-center justify-center min-h-[450px] bg-black/40 backdrop-blur-md border border-dashed border-white/10 rounded-[3rem] p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-[#6dadbe]/5 pointer-events-none" />
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-[2rem] bg-black shadow-[0_0_20px_rgba(109,173,190,0.1)] mb-8 border border-[#6dadbe]/30 text-[#6dadbe]">
            <FileText className="w-12 h-12" strokeWidth={1.5} />
          </div>
          <h3 className="text-2xl font-light text-slate-100 mb-3 tracking-tight lowercase">
            No Documents <span className="font-bold uppercase italic text-white">Detected</span>
          </h3>
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-[#6dadbe]/50 mb-10 max-w-sm text-center leading-relaxed font-bold">
            &gt; Initializing upload protocol for data extraction...
          </p>
          <Button variant="primary" size="lg" onClick={() => setIsUploadModalOpen(true)}>
            <Plus className="w-5 h-5" strokeWidth={2} />
            Initialize Upload
          </Button>
        </motion.div>
      );
    }

    return (
      <motion.div 
        initial="hidden" animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {documents?.map((doc) => (
          <motion.div key={doc._id} variants={itemVariants}>
            <DocumentCard
              document={doc}
              onDelete={handleDeleteRequest}
            />
          </motion.div>
        ))}
      </motion.div>
    );
  };



  return (

    <div className="">
      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial="hidden" animate="visible" variants={itemVariants} className="flex items-end justify-between mb-12 relative">
          <div>
            <div className="flex items-center gap-3 mb-2">
               <div className="h-[1px] w-6 bg-[#6dadbe]/50" />
               <span className="text-[9px] font-mono tracking-[0.3em] text-[#6dadbe] uppercase font-bold">Library // Archive</span>
            </div>
            <h1 className="text-4xl font-light text-slate-100 tracking-tight lowercase">Data /<span className="font-bold text-white uppercase italic">Streams</span></h1>
            <p className="text-slate-500 text-sm mt-2 max-w-md">
              Encrypted learning materials and processed intelligence modules.
            </p>
          </div>

          {documents.length > 0 && (
            <Button variant="secondary" size="md" onClick={() => setIsUploadModalOpen(true)}>
              <Plus className="w-4 h-4" strokeWidth={2} />
              New Upload
            </Button>
          )}
        </motion.div>

        {renderContent()}

      </div>
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative w-full max-w-lg bg-[#030a0a] border border-white/10 rounded-[2.5rem] shadow-[0_12px_64px_rgba(0,0,0,0.8)] p-8 overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#6dadbe]/5 rounded-full blur-[60px] pointer-events-none translate-x-1/2 -translate-y-1/2" />
            
            {/* Close button */}
            <button
              onClick={() => setIsUploadModalOpen(false)}
              className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-xl text-slate-500 hover:text-white transition-all hover:bg-white/5 border border-transparent hover:border-white/10 z-50"
            >
              <X className="w-5 h-5" strokeWidth={2} />
            </button>

            {/* Modal Header */}
            <div className="mb-8 relative z-10">
              <div className="flex items-center gap-3 mb-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-[#6dadbe] animate-pulse" />
                 <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-[#6dadbe] uppercase">Input Protocol</span>
              </div>
              <h2 className="text-2xl font-light text-slate-100 lowercase">
                Initialize /<span className="font-bold text-white uppercase italic text-xl">Upload</span>
              </h2>
            </div>

            {/* Form */}
            <form onSubmit={handleUpload} className="space-y-6">
              {/* Title Input */}
              <div className="space-y-3 relative z-10">
                <label className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-slate-500 ml-1">
                  Tag // Title
                </label>
                <input
                  type="text"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  required
                  className="w-full h-14 px-5 bg-white/[0.03] border border-white/10 rounded-2xl focus:outline-none focus:border-[#6dadbe]/50 transition-all font-mono text-xs uppercase tracking-wider text-slate-200 placeholder:text-slate-700"
                  placeholder="ASSIGN DESIGNATION..."
                />
              </div>

              {/* File Upload */}
              <div className="space-y-3 relative z-10">
                <label className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-slate-500 ml-1">
                  Source // File
                </label>
                <div
                  onClick={() => document.getElementById('file-upload').click()}
                  className="relative border border-dashed border-white/10 rounded-[2rem] p-10 bg-black/40 hover:bg-[#6dadbe]/[0.02] hover:border-[#6dadbe]/30 transition-all group cursor-pointer text-center"
                >
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".pdf"
                  />
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-14 h-14 bg-black border border-white/10 text-[#6dadbe] rounded-2xl flex items-center justify-center group-hover:border-[#6dadbe]/50 transition-all shadow-[0_0_15px_rgba(109,173,190,0.05)]">
                      <Upload className="w-7 h-7" strokeWidth={1.5} />
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                        {uploadFile ? (
                          <span className="text-[#6dadbe] inline-block truncate max-w-[250px]">
                            &gt; {uploadFile.name}
                          </span>
                        ) : (
                          <span>Drop transmission or select source</span>
                        )}
                      </p>
                      <p className="text-[9px] font-mono text-slate-600 uppercase tracking-tighter">MAX CAPACITY: 10.00MB // FORMAT: PDF</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4 pt-4 relative z-10">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  disabled={uploading}
                  className="flex-1 h-14 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-slate-500 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-transparent hover:border-white/10 active:scale-95"
                >
                  Abort
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-[2] h-14 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-white bg-black border border-[#6dadbe]/50 hover:bg-[#6dadbe]/10 hover:border-[#6dadbe] rounded-2xl shadow-[0_4px_20px_rgba(109,173,190,0.1)] transition-all active:scale-95 disabled:opacity-50"
                >
                  {uploading ? (
                    <span className="flex items-center justify-center gap-3">
                      <div className="w-4 h-4 border-2 border-[#6dadbe]/30 border-t-[#6dadbe] rounded-full animate-spin" />
                      UPLOADING...
                    </span>
                  ) : (
                    "Init Sync"
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative w-full max-w-md bg-[#030a0a] border border-white/10 rounded-[2.5rem] p-10 shadow-[0_12px_64px_rgba(0,0,0,0.8)] overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-[40px] pointer-events-none translate-x-1/2 -translate-y-1/2" />
            
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-xl text-slate-500 hover:text-white transition-all hover:bg-white/5 border border-transparent hover:border-white/10 z-50"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center space-y-6 relative z-10">
              <div className="w-16 h-16 bg-black border border-rose-500/30 text-rose-500 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(225,29,72,0.1)]">
                <Trash2 className="w-8 h-8" strokeWidth={1.5} />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-light text-slate-100 lowercase">Delete /<span className="font-bold uppercase italic text-white text-xl">Archive</span></h2>
                <p className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">Protocol Override Required</p>
              </div>
              <p className="text-xs text-slate-400 px-2 leading-relaxed font-mono">
                ARE YOU SURE YOU WANT TO TERMINATE <span className="text-rose-400 font-bold italic">"{selectedDoc?.title}"</span>? ALL LINKED NEURAL NODES AND SIMS WILL BE PERMANENTLY ERASED.
              </p>
            </div>

            <div className="flex items-center gap-4 mt-10 relative z-10">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={deleting}
                className="flex-1 h-14 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-slate-500 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-transparent hover:border-white/10 active:scale-95"
              >
                Abort
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="flex-1 h-14 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-white bg-rose-600/10 hover:bg-rose-600/20 border border-rose-500/40 rounded-2xl shadow-[0_4px_20px_rgba(225,29,72,0.1)] transition-all active:scale-95 disabled:opacity-50"
              >
                {deleting ? "PURGING..." : "Terminate"}
              </button>
            </div>
          </motion.div>
        </div>
      )}


    </div >


  )
}

export default DocumentListPage;