import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Sparkles, Loader2, User } from 'lucide-react';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';

export default function AIChatWidget() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am your Lanka Trails Smart Guide. How can I help you plan your trip today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { role: 'user', content: input };
    const newMessages = [...messages, userMsg];
    
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      
      const response = await axios.post('https://travel-api-srilanka-e6azatbsh0cna2bg.southeastasia-01.azurewebsites.net/api/chat', {
        prompt: userMsg.content,
        
        history: newMessages.slice(1, -1) 
      });

      setMessages([...newMessages, { role: 'assistant', content: response.data.reply }]);
    } catch (error) {
      setMessages([...newMessages, { role: 'assistant', content: 'Sorry, I am having trouble connecting to the server right now. 😢' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end animate-fade-in">
      
      {/* ── Chat Window ── */}
      {isOpen && (
        <div className="bg-[#0B0F19]/95 backdrop-blur-xl border border-white/10 rounded-2xl w-[350px] sm:w-[400px] h-[500px] shadow-[0_10px_40px_rgba(0,0,0,0.5)] flex flex-col mb-4 overflow-hidden transform transition-all duration-300 origin-bottom-right">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-lanka-600/20 to-ocean-600/20 border-b border-white/5 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-lanka-500/20 border border-lanka-500/40 flex items-center justify-center">
                <Bot size={18} className="text-lanka-400" />
              </div>
              <div>
                <h3 className="text-white font-display font-semibold text-sm">Lanka Trails AI</h3>
                <p className="text-green-400 text-[10px] uppercase tracking-wider font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Online
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white bg-white/5 hover:bg-white/10 p-1.5 rounded-lg transition-colors">
              <X size={18} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-ocean-500/20 text-ocean-300' : 'bg-lanka-500/20 text-lanka-300'}`}>
                  {msg.role === 'user' ? <User size={14} /> : <Sparkles size={14} />}
                </div>
                
                {/* Message Bubble */}
                <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                  msg.role === 'user' 
                    ? 'bg-ocean-600/30 text-white rounded-tr-sm border border-ocean-500/20' 
                    : 'bg-white/5 text-white/80 rounded-tl-sm border border-white/5'
                }`}>
                  
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                </div>
              </div>
            ))}
            
            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex gap-3 flex-row">
                <div className="w-7 h-7 rounded-full bg-lanka-500/20 text-lanka-300 flex items-center justify-center shrink-0">
                  <Bot size={14} />
                </div>
                <div className="bg-white/5 border border-white/5 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce delay-100"></span>
                  <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce delay-200"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-3 border-t border-white/5 bg-black/20">
            <div className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about places, weather, or trains..."
                className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl pl-4 pr-12 py-3 focus:outline-none focus:border-lanka-500/50 transition-colors placeholder:text-white/30"
                disabled={isLoading}
              />
              <button 
                type="submit" 
                disabled={!input.trim() || isLoading}
                className="absolute right-2 w-8 h-8 flex items-center justify-center rounded-lg bg-lanka-500 hover:bg-lanka-400 text-white disabled:opacity-50 disabled:hover:bg-lanka-500 transition-colors"
              >
                {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} className="ml-0.5" />}
              </button>
            </div>
          </form>

        </div>
      )}

      {/* ── Floating Action Button (FAB) ── */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center justify-center w-14 h-14 bg-gradient-to-br from-lanka-500 to-ocean-500 rounded-full shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:shadow-[0_0_30px_rgba(245,158,11,0.6)] hover:scale-105 transition-all duration-300"
        >
          <Sparkles className="text-white absolute top-3 right-3 w-3 h-3 animate-pulse" />
          <MessageSquare className="text-white w-6 h-6" />
          
          {/* Tooltip */}
          <span className="absolute -left-32 bg-black/80 backdrop-blur-md text-white text-xs font-medium px-3 py-1.5 rounded-lg border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Ask AI Guide
          </span>
        </button>
      )}
    </div>
  );
}