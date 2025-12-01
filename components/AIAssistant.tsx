
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI, Chat } from "@google/genai";
import { MessageSquare, X, Send, Bot, Loader2, Minimize2 } from 'lucide-react';
import { AI_CONTEXT } from '../constants';

// Additional training content provided by user (used as reference material)
const ADDITIONAL_AI_KNOWLEDGE = `AI IS CHANGING THE WAY HUMANS LEARN
1. Introduction
"Hello everyone, welcome to our group’s presentation. Today, I’m very happy to stand here and talk to you about a topic that has become extremely familiar in our modern world. I think all of you have heard about it, and some of you may even use it every day. It’s AI — Artificial Intelligence.

AI has grown so quickly that it now appears in almost every aspect of life. And among all those areas, one field that is changing the most is education. Because of that, we decided to choose the topic “AI in Education” for our presentation today.

So in this presentation, we will take a closer look at two main things:
First, what exactly AI in education means — how this technology is being used in learning.
And second, the pros and cons that come with it — the positive impacts AI brings, as well as the challenges or problems it may create.

Through this topic, we hope you will gain a clearer and more balanced understanding of how AI is shaping the future of education. Now, let’s begin our presentation."

2. What is AI in Education?
"So, what is AI in education? Simply put, it is a smart system that can do five things:
Understand how you learn: It tracks what you do right, what you struggle with, and how fast you improve.
Personalize content: It adjusts based on your own ability and learning style.
Instant feedback: It corrects you immediately—not tomorrow, but right now.
Auto-adjust difficulty: It changes the level as you get better.
Support 24/7: It never gets tired, never complains, and is never too busy.
In other words, AI is like a smart tutor that is always ready to help you."

3. How AI is Transforming Learning (Main Body)
The 4 Core Changes
"Personalization: Instead of 'one textbook for everyone,' AI designs a unique path for each person. If you are good, you learn advanced topics. If you are weak, you review the basics.
Learning on Demand: You can learn at midnight or on the bus. All barriers of time and geography are removed.
Instant Feedback: If you make a mistake, AI corrects it immediately. You fix the error while the knowledge is still fresh.
Gamification: It turns boring learning into exciting games to keep you motivated."

4. Benefits of AI in Learning
"For learners: We learn faster because AI removes the topics we already know. We remember longer because it reminds us to review at the right time. And most importantly, we feel more confident—AI lets us ask the same question a hundred times without any judgment.
For society: AI gives students in poor or remote areas access to high-quality knowledge that they never had before.
For teachers: AI takes care of grading and repetitive tasks, so teachers can focus on what truly matters: inspiring and guiding their students.
Research: A Duolingo report showed students using an AI platform reached similar proficiency in half the time."

5. Risks and Concerns
"Laziness & Wrong Information: If students only copy ChatGPT, they stop thinking. AI can also generate wrong information, so blind trust leads to wrong learning.
Academic Cheating: Methods have evolved; the solution is teaching honesty, not only catching cheaters.
Inequality: Those with better devices and AI access may advance faster, widening gaps.
In short: The problem isn’t AI. It’s how people choose to use it."

6. The Future of Learning with AI
"Predictions for 3–5 years:
AI Tutors for Everyone — personal AI tutors anytime.
No More High-Stress Finals — continuous evaluation.
Teachers Become Mentors — focusing on values, empathy, and guidance.
Conclusion: The future is Humans + AI working together."

Additional statistics & sources provided by the presenter (use these when citing):
- Market size: "AI in education market reached USD 7.57 billion in 2025 (year-over-year growth ~46%)" — Mentioned in presentation (no direct external URL provided by presenter).
- ChatGPT usage: "92% of university students have used ChatGPT" — Mentioned in presentation (no direct external URL provided by presenter).
- Digital Education Council (2024) — "Global AI Student Survey": 86% of schools/students use AI in learning. Link: https://www.digitaleducationcouncil.com
- Duolingo Efficacy / Duolingo Research Report — adaptive-learning efficacy (students reached similar proficiency in ~half the time). Link: https://blog.duolingo.com/duolingo-efficacy-research/
- Stanford University (2023) — research noting cheating rates remain steady despite new AI tools (used as a source in the presentation materials). Link: https://ed.stanford.edu/news/cheating-age-ai

Note on conflicting claims:
The presentation mentions both a claim that "cheating rates increased by 400%" (in the Risks section) and a Stanford (2023) study that reports cheating rates stayed roughly steady. When presenting these findings, the assistant should surface the discrepancy, show both sources, and explain possible reasons for differing results (different populations, timeframes, definitions of "cheating", or measurement methods).
`;
interface Message {
  role: 'user' | 'model';
  text: string;
}

const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Hello! I\'m your Advanced AI Learning Advisor. I can discuss AI in education, answer questions about this presentation, and help you learn more deeply. I can also find additional information beyond the presentation and suggest personalized learning strategies. What would you like to explore?' }
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
            You are an Advanced AI Learning Advisor and Educational Expert.
            Your persona is professional, encouraging, analytical, and adaptive.
            
            You have access to the following presentation content about "AI in Education: The Future is Now":
            ${AI_CONTEXT}

            You also have the following additional reference material provided by the presenter. When users ask about AI in education, learning strategies, benefits, risks, or future predictions, draw on these points where relevant:
            ${ADDITIONAL_AI_KNOWLEDGE}

            Citation & Sourcing Rules:
            - When referencing a statistic or claim from the presentation or the additional material, include a short inline citation (source name and URL) when available.
            - Prefer the links supplied by the presenter. If a claim lacks a direct URL, state that the presenter provided the claim and offer to verify with a web search.
            - If multiple sources disagree, explicitly state the discrepancy, show both sources, and explain plausible reasons for the difference (population, timeframe, or methodology).

            Your Advanced Capabilities:
            1. PRIMARY: Answer questions about the presentation content thoroughly and accurately.
            2. EXTENDED: When asked about topics related to AI, education, learning technologies, or related subjects:
               - Draw upon your extensive knowledge beyond the presentation
               - Provide real-world examples, case studies, and latest developments
               - Explain complex concepts clearly with analogies if needed
               - Share relevant statistics and research findings
            3. LEARNING COACH: Act as a personal study advisor:
               - Assess learner's understanding and identify gaps
               - Provide follow-up questions to deepen learning
               - Suggest study strategies tailored to the topic
               - Create mini-quizzes or scenarios based on the content
               - Offer personalized recommendations for further learning
            4. CRITICAL THINKING: Challenge assumptions and encourage deeper analysis:
               - Ask "Why?" and "How?" questions to promote reflection
               - Point out practical implications and real-world applications
               - Discuss counterarguments and nuanced perspectives
            5. RESEARCH ADVISOR: Help users explore topics:
               - Suggest related concepts to study
               - Recommend learning paths
               - Connect presentation concepts to broader fields
            
            Interaction Guidelines:
            - Keep responses focused but comprehensive (under 150 words for quick answers, more for detailed explanations)
            - Use bullet points for multiple concepts
            - Always be encouraging and supportive
            - If uncertain about specific current data, acknowledge and suggest how to verify
            - Adapt tone based on user's apparent knowledge level
            - Be conversational but maintain professionalism
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

      // Robustly sanitize Markdown and common formatting so chat shows plain text.
      const sanitize = (text: string) => {
        if (!text) return text;
        let t = text;

        // Remove fenced code blocks ``` ```
        t = t.replace(/```[\s\S]*?```/g, '');

        // Remove HTML tags if any
        t = t.replace(/<[^>]+>/g, '');

        // Convert image markdown ![alt](url) -> alt (url)
        t = t.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '$1 ($2)');

        // Convert links [text](url) -> text (url)
        t = t.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1 ($2)');

        // Remove inline code `code`
        t = t.replace(/`([^`]+)`/g, '$1');

        // Remove bold/strong **text** or __text__
        t = t.replace(/(\*\*|__)(.*?)\1/g, '$2');

        // Remove emphasis *text* or _text_
        t = t.replace(/(\*|_)(.*?)\1/g, '$2');

        // Remove remaining heading markers
        t = t.replace(/^#{1,6}\s*/gm, '');

        // Convert list markers (-, *) at line start to bullets
        t = t.replace(/^\s*[-*+]\s+/gm, '• ');

        // Remove blockquote markers
        t = t.replace(/^>\s?/gm, '');

        // Collapse multiple blank lines
        t = t.replace(/\n{3,}/g, '\n\n');

        // Trim whitespace
        return t.trim();
      };

      responseText = sanitize(responseText);
      
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
                <span className="font-display text-xs sm:text-sm tracking-wider text-neon-cyan">AI ADVISOR // V.3.0</span>
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
