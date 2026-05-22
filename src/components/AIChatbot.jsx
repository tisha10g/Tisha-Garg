import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, RefreshCw, Sparkles, User, Smile } from 'lucide-react';

export default function AIChatbot({ lang }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'model', content: lang === 'en' ? "Pranam! I am Kusum, your Royal Styling & Design assistant. Tell me about your face shape or outfit, and let me find your perfect bindi match." : "प्रणाम! मैं कुसुम हूं, आपकी शाही एआई स्टाइलिंग सहायक। मुझे अपने चेहरे के आकार या पोशाक के बारे में बताएं।" }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputVal.trim() || isSending) return;

    const userMsg = inputVal.trim();
    setInputVal('');
    
    // Add user message locally
    const updatedMessages = [...messages, { role: 'user', content: userMsg }];
    setMessages(updatedMessages);
    setIsSending(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages })
      });
      const data = await response.json();
      if (data.response) {
        setMessages([...updatedMessages, { role: 'model', content: data.response }]);
      }
    } catch (err) {
      console.error(err);
      // Fallback
      setMessages([...updatedMessages, { role: 'model', content: "Namaste! My server is resting. Standard delivery takes 3-5 days across India and our classic Kundan bindis match round face shapes incredibly well." }]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div id="ai_floating_chatbot" className="fixed bottom-6 right-6 z-50">
      
      {/* Floating Trigger button */}
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 p-4 rounded-full bg-gradient-to-r from-[#811e2a] to-[#5c141d] text-[#ebdcb9] border border-[#bc8f42] hover:border-white shadow-[0_4px_25px_rgba(129,30,42,0.6)] cursor-pointer hover:scale-105 duration-300 transition-all"
        >
          <MessageSquare size={20} className="animate-pulse" />
          <span className="text-xs uppercase tracking-wider font-extrabold font-serif">Kusum Styling AI</span>
        </button>
      ) : (
        /* The Chat window box */
        <div className="w-80 md:w-96 bg-[#160f11] border-2 border-[#bc8f42]/40 rounded-2xl p-4 shadow-2xl flex flex-col justify-between h-[450px] relative animate-in slide-in-from-bottom-5">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#5c141d]/30 pb-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-full bg-[#5c141d]/20 text-[#bc8f42]">
                <Sparkles size={14} className="animate-spin" />
              </span>
              <div>
                <span className="font-serif font-bold text-xs text-white block">Kusum Royal Assistant</span>
                <span className="text-[9px] text-emerald-400 font-mono flex items-center gap-1">• Live Gemini active</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-gray-400 hover:text-white transition cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          {/* Messages lists container */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-3 pr-1 pb-2">
            {messages.map((m, idx) => {
              const isCust = m.role === 'user';
              return (
                <div key={idx} className={`flex gap-2 text-xs leading-relaxed ${isCust ? 'justify-end' : 'justify-start'}`}>
                  {!isCust && (
                    <div className="h-6 w-6 rounded-full bg-[#5c141d] border border-[#bc8f42]/50 flex items-center justify-center shrink-0">
                      <span className="text-[10px]">👑</span>
                    </div>
                  )}
                  <div className={`p-2.5 rounded-2xl max-w-[75%] ${
                    isCust 
                      ? 'bg-[#5c141d] text-white rounded-tr-none' 
                      : 'bg-[#0b0708] border border-[#5c141d]/20 text-[#ebdcb9] rounded-tl-none'
                  }`}>
                    {m.content}
                  </div>
                </div>
              );
            })}
            {isSending && (
              <div className="flex gap-2 justify-start items-center text-[10px] text-gray-500 font-mono">
                <RefreshCw size={10} className="animate-spin" />
                <span>Kusum is typing advice...</span>
              </div>
            )}
          </div>

          {/* Form input field sender */}
          <form onSubmit={handleSendMessage} className="flex gap-2 pt-2 border-t border-[#5c141d]/25">
            <input
              type="text"
              required
              placeholder={lang === 'en' ? "Ask about custom matches..." : "बिंदी के बारे में पूछें..."}
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="flex-1 bg-[#0b0708] border border-[#5c141d]/30 text-xs rounded-xl p-2.5 text-white focus:outline-none focus:border-[#bc8f42]"
            />
            <button
              type="submit"
              disabled={isSending || !inputVal.trim()}
              className="p-2.5 bg-[#bc8f42] hover:bg-[#9c7130] text-black rounded-xl disabled:opacity-50 transition shrink-0 cursor-pointer"
            >
              <Send size={14} />
            </button>
          </form>

        </div>
      )}

    </div>
  );
}
