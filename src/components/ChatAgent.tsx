import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, MessageSquare, Sparkles, AlertCircle } from 'lucide-react';
import { PortfolioData, ThemeStyle } from '../types';

interface ChatAgentProps {
  portfolioData: PortfolioData;
  activeTheme: ThemeStyle;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatAgent({ portfolioData, activeTheme }: ChatAgentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hello! I am ${portfolioData.personalInfo.name}'s virtual AI Copilot, grounded live in his active resume metrics. Ask me anything about his technical projects, systems background, or check his availability!`
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorLocal, setErrorLocal] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Suggested quick-query chips
  const suggestions = [
    `What are ${portfolioData.personalInfo.name.split(' ')[0]}'s core strengths?`,
    "Tell me about his recent AI experiences.",
    "Give me a quick bio summary.",
    "How can I contact him?"
  ];

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (userText: string) => {
    if (!userText || userText.trim().length === 0) return;

    setErrorLocal(null);
    const newMessages = [...messages, { role: 'user' as const, content: userText }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/portfolio/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: newMessages,
          portfolioData: portfolioData,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed context exchange.");
      }

      const data = await response.json();
      setMessages([...newMessages, { role: 'assistant', content: data.reply }]);
    } catch (err: any) {
      console.error(err);
      
      const textLower = userText.toLowerCase();
      let fallbackReply = "";

      if (textLower.includes("question") || textLower.includes("help") || textLower.includes("ask") || textLower.includes("which") || textLower.includes("what questions") || textLower.includes("explain")) {
        fallbackReply = `Here are the top questions you can ask me to explore my active profile insights:

1. **"What are your core strengths and skills?"** – Get an overview of my technology stack and domain competencies.
2. **"Tell me about your recent AI/ML projects."** – Understand my software system work and machine learning builds.
3. **"Where did you study? (Education)"** – Read details about Kongu Engineering College, GV Higher Secondary, and Reliance Matric School.
4. **"What certifications do you have?"** – View my valid credentials like the "Data Analytics Skill" from Oneroadmap.
5. **"What awards or prizes have you won?"** – Learn about my hackathon and engineering victory log.
6. **"How can I contact Naveen?"** – Obtain direct links, location details, and active communication networks.`;
      } else if (textLower.includes("strength") || textLower.includes("skill") || textLower.includes("tech") || textLower.includes("analy")) {
        const skillsList = portfolioData.skills.map(s => `• **${s.name}** (Category: ${s.category})`).join("\n");
        fallbackReply = `Naveen's core technical strengths span multiple critical blocks:

${skillsList}

He is exceptionally skilled in data analytics workflows, full-stack systems engineering, and machine learning pipelines.`;
      } else if (textLower.includes("ai") || textLower.includes("ml") || textLower.includes("machine learning") || textLower.includes("tensorflow") || textLower.includes("project")) {
        const projList = portfolioData.projects.map(p => `• **${p.title}**: ${p.description}\n  *Technologies:* ${p.tags.join(", ")}`).join("\n\n");
        fallbackReply = `Here are some of the key technical projects Naveen has engineered:

${projList}

His highlighted ML/AI experience includes embedding Computer Vision/OpenCV tools to review participant attentiveness in the Remote Education Stage project.`;
      } else if (textLower.includes("education") || textLower.includes("reliance") || textLower.includes("school") || textLower.includes("college") || textLower.includes("gv") || textLower.includes("kongu")) {
        const eduList = portfolioData.education.map(e => `• **${e.degree}**\n  *Institution:* ${e.institution}\n  *Timeline:* ${e.startDate} – ${e.endDate}\n  *Score:* ${e.score || "N/A"}`).join("\n\n");
        fallbackReply = `Naveen's education history is perfectly aligned with his technical profile:

${eduList}`;
      } else if (textLower.includes("certif") || textLower.includes("oneroadmap") || textLower.includes("roadmap") || textLower.includes("data analytics skill")) {
        const certList = portfolioData.certifications.map(c => `• **${c.name}** from *${c.issuer}* (${c.date})`).join("\n");
        fallbackReply = `Naveen holds several verified credentials, including:

${certList}

These specialized milestones underscore his background in professional data analytics and modern tools.`;
      } else if (textLower.includes("award") || textLower.includes("prize") || textLower.includes("victory") || textLower.includes("hackathon") || textLower.includes("prizes")) {
        fallbackReply = `Here is a summary of Naveen's high-impact victory log and trophies:

• **National Level Project Expo Winner**: Cash award of Rs. 10,000 at Hindustan College of Engineering, Chennai.
• **1st Place Hackathon Winner**: Outstanding execution award at SVEC.
• **Best Innovation Award**: Recognised for systems engineering at Sasurie College.
• **Smart India Hackathon (SIH) Internal Hack**: Secured 3rd place with team contribution.`;
      } else if (textLower.includes("contact") || textLower.includes("email") || textLower.includes("linkedin") || textLower.includes("phone")) {
        fallbackReply = `You can instantly contact Naveen or review his professional records:

• **Email**: ${portfolioData.personalInfo.email || "naveenkrishnamoorthi2004@gmail.com"}
• **Phone**: ${portfolioData.personalInfo.phone || "Not specified"}
• **Location**: ${portfolioData.personalInfo.location || "Tamil Nadu, India"}
• **LinkedIn**: ${portfolioData.personalInfo.linkedin || "#"}
• **GitHub**: ${portfolioData.personalInfo.github || "#"}`;
      } else {
        fallbackReply = `Naveen's interactive copilot here! 

Based on my portfolio metrics:
• **Professional Objective**: ${portfolioData.personalInfo.about}
• **Primary Study**: ${portfolioData.education[0]?.degree} at ${portfolioData.education[0]?.institution}

You can ask me questions about his:
1. **Strengths and Skills**
2. **Key Projects & Hackathon Victory Log**
3. **Education details (GV, Kongu, Reliance)**
4. **Certifications (including Oneroadmap Data Analytics Skill)**
5. **Contact and LinkedIn coordinates**`;
      }

      setErrorLocal("The AI service is temporarily in client-only fallback mode. To enable direct Gemini dynamic chat, configure a valid GEMINI_API_KEY in the Secrets menu.");
      setMessages([...newMessages, { 
        role: 'assistant', 
        content: fallbackReply 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="chat-ai-module" className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 font-sans">
      
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          id="chat-toggle-floating-btn"
          onClick={() => setIsOpen(true)}
          className={`group flex items-center space-x-2 p-3 sm:p-4 shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 ${
            activeTheme === 'bold'
              ? 'bg-[#ff4e00] text-black border border-[#ff4e00] font-sans font-black uppercase rounded-none'
              : activeTheme === 'minimalist'
                ? 'bg-slate-900 text-white hover:bg-slate-800 rounded-full'
                : activeTheme === 'terminal'
                  ? 'bg-green-500 text-black border border-green-500 font-mono shadow-green-500/20 rounded-full'
                  : activeTheme === 'cyberpunk'
                    ? 'bg-pink-500 text-black border border-pink-500 hover:bg-pink-400 shadow-pink-500/30 rounded-full'
                    : activeTheme === 'nordic'
                      ? 'bg-sky-500 text-[#050b14] font-bold hover:bg-sky-450 rounded-full shadow-sky-500/10'
                      : activeTheme === 'sunset'
                        ? 'bg-[#e36940] text-amber-100 hover:bg-[#d05020] rounded-none font-bold tracking-wider uppercase'
                        : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-purple-500/20 rounded-full'
          }`}
          title="Ask AI Assistant"
        >
          <Bot className="w-6 h-6 text-current animate-pulse group-hover:scale-110 transition-transform" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 text-xs font-bold uppercase tracking-wider font-mono shrink-0">
            Ask AI Agent
          </span>
        </button>
      )}

      {/* Expandable Chat Widget */}
      {isOpen && (
        <div 
          id="chat-floating-panel"
          className={`w-[calc(100vw-2rem)] sm:w-[380px] h-[480px] shadow-2xl border flex flex-col overflow-hidden transition-all duration-300 ${
            activeTheme === 'bold'
              ? 'bg-[#0a0a0a] border-white/10 rounded-none'
              : activeTheme === 'minimalist'
                ? 'bg-slate-900 border-slate-800/10 rounded-2xl'
                : activeTheme === 'terminal'
                  ? 'bg-slate-950 border-green-500/40 rounded-2xl'
                  : activeTheme === 'cyberpunk'
                    ? 'bg-slate-900 border-pink-500/30 rounded-2xl'
                    : activeTheme === 'nordic'
                      ? 'bg-[#0b1625] border-sky-900/40 rounded-2xl'
                      : activeTheme === 'sunset'
                        ? 'bg-[#1c0e0b] border-[#e36940]/30 rounded-none'
                        : 'bg-slate-900 border-purple-500/20 rounded-2xl'
          }`}
        >
          {/* Header */}
          <div className={`p-4 flex items-center justify-between border-b ${
            activeTheme === 'bold' 
              ? 'border-white/10 bg-[#060606]' 
              : activeTheme === 'nordic'
                ? 'border-sky-905 bg-[#09111c]'
                : activeTheme === 'sunset'
                  ? 'border-[#e36940]/25 bg-[#140b09]'
                  : 'border-slate-800 bg-slate-950'
          }`}>
            <div className="flex items-center space-x-2.5">
              <div className={`p-1.5 ${
                activeTheme === 'bold' 
                  ? 'bg-[#ff4e00]/10 text-[#ff4e00] rounded-none' 
                  : activeTheme === 'nordic'
                    ? 'bg-sky-500/10 text-sky-400 rounded-lg'
                    : activeTheme === 'sunset'
                      ? 'bg-[#e36940]/10 text-[#e36940] rounded-none'
                      : 'bg-purple-500/10 text-purple-400 rounded-lg'
              }`}>
                <Bot className={`w-5 h-5 ${
                  activeTheme === 'bold' 
                    ? 'text-[#ff4e00]' 
                    : activeTheme === 'nordic'
                      ? 'text-sky-400'
                      : activeTheme === 'sunset'
                        ? 'text-[#e36940]'
                        : 'text-purple-400'
                }`} />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1 font-mono">
                  <span>Ground AI Chat</span>
                  <Sparkles className={`w-3 h-3 animate-spin-slow ${
                    activeTheme === 'bold' 
                      ? 'text-[#ff4e00]' 
                      : activeTheme === 'nordic'
                        ? 'text-sky-400'
                        : activeTheme === 'sunset'
                          ? 'text-[#e36940]'
                          : 'text-purple-400'
                  }`} />
                </h4>
                <p className="text-[10px] text-slate-500">{portfolioData.personalInfo.name}'s Interactive Copilot</p>
              </div>
            </div>
            
            <button
              id="close-chat-floating-btn"
              onClick={() => setIsOpen(false)}
              className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Message List area */}
          <div className="flex-grow overflow-y-auto p-4 space-y-3 bg-slate-950/80 custom-scroll relative">
            
            {/* Disclaimer box if missing key */}
            {errorLocal && (
              <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-[10px] text-red-300 flex items-start gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                <span>AI API Connection error. Make sure your GEMINI_API_KEY is configured.</span>
              </div>
            )}

            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`p-3 text-xs leading-relaxed max-w-[85%] ${
                  msg.role === 'user'
                    ? activeTheme === 'bold'
                      ? 'bg-[#ff4e00] text-black font-semibold rounded-none'
                      : activeTheme === 'minimalist'
                        ? 'bg-slate-800 text-white rounded-xl'
                        : activeTheme === 'terminal'
                          ? 'bg-green-500/15 border border-green-500 text-green-400 font-mono rounded-xl'
                          : activeTheme === 'cyberpunk'
                            ? 'bg-pink-500/15 border border-pink-500 text-pink-300 rounded-xl'
                            : activeTheme === 'nordic'
                              ? 'bg-sky-500 text-slate-950 font-bold rounded-xl shadow-md'
                              : activeTheme === 'sunset'
                                ? 'bg-[#e36940] text-amber-100 font-bold rounded-none'
                                : 'bg-purple-600 text-white rounded-xl'
                    : activeTheme === 'bold'
                      ? 'bg-white/[0.03] border border-white/10 text-slate-200 rounded-none'
                      : activeTheme === 'nordic'
                        ? 'bg-sky-950/60 border border-sky-900/30 text-slate-200 rounded-xl'
                        : activeTheme === 'sunset'
                          ? 'bg-[#150b09] border border-[#e36940]/15 text-amber-100 rounded-none font-mono'
                          : 'bg-slate-800 text-slate-200 border border-slate-700/50 rounded-xl'
                }`}>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className={`p-3 flex items-center space-x-1.5 shrink-0 ${
                  activeTheme === 'bold'
                    ? 'bg-white/[0.03] border border-white/10 rounded-none'
                    : activeTheme === 'nordic'
                      ? 'bg-sky-950/60 border border-sky-900/30 text-slate-200 rounded-xl'
                      : activeTheme === 'sunset'
                        ? 'bg-[#150b09] border border-[#e36940]/15 text-amber-100 rounded-none'
                        : 'bg-slate-800 border border-slate-700/50 rounded-xl'
                }`}>
                  <div className={`w-1.5 h-1.5 rounded-full animate-bounce ${
                    activeTheme === 'bold' 
                      ? 'bg-[#ff4e00]' 
                      : activeTheme === 'nordic'
                        ? 'bg-sky-400'
                        : activeTheme === 'sunset'
                          ? 'bg-[#e36940]'
                          : 'bg-purple-400'
                  }`} />
                  <div className={`w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:0.2s] ${
                    activeTheme === 'bold' 
                      ? 'bg-[#ff4e00]' 
                      : activeTheme === 'nordic'
                        ? 'bg-sky-400'
                        : activeTheme === 'sunset'
                          ? 'bg-[#e36940]'
                          : 'bg-purple-400'
                  }`} />
                  <div className={`w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:0.4s] ${
                    activeTheme === 'bold' 
                      ? 'bg-[#ff4e00]' 
                      : activeTheme === 'nordic'
                        ? 'bg-sky-400'
                        : activeTheme === 'sunset'
                          ? 'bg-[#e36940]'
                          : 'bg-purple-400'
                  }`} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick suggestions if chat is fresh */}
          {messages.length === 1 && (
            <div id="quick-suggestions-block" className={`p-2 border-t flex flex-wrap gap-1 ${
              activeTheme === 'bold' 
                ? 'border-white/10 bg-[#0c0c0c]' 
                : activeTheme === 'nordic'
                  ? 'border-sky-900/30 bg-[#09111c]'
                  : activeTheme === 'sunset'
                    ? 'border-[#e36940]/20 bg-[#140b09]'
                    : 'border-slate-800/50 bg-slate-900'
            }`}>
              {suggestions.map((option, i) => (
                <button
                  key={i}
                  id={`suggestion-btn-${i}`}
                  onClick={() => handleSendMessage(option)}
                  className={`text-[9px] text-left shrink-0 transition-all font-mono py-1 px-2 border ${
                    activeTheme === 'bold'
                      ? 'bg-white/[0.02] border-white/10 text-slate-400 hover:border-[#ff4e00]/50 hover:text-[#ff4e00] rounded-none'
                      : activeTheme === 'nordic'
                        ? 'bg-sky-950 border border-sky-900/40 text-sky-400 hover:border-sky-500 hover:text-sky-300 rounded-lg'
                        : activeTheme === 'sunset'
                          ? 'bg-[#140b09] border-[#e36940]/25 text-[#fca5a5] hover:border-[#e36940] hover:text-[#e36940] rounded-none'
                          : 'bg-slate-950 text-slate-400 hover:bg-slate-850 hover:text-white rounded border-slate-800'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          {/* Input Box Form */}
          <form
            id="chat-input-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(input);
            }}
            className={`p-3 border-t flex items-center space-x-2 ${
              activeTheme === 'bold' 
                ? 'border-white/10 bg-[#0c0c0c]' 
                : activeTheme === 'nordic'
                  ? 'border-sky-900/30 bg-[#09111c]'
                  : activeTheme === 'sunset'
                    ? 'border-[#e36940]/15 bg-[#140b09]'
                    : 'border-slate-800 bg-slate-900'
            }`}
          >
            <input
              id="raw-chat-input-field"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Ask me anything about ${portfolioData.personalInfo.name.split(' ')[0]}...`}
              disabled={loading}
              className={`flex-grow p-2 pl-3 text-white text-xs leading-relaxed focus:outline-none transition-all ${
                activeTheme === 'bold'
                  ? 'bg-white/[0.02] border border-white/10 focus:border-[#ff4e00] focus:ring-1 focus:ring-[#ff4e00]/15 rounded-none'
                  : activeTheme === 'nordic'
                    ? 'bg-sky-950 border border-sky-900/40 focus:border-sky-500/60 focus:ring-1 focus:ring-sky-500/20 rounded-xl text-slate-200'
                    : activeTheme === 'sunset'
                      ? 'bg-[#1c0e0b] border border-[#e36940]/20 focus:border-[#e36940] focus:ring-1 focus:ring-[#e36940]/20 rounded-none font-mono text-amber-100'
                      : 'bg-slate-950 border border-slate-800 focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/20 rounded-xl'
              }`}
            />
            <button
              id="chat-send-submit-btn"
              type="submit"
              disabled={loading || input.trim().length === 0}
              className={`p-2 transition-all shadow shrink-0 ${
                activeTheme === 'bold'
                  ? 'bg-[#ff4e00] text-black hover:bg-[#ff4e00]/90 disabled:opacity-30 rounded-none font-bold'
                  : activeTheme === 'nordic'
                    ? 'bg-sky-500 text-slate-950 hover:bg-sky-400 disabled:opacity-40 rounded-xl'
                    : activeTheme === 'sunset'
                      ? 'bg-[#e36940] text-amber-100 hover:bg-[#e36940]/90 disabled:opacity-40 rounded-none font-bold'
                      : 'bg-purple-600 hover:bg-purple-500 text-white disabled:opacity-40 rounded-xl'
              }`}
              title="Send"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

    </div>
  );
}
