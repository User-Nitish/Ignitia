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
                    <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center flex-shrink-0 border border-[#6dadbe]/40 shadow-[0_0_10px_rgba(109,173,190,0.2)]">
                        <Sparkles className="w-4 h-4 text-[#6dadbe]" strokeWidth={2.5} />
                    </div>
                )}

                <div
                    className={`group relative max-w-[85%] md:max-w-[75%] p-4 rounded-2xl shadow-sm transition-all duration-300 ${isUser
                        ? "bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-tr-none shadow-[0_4px_15px_rgba(0,0,0,0.5)]"
                        : "bg-black/60 backdrop-blur-md border border-[#6dadbe]/20 text-slate-300 rounded-tl-none hover:border-[#6dadbe]/40 shadow-[0_4px_15px_rgba(0,0,0,0.5)] font-mono text-[13px] leading-relaxed"
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
                        <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white/20 border-2 border-white flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
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
            <div className="flex flex-col h-[70vh] bg-black/80 backdrop-blur-3xl border border-white/10 rounded-[2rem] items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.8)] relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#6dadbe]/5 rounded-full blur-[100px] pointer-events-none" />
                <div className="w-16 h-16 rounded-2xl bg-black border border-[#6dadbe]/30 flex items-center justify-center animate-pulse shadow-[0_0_20px_rgba(109,173,190,0.2)] z-10">
                    <MessageSquare className="w-8 h-8 text-[#6dadbe]" strokeWidth={1.5} />
                </div>
                <div className="mt-8 flex flex-col items-center z-10">
                    <Spinner />
                    <p className="text-[#6dadbe]/70 font-mono mt-6 text-xs tracking-[0.2em] uppercase">Booting Neural Link...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[75vh] bg-black/80 backdrop-blur-3xl border border-white/10 rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.8)] overflow-hidden transition-all duration-500 relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#6dadbe]/5 rounded-full blur-[80px] pointer-events-none" />
            
            {/* Messages Area */}
            <div data-lenis-prevent className="flex-1 min-h-0 p-6 overflow-y-auto bg-transparent scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent z-10 relative">
                {history.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center p-8 space-y-6">
                        <div className="w-20 h-20 rounded-2xl bg-black border border-[#6dadbe]/30 flex items-center justify-center shadow-[0_0_30px_rgba(109,173,190,0.1)] relative">
                            <div className="absolute inset-x-0 h-[1px] top-1/2 bg-[#6dadbe]/20" />
                            <div className="absolute inset-y-0 w-[1px] left-1/2 bg-[#6dadbe]/20" />
                            <Sparkles className="w-8 h-8 text-[#6dadbe] z-10" strokeWidth={1.5} />
                        </div>
                        <div className="space-y-3">
                            <h3 className="text-xl font-light text-slate-100 tracking-[0.1em] uppercase">Comm-Link <span className="font-bold text-white">Active</span></h3>
                            <p className="text-[#6dadbe]/60 max-w-xs mx-auto text-xs font-mono uppercase tracking-widest leading-relaxed">
                                &gt; Awaiting query input for data extraction...
                            </p>
                        </div>
                    </div>
                )}

                {history.map(renderMessage)}

                <div ref={messagesEndRef} />

                {loading && (
                    <div className="flex items-start gap-3 my-6">
                        <div className="w-8 h-8 rounded-lg bg-black border border-[#6dadbe]/40 flex items-center justify-center flex-shrink-0 shadow-[0_0_10px_rgba(109,173,190,0.2)]">
                            <Sparkles className="w-4 h-4 text-[#6dadbe] animate-pulse" />
                        </div>
                        <div className="px-5 py-4 rounded-2xl rounded-tl-none bg-black/60 backdrop-blur-md border border-[#6dadbe]/20 shadow-sm">
                            <div className="flex gap-2 item-center h-4">
                                <span className="w-2 h-2 bg-[#6dadbe]/50 rounded-sm animate-[pulse_1s_infinite]" style={{ animationDelay: "0ms" }}></span>
                                <span className="w-2 h-2 bg-[#6dadbe]/80 rounded-sm animate-[pulse_1s_infinite]" style={{ animationDelay: "150ms" }}></span>
                                <span className="w-2 h-2 bg-[#6dadbe]/50 rounded-sm animate-[pulse_1s_infinite]" style={{ animationDelay: "300ms" }}></span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-5 border-t border-white/10 bg-black/90 backdrop-blur-xl z-20 relative">
                <form onSubmit={handleSendMessage} className="relative flex items-center gap-3">
                    <div className="relative flex-1 group/input">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6dadbe]/50 font-mono text-sm leading-none">&gt;</div>
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="TRANSMIT QUERY..."
                            className="w-full h-14 pl-10 pr-14 bg-white/[0.03] border border-white/10 rounded-xl text-slate-200 placeholder:text-[#6dadbe]/30 focus:outline-none focus:border-[#6dadbe]/50 focus:bg-white/[0.05] transition-all duration-300 font-mono text-xs uppercase tracking-wider shadow-inner"
                            disabled={loading}
                        />
                        <div className="absolute right-2 top-2">
                            <button
                                type="submit"
                                disabled={loading || !message.trim()}
                                className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-[#6dadbe] hover:border-[#6dadbe]/40 hover:bg-[#6dadbe]/10 active:scale-95 disabled:opacity-50 transition-all duration-300"
                            >
                                <Send className="w-4 h-4" strokeWidth={2} />
                            </button>
                        </div>
                    </div>
                </form>
                <p className="mt-4 text-[9px] font-mono text-center text-[#6dadbe]/40 uppercase tracking-[0.2em]">
                    // Warning: Neural outputs may contain hallucinations. Verify critical data. //
                </p>
            </div>
        </div>
    );
};
export default ChatInterface;


