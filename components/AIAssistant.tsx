
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI, Chat } from "@google/genai";
import { MessageSquare, X, Send, Bot, Loader2, Minimize2 } from 'lucide-react';
import { AI_CONTEXT } from '../constants';

interface Message {
  role: 'user' | 'model';
  text: string;
}

const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Hello. I am your AI Learning Advisor. I can answer questions about AI in Education or help you review the key concepts of this presentation.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  // Initialize AI Chat Client
  const [chatSession, setChatSession] = useState<Chat | null>(null);

  useEffect(() => {
    if (process.env.API_KEY) {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction: `
            You are a Futuristic AI Learning Advisor and Presentation Assistant.
            Your persona is professional, encouraging, analytical, and concise.
            
            You have access to the following transcript of the presentation "AI in Education: The Future is Now":
            ${AI_CONTEXT}

            Your Role:
            1. Answer questions strictly based on the provided context.
            2. If a user asks something outside this context, politely pivot back to education or admit you are limited to the presentation data.
            3. Act as a tutor: test the user's understanding if they ask for it.
            4. Keep responses brief (under 80 words) unless asked to elaborate.
            5. Use formatting like bullet points for clarity.
          `,
        },
      });
      setChatSession(chat);
    }
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || !chatSession || isLoading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const result = await chatSession.sendMessage({ message: userMsg });
      let responseText = result.text;
      
      // Remove markdown formatting (**, *, #, etc.)
      responseText = responseText
        .replace(/\*\*(.+?)\*\*/g, '$1')  // Remove bold **text**
        .replace(/\*(.+?)\*/g, '$1')      // Remove italic *text*
        .replace(/^#+\s+/gm, '')            // Remove headers
        .replace(/\n- /g, '\n• ')          // Convert - to •
        .trim();
      
      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Error: Unable to process data. System link unstable." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-24 sm:bottom-28 right-3 sm:right-6 z-40 flex flex-col items-end pointer-events-auto font-sans">
      
      {/* Toggle Button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(true)}
          className="bg-neon-cyan text-black p-2.5 sm:p-4 rounded-full shadow-[0_0_20px_rgba(0,243,255,0.6)] hover:bg-white transition-colors relative group"
        >
          <Bot size={20} className="sm:w-7 sm:h-7" />
          <span className="absolute -top-2 -right-2 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full animate-pulse" />
          <div className="absolute right-full mr-2 sm:mr-4 top-1/2 -translate-y-1/2 bg-black/80 text-neon-cyan px-2 sm:px-3 py-1 rounded text-xs font-mono whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity border border-neon-cyan/30 backdrop-blur-md">
            AI TUTOR ACTIVE
          </div>
        </motion.button>
      )}

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? 'auto' : '400px',
              width: isMinimized ? '280px' : '320px'
            }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="bg-black/90 backdrop-blur-xl border border-neon-cyan/50 rounded-lg shadow-2xl overflow-hidden flex flex-col sm:h-[500px] sm:w-[380px]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-3 sm:p-4 border-b border-neon-cyan/20 bg-neon-cyan/5">
              <div className="flex items-center gap-2">
                <Bot size={16} className="sm:w-[18px] sm:h-[18px] text-neon-cyan" />
                <span className="font-display text-xs sm:text-sm tracking-wider text-neon-cyan">AI ADVISOR // V.2.5</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <button 
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <Minimize2 size={14} className="sm:w-4 sm:h-4" />
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-slate-400 hover:text-red-500 transition-colors"
                >
                  <X size={16} className="sm:w-[18px] sm:h-[18px]" />
                </button>
              </div>
            </div>

            {/* Chat Area */}
            {!isMinimized && (
              <>
                <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-3 sm:space-y-4 custom-scrollbar">
                  {messages.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[85%] p-2 sm:p-3 rounded-lg text-xs sm:text-sm leading-relaxed ${
                          msg.role === 'user' 
                            ? 'bg-neon-cyan/20 text-white border border-neon-cyan/50 rounded-tr-none' 
                            : 'bg-slate-800/80 text-slate-200 border border-slate-700 rounded-tl-none'
                        }`}
                      >
                         {msg.text.split('\n').map((line, idx) => (
                           <React.Fragment key={idx}>
                             {line}
                             {idx < msg.text.split('\n').length - 1 && <br />}
                           </React.Fragment>
                         ))}
                      </div>
                    </motion.div>
                  ))}
                  {isLoading && (
                     <div className="flex justify-start">
                        <div className="bg-slate-800/80 p-2 sm:p-3 rounded-lg border border-slate-700 rounded-tl-none flex items-center gap-2">
                            <Loader2 size={12} className="sm:w-[14px] sm:h-[14px] animate-spin text-neon-cyan" />
                            <span className="text-xs text-slate-400 font-mono animate-pulse">PROCESSING_DATA...</span>
                        </div>
                     </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-2 sm:p-4 border-t border-neon-cyan/20 bg-black/50">
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="Ask about AI education..."
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-full py-1.5 sm:py-2 pl-3 sm:pl-4 pr-10 sm:pr-12 text-xs sm:text-sm text-white focus:outline-none focus:border-neon-cyan transition-colors placeholder:text-slate-600 font-mono"
                      disabled={isLoading}
                    />
                    <button 
                      onClick={handleSend}
                      disabled={isLoading || !input.trim()}
                      className="absolute right-1 p-1 sm:p-1.5 bg-neon-cyan rounded-full text-black hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send size={12} className="sm:w-[14px] sm:h-[14px]" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIAssistant;
