'use client';

import { useEffect, useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Add global styles for animations
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    .animate-fadeIn {
      animation: fadeIn 0.3s ease-out;
    }
  `;
  if (!document.head.querySelector('style[data-chat-animations]')) {
    style.setAttribute('data-chat-animations', 'true');
    document.head.appendChild(style);
  }
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  isStreaming?: boolean;
}

// Suggested questions
const SUGGESTED_QUESTIONS = [
  "My A/R is through the roof — what are the most common causes?",
  "Why are my denials increasing — and what should I look at first?",
  "I think we're getting underpaid by payers — how do I know?",
  "Collections are flat but volume is up — where does revenue usually leak?",
  "Patient payments are getting harder — how do we improve patient pay without upsetting patients?",
  "What KPIs should I track weekly to know if my billing is healthy?",
  "I feel like we're losing money — but I can't tell how much or why. Where do practices typically leak revenue?"
];

export default function ChatEmbed() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const streamingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  // Auto-scroll to bottom when messages change (only if user hasn't scrolled away)
  useEffect(() => {
    if (isExpanded && shouldAutoScroll) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isExpanded, shouldAutoScroll]);

  // Detect when user scrolls away from bottom
  const handleScroll = () => {
    if (!messagesContainerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 50; // 50px threshold
    
    setShouldAutoScroll(isAtBottom);
  };

  // Re-enable auto-scroll when new message starts
  useEffect(() => {
    if (loading) {
      setShouldAutoScroll(true);
    }
  }, [loading]);

  // Cleanup streaming timeout on unmount
  useEffect(() => {
    return () => {
      if (streamingTimeoutRef.current) {
        clearTimeout(streamingTimeoutRef.current);
      }
    };
  }, []);

  // Stream text character by character
  const streamMessage = (fullText: string, messageId: string) => {
    let currentIndex = 0;
    const streamSpeed = 20; // milliseconds per character

    const streamNextChunk = () => {
      if (currentIndex < fullText.length) {
        const chunkSize = Math.floor(Math.random() * 3) + 1; // 1-3 characters at a time for natural feel
        const nextIndex = Math.min(currentIndex + chunkSize, fullText.length);
        const textChunk = fullText.slice(0, nextIndex);
        
        setMessages(prev => 
          prev.map(msg => 
            msg.id === messageId 
              ? { ...msg, text: textChunk, isStreaming: nextIndex < fullText.length }
              : msg
          )
        );
        
        currentIndex = nextIndex;
        streamingTimeoutRef.current = setTimeout(streamNextChunk, streamSpeed);
      } else {
        // Streaming complete
        setMessages(prev => 
          prev.map(msg => 
            msg.id === messageId 
              ? { ...msg, isStreaming: false }
              : msg
          )
        );
      }
    };

    streamNextChunk();
  };

  const handleSend = async (messageText?: string) => {
    const messageToSend = (messageText || inputValue).trim();
    if (!messageToSend) return;

    // Expand to chat view
    setIsExpanded(true);

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
        const fullResponse = msgData.content || msgData.response || 'No response received';
        const messageId = (Date.now() + 1).toString();
        
        // Add empty message first
        const assistantMessage: Message = {
          id: messageId,
          text: '',
          sender: 'assistant',
          timestamp: new Date(),
          isStreaming: true
        };
        setMessages(prev => [...prev, assistantMessage]);
        
        // Start streaming the response
        streamMessage(fullResponse, messageId);
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
        const fullResponse = msgData.content || msgData.response || 'No response received';
        const messageId = (Date.now() + 1).toString();
        
        // Add empty message first
        const assistantMessage: Message = {
          id: messageId,
          text: '',
          sender: 'assistant',
          timestamp: new Date(),
          isStreaming: true
        };
        setMessages(prev => [...prev, assistantMessage]);
        
        // Start streaming the response
        streamMessage(fullResponse, messageId);
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

  const handleQuestionClick = (question: string) => {
    handleSend(question);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend();
  };

  // Initial state - search bar with suggested questions
  if (!isExpanded) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 md:p-8">
        <div className="w-full max-w-3xl">
          {/* Oval Search Bar */}
          <form onSubmit={handleSubmit} className="mb-6">
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask me anything about Cosentus..."
                className="w-full px-4 md:px-6 py-3 md:py-4 text-sm md:text-base text-gray-900 bg-white border border-gray-300 rounded-full focus:outline-none focus:border-gray-400 transition-colors shadow-sm"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || loading}
                className={`absolute right-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black text-white transition-all ${inputValue.trim() && !loading ? 'opacity-100 hover:bg-gray-800 hover:scale-105' : 'opacity-40 cursor-not-allowed'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
                </svg>
              </button>
            </div>
          </form>

          {/* Suggested Questions - with fade animation */}
          <div className="space-y-2 md:space-y-3 transition-opacity duration-500 ease-out">
            {SUGGESTED_QUESTIONS.map((question, index) => (
              <button
                key={index}
                onClick={() => handleQuestionClick(question)}
                className="w-full px-4 md:px-5 py-3 md:py-4 text-left text-xs md:text-sm text-gray-700 bg-white border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Expanded state - chat widget (responsive height, same width as search bar)
  return (
    <div className="flex items-center justify-center min-h-screen p-4 md:p-8">
      <div className="w-full max-w-3xl animate-fadeIn">
        {/* Chat Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-[80vh] md:h-[70vh]">
          {/* Messages Area */}
          <div className="h-full flex flex-col">
            <div 
              ref={messagesContainerRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto px-4 md:px-6 py-3 md:py-4 space-y-3 md:space-y-4"
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[90%] md:max-w-[85%] rounded-2xl px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base ${
                      msg.sender === 'user'
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    {msg.sender === 'assistant' ? (
                      <div className="prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-900 prose-strong:text-gray-900 prose-li:text-gray-900">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {msg.text}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p className="text-sm">{msg.text}</p>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-2xl px-4 py-2.5">
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

            {/* Input Area - at bottom of card */}
            <div className="bg-white px-4 md:px-6 py-3 md:py-4">
              <form onSubmit={handleSubmit} className="relative mb-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask a follow-up question..."
                  className="w-full pl-4 md:pl-6 pr-12 md:pr-14 py-2.5 md:py-3 text-xs md:text-sm text-gray-900 bg-white border border-gray-300 rounded-full focus:outline-none focus:border-gray-400 transition-colors"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !inputValue.trim()}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black text-white transition-all ${inputValue.trim() && !loading ? 'opacity-100 hover:bg-gray-800 hover:scale-105' : 'opacity-40 cursor-not-allowed'}`}
                >
                  {loading ? (
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
                    </svg>
                  )}
                </button>
              </form>
              
              {/* Disclaimer */}
              <p className="text-[10px] md:text-xs text-gray-400 text-center">
                Powered by Cosentus AI - Responses are informational only
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
