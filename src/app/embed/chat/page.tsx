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
      <div className="flex items-center justify-center min-h-screen p-8">
        <div className="w-full max-w-3xl">
          {/* Oval Search Bar */}
          <form onSubmit={handleSubmit} className="mb-2">
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask me anything about Cosentus..."
                className="w-full px-6 py-4 text-base text-gray-900 bg-white border border-gray-300 rounded-full focus:outline-none focus:border-gray-400 transition-colors shadow-sm"
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
              </button>
            </div>
          </form>

          {/* Disclaimer */}
          <p className="text-xs text-gray-400 text-center mb-6">
            Powered by Cosentus AI - Responses are informational only
          </p>

          {/* Suggested Questions - with fade animation */}
          <div className="space-y-3 transition-opacity duration-500 ease-out">
            {SUGGESTED_QUESTIONS.map((question, index) => (
              <button
                key={index}
                onClick={() => handleQuestionClick(question)}
                className="w-full px-5 py-4 text-left text-sm text-gray-700 bg-white border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Expanded state - chat widget (50vh, same width as search bar)
  return (
    <div className="flex items-center justify-center min-h-screen p-8">
      <div className="w-full max-w-3xl animate-fadeIn">
        {/* Chat Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden" style={{ height: '70vh' }}>
          {/* Messages Area */}
          <div className="h-full flex flex-col">
            <div 
              ref={messagesContainerRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto px-6 py-4 space-y-4"
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
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
            <div className="bg-white px-6 py-4">
              <form onSubmit={handleSubmit} className="relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask a follow-up question..."
                  className="w-full px-6 py-3 text-sm text-gray-900 bg-white border border-gray-300 rounded-full focus:outline-none focus:border-gray-400 transition-colors"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !inputValue.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
