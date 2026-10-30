"use client"

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { MessageCircle, X, Send, Sparkles, Loader2, RefreshCw } from 'lucide-react';

interface TripChatbotProps {
    tripContext: any;
}

interface ChatMessage {
    role: 'user' | 'model';
    content: string;
}

const TripChatbot: React.FC<TripChatbotProps> = ({ tripContext }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const destination = tripContext?.destination || 'your destination';

    // Auto-scroll to bottom of messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading, isOpen]);

    const handleSend = async (textToSend?: string) => {
        const text = textToSend || input;
        if (!text.trim() || isLoading) return;

        const userMessage: ChatMessage = { role: 'user', content: text };
        setMessages(prev => [...prev, userMessage]);
        if (!textToSend) setInput('');
        setIsLoading(true);

        try {
            const response = await axios.post('/api/chat', {
                messages: [...messages, userMessage],
                tripContext
            });

            if (response.data?.reply) {
                setMessages(prev => [...prev, { role: 'model', content: response.data.reply }]);
            } else {
                setMessages(prev => [...prev, { role: 'model', content: "Sorry, I couldn't process that request." }]);
            }
        } catch (error) {
            console.error("Error sending message to chatbot:", error);
            setMessages(prev => [...prev, { role: 'model', content: "Sorry, I encountered an error. Please try again." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const formatMessageText = (text: string) => {
        const lines = text.split('\n');
        const elements: React.ReactNode[] = [];
        let currentList: React.ReactNode[] = [];
        let listType: 'bullet' | 'number' | null = null;

        const renderList = (key: string) => {
            if (listType === 'bullet') {
                elements.push(
                    <ul key={key} className="list-disc pl-5 mb-2 space-y-1 text-xs sm:text-sm text-neutral-700 dark:text-neutral-300">
                        {currentList}
                    </ul>
                );
            } else if (listType === 'number') {
                elements.push(
                    <ol key={key} className="list-decimal pl-5 mb-2 space-y-1 text-xs sm:text-sm text-neutral-700 dark:text-neutral-300">
                        {currentList}
                    </ol>
                );
            }
            currentList = [];
            listType = null;
        };

        const formatInline = (str: string) => {
            const parts = str.split(/(\*\*.*?\*\*)/g);
            return parts.map((part, idx) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    return (
                        <strong key={idx} className="font-semibold text-neutral-900 dark:text-neutral-50">
                            {part.slice(2, -2)}
                        </strong>
                    );
                }
                return part;
            });
        };

        lines.forEach((line, idx) => {
            const trimmed = line.trim();
            
            // Check for bullet list item
            if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
                if (listType !== 'bullet') {
                    renderList(`list-before-${idx}`);
                    listType = 'bullet';
                }
                currentList.push(
                    <li key={`li-${idx}`} className="leading-relaxed">
                        {formatInline(trimmed.substring(2))}
                    </li>
                );
            }
            // Check for numbered list item
            else if (/^\d+\.\s/.test(trimmed)) {
                if (listType !== 'number') {
                    renderList(`list-before-${idx}`);
                    listType = 'number';
                }
                const content = trimmed.replace(/^\d+\.\s/, '');
                currentList.push(
                    <li key={`li-${idx}`} className="leading-relaxed">
                        {formatInline(content)}
                    </li>
                );
            }
            // Normal paragraph or empty line
            else {
                if (listType) {
                    renderList(`list-end-${idx}`);
                }
                if (trimmed === '') {
                    elements.push(<div key={`spacer-${idx}`} className="h-2" />);
                } else {
                    elements.push(
                        <p key={`p-${idx}`} className="mb-2 last:mb-0 leading-relaxed text-xs sm:text-sm text-neutral-700 dark:text-neutral-300">
                            {formatInline(line)}
                        </p>
                    );
                }
            }
        });

        if (listType) {
            renderList(`list-final`);
        }

        return <div className="space-y-0.5">{elements}</div>;
    };

    const suggestedQuestions = [
        {
            label: "💰 Estimated Cost",
            query: `Based on the hotels and activities in this plan, what is the estimated total cost of this trip (accommodation, average food, and ticket fees)?`
        },
        {
            label: "☀️ Weather & Clothing",
            query: `What is the typical weather in ${destination} and what kind of clothing should I pack?`
        },
        {
            label: "🏆 Best Hotel",
            query: `Which of the recommended hotels in this trip has the best ratings, and why should I choose it?`
        }
    ];

    const resetChat = () => {
        setMessages([]);
    };

    return (
        <div className="font-sans">
            {/* Floating Chat Button */}
            <div className="fixed bottom-44 right-10 sm:bottom-10 sm:right-28 z-50 no-print">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl cursor-pointer transition-all duration-300 transform active:scale-95 ${
                        isOpen 
                            ? 'bg-neutral-800 dark:bg-neutral-700 rotate-90' 
                            : 'bg-primary hover:bg-[#FF5A3A] hover:scale-105'
                    }`}
                    title="Ask Trip Assistant"
                >
                    {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-7 h-7" />}
                </button>
            </div>

            {/* Chat Window Popup */}
            {isOpen && (
                <div className="fixed inset-x-4 top-24 bottom-20 sm:inset-auto sm:bottom-28 sm:right-28 sm:w-96 sm:h-[500px] z-50 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-200">
                    {/* Header */}
                    <div className="bg-neutral-50 dark:bg-neutral-800/60 border-b border-neutral-200 dark:border-neutral-800 px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                            <div>
                                <h3 className="font-bold text-xs sm:text-sm text-neutral-800 dark:text-neutral-100 flex items-center gap-1">
                                    Trip Assistant <Sparkles className="w-3.5 h-3.5 text-primary fill-primary/20" />
                                </h3>
                                <p className="text-[10px] text-neutral-500 dark:text-neutral-400">Ask about your trip to {destination}</p>
                            </div>
                        </div>
                        <button 
                            onClick={resetChat} 
                            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors" 
                            title="Clear Chat"
                        >
                            <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {/* Greeting Message */}
                        <div className="flex justify-start">
                            <div className="max-w-[85%] bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 p-3 rounded-2xl rounded-tl-sm text-xs sm:text-sm">
                                <p className="leading-relaxed">
                                    Hi there! I'm your travel assistant. I have reviewed your itinerary for <strong>{destination}</strong>.
                                </p>
                                <p className="mt-1.5 leading-relaxed">
                                    Ask me about hotels, estimated costs, best times to visit specific spots, weather, or local recommendations!
                                </p>
                            </div>
                        </div>

                        {/* Suggested Questions (only show if conversation has just started) */}
                        {messages.length === 0 && (
                            <div className="space-y-2 mt-2">
                                <p className="text-[10px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">Suggested Questions</p>
                                <div className="flex flex-col gap-1.5">
                                    {suggestedQuestions.map((q, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleSend(q.query)}
                                            className="text-left w-full text-xs py-2 px-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 text-neutral-700 dark:text-neutral-300 border border-neutral-150 dark:border-neutral-800/80 hover:bg-primary/5 hover:text-primary hover:border-primary/20 dark:hover:bg-primary/5 transition-all text-ellipsis overflow-hidden cursor-pointer"
                                        >
                                            {q.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Messages Thread */}
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[85%] p-3 rounded-2xl text-xs sm:text-sm ${
                                        msg.role === 'user'
                                            ? 'bg-primary text-white rounded-tr-sm'
                                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 rounded-tl-sm'
                                    }`}
                                >
                                    {msg.role === 'user' ? (
                                        <p className="leading-relaxed">{msg.content}</p>
                                    ) : (
                                        formatMessageText(msg.content)
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Loader */}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 py-2.5 px-4 rounded-2xl rounded-tl-sm flex items-center gap-2 text-xs">
                                    <Loader2 className="animate-spin w-4 h-4 text-primary" />
                                    <span>Reviewing trip details...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Panel */}
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSend();
                        }}
                        className="p-3 bg-neutral-50 dark:bg-neutral-800/30 border-t border-neutral-200 dark:border-neutral-800 flex items-center gap-2"
                    >
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type a message..."
                            disabled={isLoading}
                            className="flex-1 min-w-0 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl px-3 py-2 text-xs sm:text-sm outline-none focus:border-primary transition-colors text-neutral-800 dark:text-neutral-100 placeholder-neutral-400"
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isLoading}
                            className="p-2 rounded-xl bg-primary hover:bg-[#FF5A3A] text-white disabled:opacity-50 disabled:bg-neutral-300 dark:disabled:bg-neutral-800 dark:disabled:text-neutral-600 transition-colors flex-shrink-0 cursor-pointer"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default TripChatbot;
