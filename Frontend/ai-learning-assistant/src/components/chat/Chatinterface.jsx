import React, { useState, useEffect, useRef } from "react";
import { Send, MessageSquare, Sparkles } from "lucide-react";
import { useParams } from "react-router-dom";
import aiService from "../../services/aiService";
import { useAuth } from "../../context/AuthContext";
import Spinner from "../common/Spinner";
import MarkdownRenderer from "../common/MarkdownRenderer";

const ChatInterface = () => {
    const { id: documentId } = useParams();
    const { user } = useAuth();
    const [history, setHistory] = useState([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        const fetchChatHistory = async () => {
            try {
                setInitialLoading(true);
                const response = await aiService.getChatHistory(documentId);
                console.log("Chat history response:", response);
                // aiService returns response.data (the body), which has a .data property containing the messages array
                if (response.success && response.data) {
                    setHistory(response.data);
                } else {
                    setHistory([]);
                }
            } catch (error) {
                console.error("Failed to fetch chat history:", error);
            } finally {
                setInitialLoading(false);
            }
        };

        fetchChatHistory();
    }, [documentId]);

    useEffect(() => {
        scrollToBottom();
    }, [history]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        const userMessage = {
            role: "user",
            content: message,
            timestamp: new Date(),
        };

        setHistory((prev) => [...prev, userMessage]);
        setMessage("");
        setLoading(true);

        try {
            const response = await aiService.chat(documentId, userMessage.content);
            // aiService returns the JSON body { success: true, data: { answer, ... } }
            if (response.success && response.data) {
                const assistantMessage = {
                    role: "assistant",
                    content: response.data.answer,
                    timestamp: new Date(),
                    relevantChunks: response.data.relevantChunks,
                };
                setHistory((prev) => [...prev, assistantMessage]);
            }
        } catch (error) {
            console.error("Chat error:", error);
            const errorMessage = {
                role: "assistant",
                content: "Sorry, I encountered an error. Please try again.",
                timestamp: new Date(),
            };

            setHistory((prev) => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    const renderMessage = (msg, index) => {
        const isUser = msg.role === "user";
        return (
            <div
                key={index}
                className={`flex items-start gap-3 my-6 ${isUser ? "flex-row-reverse" : "flex-row"}`}
            >
                {!isUser && (
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0 border border-emerald-200">
                        <Sparkles className="w-4 h-4 text-emerald-600" strokeWidth={2.5} />
                    </div>
                )}

                <div
                    className={`group relative max-w-[85%] md:max-w-[75%] p-4 rounded-2xl shadow-sm transition-all duration-200 ${isUser
                        ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-tr-none"
                        : "bg-white border border-slate-200/80 text-slate-800 rounded-tl-none hover:border-slate-300"
                        }`}
                >
                    {isUser ? (
                        <p className="text-sm leading-relaxed">{msg.content}</p>
                    ) : (
                        <div className="text-sm leading-relaxed prose prose-slate max-w-none">
                            <MarkdownRenderer content={msg.content} />
                        </div>
                    )}

                    {isUser && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-teal-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-teal-700 shadow-sm">
                            {user?.username?.charAt(0).toUpperCase() || "U"}
                        </div>
                    )}
                    <span className="block mt-2 text-[10px] opacity-60 font-medium">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>
            </div>
        );
    };

    if (initialLoading) {
        return (
            <div className="flex flex-col h-[70vh] bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl items-center justify-center shadow-2xl shadow-slate-200/50">
                <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center animate-pulse">
                    <MessageSquare className="w-8 h-8 text-emerald-600" strokeWidth={2} />
                </div>
                <div className="mt-6 flex flex-col items-center">
                    <Spinner />
                    <p className="text-slate-500 font-semibold mt-4 text-sm tracking-wide">Initializing secure chat ...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[75vh] bg-white/60 backdrop-blur-2xl border border-slate-200/70 rounded-3xl shadow-2xl shadow-slate-200/40 overflow-hidden transition-all duration-300">
            {/* Messages Area */}
            <div className="flex-1 p-6 overflow-y-auto bg-gradient-to-br from-slate-50/80 via-white to-slate-50/80 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                {history.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center p-8 space-y-4">
                        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center shadow-inner">
                            <Sparkles className="w-10 h-10 text-emerald-500/80" strokeWidth={1.5} />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold text-slate-800">Knowledge Assistant Ready</h3>
                            <p className="text-slate-500 max-w-xs mx-auto text-sm">
                                Ask specific questions about the document to extract deep insights.
                            </p>
                        </div>
                    </div>
                )}

                {history.map(renderMessage)}

                <div ref={messagesEndRef} />

                {loading && (
                    <div className="flex items-start gap-3 my-6">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0 animate-bounce">
                            <Sparkles className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div className="px-5 py-4 rounded-2xl rounded-tl-none bg-white border border-slate-200/80 shadow-sm">
                            <div className="flex gap-1.5 item-center h-4">
                                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                                <span className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-5 border-t border-slate-200/60 bg-white/90 backdrop-blur-sm">
                <form onSubmit={handleSendMessage} className="relative flex items-center gap-3">
                    <div className="relative flex-1 group">
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Ask a follow-up question ..."
                            className="w-full h-14 pl-5 pr-14 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-emerald-400/50 focus:bg-white transition-all duration-300 text-sm shadow-sm"
                            disabled={loading}
                        />
                        <div className="absolute right-2 top-2">
                            <button
                                type="submit"
                                disabled={loading || !message.trim()}
                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all duration-200"
                            >
                                <Send className="w-4 h-4 ml-0.5" strokeWidth={2.5} />
                            </button>
                        </div>
                    </div>
                </form>
                <p className="mt-3 text-[10px] text-center text-slate-400 font-medium tracking-wide">
                    AI can make mistakes. Verify important information.
                </p>
            </div>
        </div>
    );
};
export default ChatInterface;


