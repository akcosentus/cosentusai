'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

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
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
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
  if (!document.head.querySelector('style[data-chat-v2-animations]')) {
    style.setAttribute('data-chat-v2-animations', 'true');
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
  "How much revenue is my practice missing today?",
  "What's causing delays, denials, or write-offs in my revenue cycle?",
  "How can Cosentus improve collections without adding staff or risk?",
  "My A/R is through the roof — what are the most common causes?",
  "Why are my denials increasing — and what should I look at first?",
  "I think we're getting underpaid by payers — how do I know?",
  "How can we improve patient payments without upsetting patients?",
  "Our clean claim rate is dropping — what's causing it, and how do we fix it fast?"
];

export default function ChatEmbedV2() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  // Store active streaming sessions by messageId to prevent conflicts
  const streamingSessionsRef = useRef<Map<string, {
    fullText: string;
    currentIndex: number;
    animationFrameId: number | null;
    lastUpdateTime: number;
    isPaused: boolean;
  }>>(new Map());
  const streamSpeed = 22; // milliseconds per character

  // Cleanup all streaming sessions on unmount
  useEffect(() => {
    return () => {
      streamingSessionsRef.current.forEach((session) => {
        if (session.animationFrameId !== null) {
          cancelAnimationFrame(session.animationFrameId);
        }
      });
      streamingSessionsRef.current.clear();
    };
  }, []);

  // Resume streaming for a specific message
  const resumeStreaming = useCallback((messageId: string) => {
    const session = streamingSessionsRef.current.get(messageId);
    if (!session || session.currentIndex >= session.fullText.length) {
      return;
    }

    const streamNextChunk = (currentTime: number) => {
      const session = streamingSessionsRef.current.get(messageId);
      if (!session) return;

      // Check if tab is hidden - pause streaming
      if (document.hidden) {
        session.isPaused = true;
        session.animationFrameId = null;
        return;
      }

      // Calculate elapsed time since last update
      const elapsed = currentTime - session.lastUpdateTime;
      
      // Only update if enough time has passed (throttle to streamSpeed)
      if (elapsed >= streamSpeed) {
        if (session.currentIndex < session.fullText.length) {
          const chunkSize = Math.floor(Math.random() * 3) + 1; // 1-3 characters at a time
          const nextIndex = Math.min(session.currentIndex + chunkSize, session.fullText.length);
          const textChunk = session.fullText.slice(0, nextIndex);
          
          setMessages(prev => 
            prev.map(msg => 
              msg.id === messageId 
                ? { ...msg, text: textChunk, isStreaming: nextIndex < session.fullText.length }
                : msg
            )
          );
          
          session.currentIndex = nextIndex;
          session.lastUpdateTime = currentTime;

          // Check if streaming is complete
          if (nextIndex >= session.fullText.length) {
            setMessages(prev => 
              prev.map(msg => 
                msg.id === messageId 
                  ? { ...msg, isStreaming: false }
                  : msg
              )
            );
            streamingSessionsRef.current.delete(messageId);
            return;
          }
        }
      }

      // Continue streaming using requestAnimationFrame (more reliable than setTimeout)
      session.animationFrameId = requestAnimationFrame(streamNextChunk);
    };

    session.animationFrameId = requestAnimationFrame(streamNextChunk);
  }, [streamSpeed]);

  // Handle Page Visibility API - resume streaming when tab becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Tab became visible - resume all paused streams
        streamingSessionsRef.current.forEach((session, messageId) => {
          if (session.isPaused && session.currentIndex < session.fullText.length) {
            session.isPaused = false;
            session.lastUpdateTime = performance.now();
            resumeStreaming(messageId);
          }
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [resumeStreaming]);

  // Stream text character by character with bulletproof implementation
  const streamMessage = (fullText: string, messageId: string) => {
    // Cancel any existing stream for this message
    const existingSession = streamingSessionsRef.current.get(messageId);
    if (existingSession && existingSession.animationFrameId !== null) {
      cancelAnimationFrame(existingSession.animationFrameId);
    }

    // Create new streaming session
    const session = {
      fullText,
      currentIndex: 0,
      animationFrameId: null as number | null,
      lastUpdateTime: performance.now(),
      isPaused: false,
    };
    streamingSessionsRef.current.set(messageId, session);

    // Start streaming
    resumeStreaming(messageId);
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
        <div className="w-full max-w-4xl relative">
          {/* Oval Search Bar */}
          <form onSubmit={handleSubmit} className="mb-6">
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Ask me anything..."
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

          {/* Suggested Questions - 4x2 grid with glassy effect, show when focused */}
          {isFocused && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4">
              {SUGGESTED_QUESTIONS.map((question, index) => (
                <button
                  key={index}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleQuestionClick(question);
                  }}
                  style={{
                    animation: `fadeInUp 0.5s ease-out ${index * 0.05}s both`,
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                  }}
                  className="px-4 py-4 text-left text-xs md:text-sm text-gray-900 bg-white/70 border border-white/90 rounded-xl hover:bg-white/90 hover:border-white hover:shadow-lg transition-all duration-300 backdrop-blur-md"
                >
                  {question}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Expanded state - chat widget (responsive height, same width as search bar)
  return (
    <div className="flex items-center justify-center min-h-screen p-4 md:p-8">
      <div className="w-full max-w-4xl animate-fadeIn relative">
        {/* Chat Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-[90vh] md:h-[78vh]">
          {/* Messages Area */}
          <div className="h-full flex flex-col">
            <div 
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
                        ? 'bg-black/70 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    {msg.sender === 'assistant' ? (
                      <div className="prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-900 prose-strong:text-gray-900 prose-li:text-gray-900 prose-a:text-blue-600 prose-a:underline hover:prose-a:text-blue-800">
                        <ReactMarkdown 
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeRaw]}
                        >
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
            </div>

            {/* Input Area - at bottom of card */}
            <div className="bg-white px-4 md:px-6 py-3 md:py-4">
              <form onSubmit={handleSubmit} className="relative mb-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask me anything..."
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
