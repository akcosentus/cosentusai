'use client';

import { useEffect, useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

export default function ChatEmbed() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get URL parameters for customization
  const [customColor, setCustomColor] = useState('#01B2D6');
  const [theme, setTheme] = useState('light');
  const [placeholder, setPlaceholder] = useState('Ask me anything about Cosentus...');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('color')) {
        setCustomColor('#' + params.get('color'));
      }
      if (params.get('theme')) {
        setTheme(params.get('theme') || 'light');
      }
      if (params.get('placeholder')) {
        setPlaceholder(params.get('placeholder') || 'Ask me anything about Cosentus...');
      }
    }
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const messageToSend = inputValue.trim();
    if (!messageToSend) return;

    // Add user message to UI
    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageToSend,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setLoading(true);
    setError(null);

    try {
      // Initialize chat if needed
      if (!chatId) {
        const initResp = await fetch('/api/assist-chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({})
        });

        if (!initResp.ok) {
          throw new Error('Failed to initialize chat');
        }

        const initData = await initResp.json();
        setChatId(initData.chatId);

        // Send first message
        const msgResp = await fetch('/api/chat/send-message', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chatId: initData.chatId,
            message: messageToSend
          })
        });

        if (!msgResp.ok) {
          throw new Error('Failed to send message');
        }

        const msgData = await msgResp.json();
        
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: msgData.response,
          sender: 'assistant',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        // Send message to existing chat
        const msgResp = await fetch('/api/chat/send-message', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chatId: chatId,
            message: messageToSend
          })
        });

        if (!msgResp.ok) {
          throw new Error('Failed to send message');
        }

        const msgData = await msgResp.json();
        
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: msgData.response,
          sender: 'assistant',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (err) {
      console.error('Chat error:', err);
      setError(err instanceof Error ? err.message : 'Failed to send message');
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const bgColor = theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50';
  const cardBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const inputBg = theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100';
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const subtextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';

  return (
    <div className={`flex flex-col h-screen ${bgColor}`}>
      {/* Header */}
      <div className={`${cardBg} border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} p-4`}>
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
            style={{ backgroundColor: customColor }}
          >
            AI
          </div>
          <div>
            <h1 className={`font-semibold ${textColor}`}>Cosentus AI Assistant</h1>
            <p className={`text-sm ${subtextColor}`}>Ask me anything</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <div 
              className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold"
              style={{ backgroundColor: customColor }}
            >
              AI
            </div>
            <h2 className={`text-xl font-semibold ${textColor} mb-2`}>
              Hi! I&apos;m the Cosentus AI Assistant
            </h2>
            <p className={`${subtextColor}`}>
              Ask me anything about Cosentus services, pricing, or how we can help your practice.
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                msg.sender === 'user'
                  ? 'text-white text-right'
                  : `${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'} text-left`
              }`}
              style={msg.sender === 'user' ? { backgroundColor: customColor } : {}}
            >
              {msg.sender === 'assistant' ? (
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.text}
                  </ReactMarkdown>
                </div>
              ) : (
                <p>{msg.text}</p>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} rounded-2xl px-4 py-3`}>
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="text-center">
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className={`${cardBg} border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} p-4`}>
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={placeholder}
            className={`flex-1 ${inputBg} ${textColor} rounded-full px-4 py-3 focus:outline-none focus:ring-2 transition-all`}
            style={{ '--tw-ring-color': customColor } as React.CSSProperties}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !inputValue.trim()}
            className="w-12 h-12 rounded-full text-white flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
            style={{ backgroundColor: customColor }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </button>
        </form>
        
        {/* Powered By */}
        <div className="mt-2 text-center">
          <p className={`text-xs ${subtextColor}`}>
            Powered by <span className="font-semibold">Cosentus AI</span>
          </p>
        </div>
      </div>
    </div>
  );
}
