'use client';

import { PolkaDotBackground } from '@/components/PolkaDotBackground';
import { useRef, useState } from 'react';
import { useRetellAgent } from '@/hooks/useRetellAgent';
import { AGENTS } from '@/config/agents';

export default function Home() {
  // AI chat state
  const [chatOpen, setChatOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{ role: "user" | "assistant", content: string }>>([]);
  const [aiInput, setAiInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [threadId, setThreadId] = useState<string | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  
  // Old voice demo state:
  const [inputValue, setInputValue] = useState('');
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [agentStatus, setAgentStatus] = useState<string>('');
  const [activeAgent, setActiveAgent] = useState<'chloe' | 'cindy' | null>(null);

  // Centralized Agent IDs
  const CHLOE_AGENT_ID = AGENTS.chloe;
  const CINDY_AGENT_ID = AGENTS.cindy;
  const CHRIS_AGENT_ID = AGENTS.chris;
  const CARA_AGENT_ID = AGENTS.cara;
  const CARLY_AGENT_ID = AGENTS.carly;
  const CARSON_AGENT_ID = AGENTS.carson;

  // Determine which agent ID to use
  const currentAgentId = activeAgent === 'chloe' ? CHLOE_AGENT_ID : 
                         activeAgent === 'cindy' ? CINDY_AGENT_ID :
                         activeAgent === 'chris' ? CHRIS_AGENT_ID :
                         activeAgent === 'cara' ? CARA_AGENT_ID :
                         activeAgent === 'carly' ? CARLY_AGENT_ID :
                         activeAgent === 'carson' ? CARSON_AGENT_ID : '';

  const { isConnected, isRecording, isConnecting, error, connect, disconnect } = useRetellAgent({
    agentId: currentAgentId || '',
    onStatusChange: (status) => {
      setAgentStatus(status);
    },
  });

  // Check if environment variables are configured
  const isConfigured = !!CHLOE_AGENT_ID;

  // Chat submit handler
  const handleAiChatSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const value = aiInput.trim();
    if (!value) return;
    setAiLoading(true);
    setAiError(null);
    setChatOpen(true);
    
    const updatedChat = [...chatHistory, { role: "user" as const, content: value }];
    setChatHistory(updatedChat);
    setAiInput("");
    
    // Fire request to your API (keep thread if exists)
    try {
      const resp = await fetch("/api/assist-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: value }],
          ...(threadId ? { thread_id: threadId } : {}),
        })
      });
      const data = await resp.json();
      
      if (!resp.ok || data.error) {
        setAiError(data.error || "Failed to get response from AI");
        return;
      }
      
      setThreadId(data.thread_id || null);
      setChatHistory([...updatedChat, { role: "assistant" as const, content: data.response }]);
      setTimeout(() => {
        if (chatBottomRef.current) {
          chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } catch (e: any) {
      console.error("Chat error:", e);
      setAiError(e.message || "Error connecting to Cosentus AI");
    } finally {
      setAiLoading(false);
    }
  };

  // Old: (deletes the voice-agent search feature, now replaced by chat)
  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (inputValue.trim()) {
  //     setInputValue("");
  //   }
  // };


  const handleExpandCard = (cardId: string) => {
    if (expandedCard === cardId) {
      // Collapse if already expanded
      setExpandedCard(null);
      setActiveAgent(null);
      if (isConnected) {
        disconnect();
      }
    } else {
      setExpandedCard(cardId);
      setActiveAgent(cardId as 'chloe' | 'cindy');
    }
  };

  const handleBeginDemo = async () => {
    await connect();
  };

  const handleEndDemo = () => {
    disconnect();
    setExpandedCard(null);
    setActiveAgent(null);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-white">
      {/* Crisp Black Oval Navbar */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
        <div className="bg-black/90 backdrop-blur-md rounded-full shadow-2xl px-8 py-4 pointer-events-auto border border-white/10">
          <div className="flex items-center gap-8">
            {/* Logo */}
            <div className="flex-shrink-0 pl-2">
              <img 
                src="https://cosentus.com/wp-content/uploads/2021/08/New-Cosentus-Logo-1.png" 
                alt="Cosentus Logo" 
                className="h-8 w-auto"
              />
            </div>

            {/* Navigation Menu */}
            <ul className="hidden lg:flex items-center gap-6 text-sm font-light text-white pr-4">
              <li className="whitespace-nowrap">
                <a href="#about" className="transition-all hover:text-white/70">
                  About Us
                </a>
              </li>
              <li className="whitespace-nowrap">
                <a href="#services" className="transition-all hover:text-white/70">
                  Services
                </a>
              </li>
              <li className="whitespace-nowrap">
                <a href="#partnership" className="transition-all hover:text-white/70">
                  Partnership
                </a>
              </li>
              <li className="whitespace-nowrap">
                <a href="#resources" className="transition-all hover:text-white/70">
                  Resources
                </a>
              </li>
              <li className="whitespace-nowrap">
                <a href="#blogs" className="transition-all hover:text-white/70">
                  Blogs
                </a>
              </li>
              <li className="whitespace-nowrap">
                <a href="#news" className="transition-all hover:text-white/70">
                  News
                </a>
              </li>
              <li className="whitespace-nowrap">
                <a href="#events" className="transition-all hover:text-white/70">
                  Events
                </a>
              </li>
              <li className="whitespace-nowrap">
                <a href="#care" className="transition-all hover:text-white/70">
                  We Care
                </a>
              </li>
              <li className="whitespace-nowrap">
                <a href="#contact" className="transition-all hover:text-white/70">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-12">
        {/* Polka Dot Interactive Background - Only in Hero Section */}
        <PolkaDotBackground />
        <div className="max-w-5xl text-center relative z-10">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl md:text-7xl lg:text-8xl">
            One platform. Patient to payment.
          </h1>
          
          {/* AI Chat Bubble (Expands vertically when chatOpen) */}
          <div className={`mt-12 lg:mt-16 w-full max-w-3xl mx-auto transition-all duration-300 ${chatOpen ? 'h-[60vh]' : ''}`}>
            {chatOpen ? (
              // Expanded chat window
              <div className="h-full flex flex-col bg-white rounded-3xl border border-gray-200 shadow-lg overflow-hidden">
                {/* Chat Header with Logo and Close Button - Same background as chat */}
                <div className="flex items-center justify-between px-6 py-4 bg-white">
                  <img 
                    src="https://cosentus.com/wp-content/uploads/2021/08/New-Cosentus-Logo-1.png" 
                    alt="Cosentus" 
                    className="h-7 w-auto"
                  />
                  <button
                    type="button"
                    aria-label="Close chat"
                    onClick={() => { setChatOpen(false); setChatHistory([]); setThreadId(null); setAiError(null); }}
                    className="text-gray-400 hover:text-gray-700 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Chat Messages Area - Scrollable */}
                <div className="flex-1 overflow-y-auto px-6 py-4 bg-white">
                  <div className="flex flex-col gap-4">
                    {chatHistory.map((msg, idx) => (
                      <div key={idx} className={`flex ${msg.role === "user" ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-base break-words whitespace-pre-line ${msg.role === "user" ? 'bg-[#01B2D6] text-white rounded-br-sm' : 'bg-white text-gray-800 rounded-bl-sm shadow-sm'}`}>
                          {msg.content}
                        </div>
                      </div>
                    ))}
                    {aiLoading && (
                      <div className="flex justify-start">
                        <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-sm text-base text-gray-400 shadow-sm">
                          <div className="flex items-center gap-2">
                            <div className="flex gap-1">
                              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {aiError && (
                      <div className="flex justify-center">
                        <div className="text-sm text-red-800 bg-red-50 rounded-lg px-4 py-2 shadow-sm">{aiError}</div>
                      </div>
                    )}
                    <div ref={chatBottomRef} tabIndex={-1}></div>
                  </div>
                </div>

                {/* Input Area - Sticky at Bottom */}
                <div className="px-6 py-4 bg-white">
                  <form onSubmit={handleAiChatSubmit} className="relative">
                    <input
                      type="text"
                      value={aiInput}
                      autoFocus
                      onChange={(e) => setAiInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) handleAiChatSubmit(e);
                      }}
                      placeholder="Type your message..."
                      disabled={aiLoading}
                      className="w-full bg-gray-50 border border-gray-200 rounded-full pl-5 pr-14 py-3 text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#01B2D6] focus:border-transparent transition-all"
                    />
                    <button
                      type="submit"
                      disabled={!aiInput.trim() || aiLoading}
                      className={`absolute right-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-[#01B2D6] text-white transition-all ${aiInput.trim() && !aiLoading ? 'opacity-100 hover:bg-[#0195b3] hover:scale-105' : 'opacity-40 cursor-not-allowed'}`}
                    >
                      {aiLoading ? (
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
                </div>
              </div>
            ) : (
              // Collapsed search bar
              <form onSubmit={handleAiChatSubmit} className="relative bg-white rounded-full border border-gray-200 shadow-md hover:shadow-lg transition-all">
                <input
                  type="text"
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) handleAiChatSubmit(e);
                  }}
                  placeholder="Ask Cosentus anything..."
                  disabled={aiLoading}
                  className="w-full rounded-full py-4 pl-6 pr-14 text-base text-gray-900 placeholder-gray-400 focus:outline-none bg-transparent"
                />
                <button
                  type="submit"
                  disabled={!aiInput.trim() || aiLoading}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-[#01B2D6] text-white transition-all ${aiInput.trim() && !aiLoading ? 'opacity-100 hover:bg-[#0195b3] hover:scale-105' : 'opacity-40 cursor-not-allowed'}`}
                >
                  {aiLoading ? (
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
            )}
          </div>


          {!chatOpen && (
            <p className="mt-8 text-lg text-gray-700 sm:text-xl md:text-2xl lg:mt-10">
              Stop juggling vendors. Full-cycle healthcare automation built on 25 years of expertise.
            </p>
          )}
        </div>
      </div>

      {/* Voice Demo Section */}
      <section className="relative z-10 py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              Meet Our AI Voice Agents
            </h2>
            <p className="mt-6 text-lg text-gray-600 sm:text-xl max-w-3xl mx-auto">
              Experience natural, real-time conversations powered by OpenAI's latest technology.
            </p>
          </div>

          {/* Demo Cards Grid */}
          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Chloe - Customer Service Agent */}
            <div 
              onClick={() => !isConnected && handleExpandCard('chloe')}
              className={`group relative bg-white rounded-2xl border border-gray-200 shadow-lg transition-all duration-700 cursor-pointer ${
                expandedCard === 'chloe' 
                  ? 'md:col-span-3 p-12' 
                  : 'p-8 hover:shadow-2xl hover:-translate-y-1'
              } ${expandedCard && expandedCard !== 'chloe' ? 'opacity-0 pointer-events-none absolute' : ''}`}
            >
              {!expandedCard || expandedCard === 'chloe' ? (
                <>
                  {/* Collapsed State */}
                  {expandedCard !== 'chloe' && (
                    <>
                      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#01B2D6]/10 mb-6 group-hover:bg-[#01B2D6]/20 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-[#01B2D6]">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-semibold text-gray-900 mb-3">Chloe</h3>
                      <p className="text-gray-600 mb-6">
                        General customer service agent ready to assist with any questions.
                      </p>
                      <div className="text-sm text-[#01B2D6] font-medium">
                        Click to learn more →
                      </div>
                    </>
                  )}

                  {/* Expanded State */}
                  {expandedCard === 'chloe' && (
                    <div className="flex flex-col md:flex-row gap-12 items-start">
                      {/* Left Side - Agent Info */}
                      <div className="flex-1 md:max-w-md">
                        <div className="flex items-center gap-4 mb-6">
                          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-[#01B2D6]/10">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-[#01B2D6]">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-4xl font-bold text-gray-900">Chloe</h3>
                            <p className="text-lg text-gray-600">Customer Service Agent</p>
                          </div>
                        </div>

                        <div className="space-y-4 mb-8">
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">About Chloe</h4>
                            <p className="text-gray-600">
                              Chloe is your friendly AI assistant, trained to handle customer inquiries with professionalism and care. She can help with general questions, provide information, and guide you through various processes.
                            </p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Capabilities</h4>
                            <ul className="text-gray-600 space-y-1">
                              <li>• Natural conversation flow</li>
                              <li>• Real-time voice interaction</li>
                              <li>• Professional and empathetic responses</li>
                              <li>• Available 24/7</li>
                            </ul>
                          </div>
                        </div>

                        <div className="flex gap-4">
                          {!isConnected ? (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                if (!isConfigured) {
                                  alert('⚠️ Environment variables not configured!\n\nPlease add RETELL_API_KEY and NEXT_PUBLIC_RETELL_AGENT_ID to your .env.local file.\n\nSee ENV_SETUP.md for instructions.');
                                  return;
                                }
                                handleBeginDemo();
                              }}
                              disabled={isConnecting || !isConfigured}
                              className="px-8 py-4 bg-[#01B2D6] text-white rounded-lg font-semibold text-lg hover:bg-[#0195b3] transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                              {isConnecting ? (
                                <>
                                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  Connecting...
                                </>
                              ) : (
                                <>
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                                  </svg>
                                  Begin Conversation
                                </>
                              )}
                            </button>
                          ) : (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEndDemo();
                              }}
                              className="px-8 py-4 bg-red-500 text-white rounded-lg font-semibold text-lg hover:bg-red-600 transition-colors"
                            >
                              End Conversation
                            </button>
                          )}
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleExpandCard('chloe');
                            }}
                            className="px-6 py-4 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                          >
                            Close
                          </button>
                        </div>
                      </div>

                      {/* Right Side - Glowing Orb Visualization */}
                      <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] py-8">
                        {isConnected ? (
                          <div className="flex flex-col items-center gap-6">
                            {/* Single Glowing Orb */}
                            <div 
                              className="w-40 h-40 rounded-full bg-gradient-to-br from-[#01B2D6] via-[#0195b3] to-[#017a8f] transition-all duration-700"
                              style={{
                                boxShadow: isRecording 
                                  ? '0 0 80px 20px rgba(1, 178, 214, 0.6), 0 0 120px 30px rgba(1, 178, 214, 0.3), inset 0 0 40px rgba(255, 255, 255, 0.2)'
                                  : '0 0 40px 10px rgba(1, 178, 214, 0.4), inset 0 0 20px rgba(255, 255, 255, 0.1)',
                                animation: isRecording ? 'pulse-glow 2s ease-in-out infinite' : 'none'
                              }}
                            />
                            
                            {/* Status Text */}
                            <p className="text-gray-600 text-center">
                              {isRecording ? 'Chloe is speaking...' : 'Listening...'}
                            </p>
                          </div>
                        ) : (
                          <div className="text-center text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16 mx-auto mb-4 opacity-50">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                            </svg>
                            <p className="text-sm">
                              {isConnecting ? 'Connecting...' : 'Click "Begin Conversation" to start'}
                            </p>
                          </div>
                          )}
                        
                        {/* Error Display - Below orb */}
                        {error && (
                          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg max-w-md">
                            <p className="text-sm text-red-800 text-center">
                              <strong>Error:</strong> {error}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              ) : null}
            </div>

            {/* Cindy - Payment & Balance Agent */}
            <div 
              onClick={() => !isConnected && handleExpandCard('cindy')}
              className={`group relative bg-white rounded-2xl border border-gray-200 shadow-lg transition-all duration-700 cursor-pointer ${
                expandedCard === 'cindy' 
                  ? 'md:col-span-3 p-12' 
                  : 'p-8 hover:shadow-2xl hover:-translate-y-1'
              } ${expandedCard && expandedCard !== 'cindy' ? 'opacity-0 pointer-events-none absolute' : ''}`}
            >
              {!expandedCard || expandedCard === 'cindy' ? (
                <>
                  {/* Collapsed State */}
                  {expandedCard !== 'cindy' && (
                    <>
                      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#01B2D6]/10 mb-6 group-hover:bg-[#01B2D6]/20 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-[#01B2D6]">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-semibold text-gray-900 mb-3">Cindy</h3>
                      <p className="text-gray-600 mb-6">
                        Handles outstanding balances and payment processing in 50+ languages.
                      </p>
                      <div className="text-sm text-[#01B2D6] font-medium">
                        Click to learn more →
                      </div>
                    </>
                  )}

                  {/* Expanded State */}
                  {expandedCard === 'cindy' && (
                    <div className="flex flex-col md:flex-row gap-12 items-start">
                      {/* Left Side - Agent Info */}
                      <div className="flex-1 md:max-w-md">
                        <div className="flex items-center gap-4 mb-6">
                          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-[#01B2D6]/10">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-[#01B2D6]">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-4xl font-bold text-gray-900">Cindy</h3>
                            <p className="text-lg text-gray-600">Payment & Balance Specialist</p>
                          </div>
                        </div>

                        <div className="space-y-4 mb-8">
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">About Cindy</h4>
                            <p className="text-gray-600">
                              Cindy specializes in handling inbound patient calls for outstanding balance inquiries and payment processing. She provides clear, empathetic assistance to help patients understand and resolve their billing questions.
                            </p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Capabilities</h4>
                            <ul className="text-gray-600 space-y-1">
                              <li>• Outstanding balance information</li>
                              <li>• Secure payment processing</li>
                              <li>• Speaks 50+ languages fluently</li>
                              <li>• Handles up to 20 calls simultaneously</li>
                              <li>• Payment plan setup assistance</li>
                            </ul>
                          </div>
                        </div>

                        <div className="flex gap-4">
                          {!isConnected ? (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleBeginDemo();
                              }}
                              disabled={isConnecting}
                              className="px-8 py-4 bg-[#01B2D6] text-white rounded-lg font-semibold text-lg hover:bg-[#0195b3] transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                              {isConnecting ? (
                                <>
                                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  Connecting...
                                </>
                              ) : (
                                <>
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                                  </svg>
                                  Begin Conversation
                                </>
                              )}
                            </button>
                          ) : (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEndDemo();
                              }}
                              className="px-8 py-4 bg-red-500 text-white rounded-lg font-semibold text-lg hover:bg-red-600 transition-colors"
                            >
                              End Conversation
                            </button>
                          )}
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleExpandCard('cindy');
                            }}
                            className="px-6 py-4 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                          >
                            Close
                          </button>
                        </div>
                      </div>

                      {/* Right Side - Glowing Orb Visualization */}
                      <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] py-8">
                        {isConnected ? (
                          <div className="flex flex-col items-center gap-6">
                            {/* Single Glowing Orb */}
                            <div 
                              className="w-40 h-40 rounded-full bg-gradient-to-br from-[#01B2D6] via-[#0195b3] to-[#017a8f] transition-all duration-700"
                              style={{
                                boxShadow: isRecording 
                                  ? '0 0 80px 20px rgba(1, 178, 214, 0.6), 0 0 120px 30px rgba(1, 178, 214, 0.3), inset 0 0 40px rgba(255, 255, 255, 0.2)'
                                  : '0 0 40px 10px rgba(1, 178, 214, 0.4), inset 0 0 20px rgba(255, 255, 255, 0.1)',
                                animation: isRecording ? 'pulse-glow 2s ease-in-out infinite' : 'none'
                              }}
                            />
                            
                            {/* Status Text */}
                            <p className="text-gray-600 text-center">
                              {isRecording ? 'Cindy is speaking...' : 'Listening...'}
                            </p>
                          </div>
                        ) : (
                          <div className="text-center text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16 mx-auto mb-4 opacity-50">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                            </svg>
                            <p className="text-sm">
                              {isConnecting ? 'Connecting...' : 'Click "Begin Conversation" to start'}
                            </p>
                          </div>
                        )}
                        
                        {/* Error Display - Below orb */}
                        {error && (
                          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg max-w-md">
                            <p className="text-sm text-red-800 text-center">
                              <strong>Error:</strong> {error}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              ) : null}
            </div>

            {/* Chris - Insurance Claim Follow-Up */}
            <div 
              onClick={() => !isConnected && handleExpandCard('chris')}
              className={`group relative bg-white rounded-2xl border border-gray-200 shadow-lg transition-all duration-700 cursor-pointer ${
                expandedCard === 'chris' 
                  ? 'md:col-span-3 p-12' 
                  : 'p-8 hover:shadow-2xl hover:-translate-y-1'
              } ${expandedCard && expandedCard !== 'chris' ? 'opacity-0 pointer-events-none absolute' : ''}`}
            >
              {!expandedCard || expandedCard === 'chris' ? (
                <>
                  {/* Collapsed State */}
                  {expandedCard !== 'chris' && (
                    <>
                      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#01B2D6]/10 mb-6 group-hover:bg-[#01B2D6]/20 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-[#01B2D6]">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-semibold text-gray-900 mb-3">Chris</h3>
                      <p className="text-gray-600 mb-6">
                        Handles outbound insurance claim follow-ups with carriers to resolve denials and track status.
                      </p>
                      <div className="text-sm text-[#01B2D6] font-medium">
                        Click to learn more →
                      </div>
                    </>
                  )}

                  {/* Expanded State */}
                  {expandedCard === 'chris' && (
                    <div className="flex flex-col md:flex-row gap-12 items-start">
                      {/* Left Side - Agent Info */}
                      <div className="flex-1 md:max-w-md">
                        <div className="flex items-center gap-4 mb-6">
                          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-[#01B2D6]/10">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-[#01B2D6]">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-4xl font-bold text-gray-900">Chris</h3>
                            <p className="text-lg text-gray-600">Insurance Claim Specialist</p>
                          </div>
                        </div>

                        <div className="space-y-4 mb-8">
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">About Chris</h4>
                            <p className="text-gray-600">
                              Chris specializes in calling insurance companies to follow up on claim statuses, resolve denials, and gather information needed for billing. He navigates complex phone systems and speaks naturally with insurance representatives.
                            </p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Capabilities</h4>
                            <ul className="text-gray-600 space-y-1">
                              <li>• Insurance claim status checks</li>
                              <li>• Denial resolution and appeals</li>
                              <li>• Handles up to 20 calls simultaneously</li>
                              <li>• Speaks 10+ languages</li>
                              <li>• Navigates complex IVR systems</li>
                            </ul>
                          </div>
                        </div>

                        <div className="flex gap-4">
                          {!isConnected ? (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleBeginDemo();
                              }}
                              disabled={isConnecting}
                              className="px-8 py-4 bg-[#01B2D6] text-white rounded-lg font-semibold text-lg hover:bg-[#0195b3] transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                              {isConnecting ? (
                                <>
                                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  Connecting...
                                </>
                              ) : (
                                <>
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                                  </svg>
                                  Begin Conversation
                                </>
                              )}
                            </button>
                          ) : (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEndDemo();
                              }}
                              className="px-8 py-4 bg-red-500 text-white rounded-lg font-semibold text-lg hover:bg-red-600 transition-colors"
                            >
                              End Conversation
                            </button>
                          )}
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleExpandCard('chris');
                            }}
                            className="px-6 py-4 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                          >
                            Close
                          </button>
                        </div>
                      </div>

                      {/* Right Side - Glowing Orb Visualization */}
                      <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] py-8">
                        {isConnected ? (
                          <div className="flex flex-col items-center gap-6">
                            {/* Single Glowing Orb */}
                            <div 
                              className="w-40 h-40 rounded-full bg-gradient-to-br from-[#01B2D6] via-[#0195b3] to-[#017a8f] transition-all duration-700"
                              style={{
                                boxShadow: isRecording 
                                  ? '0 0 80px 20px rgba(1, 178, 214, 0.6), 0 0 120px 30px rgba(1, 178, 214, 0.3), inset 0 0 40px rgba(255, 255, 255, 0.2)'
                                  : '0 0 40px 10px rgba(1, 178, 214, 0.4), inset 0 0 20px rgba(255, 255, 255, 0.1)',
                                animation: isRecording ? 'pulse-glow 2s ease-in-out infinite' : 'none'
                              }}
                            />
                            
                            {/* Status Text */}
                            <p className="text-gray-600 text-center">
                              {isRecording ? 'Chris is speaking...' : 'Listening...'}
                            </p>
                          </div>
                        ) : (
                          <div className="text-center text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16 mx-auto mb-4 opacity-50">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                            </svg>
                            <p className="text-sm">
                              {isConnecting ? 'Connecting...' : 'Click "Begin Conversation" to start'}
                            </p>
                          </div>
                        )}
                        
                        {/* Error Display - Below orb */}
                        {error && (
                          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg max-w-md">
                            <p className="text-sm text-red-800 text-center">
                              <strong>Error:</strong> {error}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              ) : null}
            </div>

            {/* Cara - Eligibility & Benefits Verification */}
            <div 
              onClick={() => !isConnected && handleExpandCard('cara')}
              className={`group relative bg-white rounded-2xl border border-gray-200 shadow-lg transition-all duration-700 cursor-pointer ${
                expandedCard === 'cara' 
                  ? 'md:col-span-3 p-12' 
                  : 'p-8 hover:shadow-2xl hover:-translate-y-1'
              } ${expandedCard && expandedCard !== 'cara' ? 'opacity-0 pointer-events-none absolute' : ''}`}
            >
              {!expandedCard || expandedCard === 'cara' ? (
                <>
                  {/* Collapsed State */}
                  {expandedCard !== 'cara' && (
                    <>
                      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#01B2D6]/10 mb-6 group-hover:bg-[#01B2D6]/20 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-[#01B2D6]">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-semibold text-gray-900 mb-3">Cara</h3>
                      <p className="text-gray-600 mb-6">
                        Verifies patient insurance eligibility and benefits before services.
                      </p>
                      <div className="text-sm text-[#01B2D6] font-medium">
                        Click to learn more →
                      </div>
                    </>
                  )}

                  {/* Expanded State */}
                  {expandedCard === 'cara' && (
                    <div className="flex flex-col md:flex-row gap-12 items-start">
                      {/* Left Side - Agent Info */}
                      <div className="flex-1 md:max-w-md">
                        <div className="flex items-center gap-4 mb-6">
                          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-[#01B2D6]/10">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-[#01B2D6]">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-4xl font-bold text-gray-900">Cara</h3>
                            <p className="text-lg text-gray-600">Eligibility & Benefits Verification</p>
                          </div>
                        </div>

                        <div className="space-y-4 mb-8">
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">About Cara</h4>
                            <p className="text-gray-600">
                              Cara specializes in calling insurance companies to verify patient coverage before services are rendered. She checks eligibility, benefits, deductibles, and in-network status to ensure accurate billing.
                            </p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Capabilities</h4>
                            <ul className="text-gray-600 space-y-1">
                              <li>• Insurance eligibility verification</li>
                              <li>• Benefits and coverage details</li>
                              <li>• Deductible and out-of-pocket tracking</li>
                              <li>• In-network vs out-of-network status</li>
                              <li>• Secondary insurance coordination</li>
                              <li>• Handles hundreds of calls per day</li>
                            </ul>
                          </div>
                        </div>

                        <div className="flex gap-4">
                          {!isConnected ? (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleBeginDemo();
                              }}
                              disabled={isConnecting}
                              className="px-8 py-4 bg-[#01B2D6] text-white rounded-lg font-semibold text-lg hover:bg-[#0195b3] transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                              {isConnecting ? (
                                <>
                                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  Connecting...
                                </>
                              ) : (
                                <>
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                                  </svg>
                                  Begin Conversation
                                </>
                              )}
                            </button>
                          ) : (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEndDemo();
                              }}
                              className="px-8 py-4 bg-red-500 text-white rounded-lg font-semibold text-lg hover:bg-red-600 transition-colors"
                            >
                              End Conversation
                            </button>
                          )}
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleExpandCard('cara');
                            }}
                            className="px-6 py-4 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                          >
                            Close
                          </button>
                        </div>
                      </div>

                      {/* Right Side - Glowing Orb Visualization */}
                      <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] py-8">
                        {isConnected ? (
                          <div className="flex flex-col items-center gap-6">
                            {/* Single Glowing Orb */}
                            <div 
                              className="w-40 h-40 rounded-full bg-gradient-to-br from-[#01B2D6] via-[#0195b3] to-[#017a8f] transition-all duration-700"
                              style={{
                                boxShadow: isRecording 
                                  ? '0 0 80px 20px rgba(1, 178, 214, 0.6), 0 0 120px 30px rgba(1, 178, 214, 0.3), inset 0 0 40px rgba(255, 255, 255, 0.2)'
                                  : '0 0 40px 10px rgba(1, 178, 214, 0.4), inset 0 0 20px rgba(255, 255, 255, 0.1)',
                                animation: isRecording ? 'pulse-glow 2s ease-in-out infinite' : 'none'
                              }}
                            />
                            
                            {/* Status Text */}
                            <p className="text-gray-600 text-center">
                              {isRecording ? 'Cara is speaking...' : 'Listening...'}
                            </p>
                            
                            <p className="text-sm text-gray-500 text-center max-w-xs">
                              Try asking: "Can you show me how you verify insurance?" or "Walk me through an eligibility check"
                            </p>
                          </div>
                        ) : (
                          <div className="text-center text-gray-500">
                            <p className="mb-4">Click "Begin Conversation" to start talking with Cara</p>
                            <p className="text-sm">She'll demonstrate how she verifies patient insurance eligibility</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              ) : null}
            </div>

            {/* Carly - Prior Authorization Follow-Up */}
            <div 
              onClick={() => !isConnected && handleExpandCard('carly')}
              className={`group relative bg-white rounded-2xl border border-gray-200 shadow-lg transition-all duration-700 cursor-pointer ${
                expandedCard === 'carly' 
                  ? 'md:col-span-3 p-12' 
                  : 'p-8 hover:shadow-2xl hover:-translate-y-1'
              } ${expandedCard && expandedCard !== 'carly' ? 'opacity-0 pointer-events-none absolute' : ''}`}
            >
              {!expandedCard || expandedCard === 'carly' ? (
                <>
                  {/* Collapsed State */}
                  {expandedCard !== 'carly' && (
                    <>
                      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#01B2D6]/10 mb-6 group-hover:bg-[#01B2D6]/20 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-[#01B2D6]">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-semibold text-gray-900 mb-3">Carly</h3>
                      <p className="text-gray-600 mb-6">
                        Tracks prior authorization approvals and expedites urgent cases.
                      </p>
                      <div className="text-sm text-[#01B2D6] font-medium">
                        Click to learn more →
                      </div>
                    </>
                  )}

                  {/* Expanded State */}
                  {expandedCard === 'carly' && (
                    <div className="flex flex-col md:flex-row gap-12 items-start">
                      {/* Left Side - Agent Info */}
                      <div className="flex-1 md:max-w-md">
                        <div className="flex items-center gap-4 mb-6">
                          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-[#01B2D6]/10">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-[#01B2D6]">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-4xl font-bold text-gray-900">Carly</h3>
                            <p className="text-lg text-gray-600">Prior Authorization Follow-Up</p>
                          </div>
                        </div>

                        <div className="space-y-4 mb-8">
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">About Carly</h4>
                            <p className="text-gray-600">
                              Carly specializes in calling insurance companies to track down prior authorization approvals. She checks if authorizations are approved, denied, or pending, and can expedite urgent cases to keep procedures on schedule.
                            </p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Capabilities</h4>
                            <ul className="text-gray-600 space-y-1">
                              <li>• Prior authorization status checks</li>
                              <li>• Approval tracking and documentation</li>
                              <li>• Expedited review requests for urgent cases</li>
                              <li>• Denial reason capture and appeals support</li>
                              <li>• Auth number and validity date tracking</li>
                              <li>• Handles dozens of auth calls per day</li>
                            </ul>
                          </div>
                        </div>

                        <div className="flex gap-4">
                          {!isConnected ? (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleBeginDemo();
                              }}
                              disabled={isConnecting}
                              className="px-8 py-4 bg-[#01B2D6] text-white rounded-lg font-semibold text-lg hover:bg-[#0195b3] transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                              {isConnecting ? (
                                <>
                                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  Connecting...
                                </>
                              ) : (
                                <>
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                                  </svg>
                                  Begin Conversation
                                </>
                              )}
                            </button>
                          ) : (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEndDemo();
                              }}
                              className="px-8 py-4 bg-red-500 text-white rounded-lg font-semibold text-lg hover:bg-red-600 transition-colors"
                            >
                              End Conversation
                            </button>
                          )}
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleExpandCard('carly');
                            }}
                            className="px-6 py-4 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                          >
                            Close
                          </button>
                        </div>
                      </div>

                      {/* Right Side - Glowing Orb Visualization */}
                      <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] py-8">
                        {isConnected ? (
                          <div className="flex flex-col items-center gap-6">
                            {/* Single Glowing Orb */}
                            <div 
                              className="w-40 h-40 rounded-full bg-gradient-to-br from-[#01B2D6] via-[#0195b3] to-[#017a8f] transition-all duration-700"
                              style={{
                                boxShadow: isRecording 
                                  ? '0 0 80px 20px rgba(1, 178, 214, 0.6), 0 0 120px 30px rgba(1, 178, 214, 0.3), inset 0 0 40px rgba(255, 255, 255, 0.2)'
                                  : '0 0 40px 10px rgba(1, 178, 214, 0.4), inset 0 0 20px rgba(255, 255, 255, 0.1)',
                                animation: isRecording ? 'pulse-glow 2s ease-in-out infinite' : 'none'
                              }}
                            />
                            
                            {/* Status Text */}
                            <p className="text-gray-600 text-center">
                              {isRecording ? 'Carly is speaking...' : 'Listening...'}
                            </p>
                            
                            <p className="text-sm text-gray-500 text-center max-w-xs">
                              Try asking: "Can you check on a prior auth?" or "Show me how you handle an urgent case"
                            </p>
                          </div>
                        ) : (
                          <div className="text-center text-gray-500">
                            <p className="mb-4">Click "Begin Conversation" to start talking with Carly</p>
                            <p className="text-sm">She'll demonstrate how she tracks prior authorization approvals</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              ) : null}
            </div>

            {/* Carson - Payment Reconciliation */}
            <div 
              onClick={() => !isConnected && handleExpandCard('carson')}
              className={`group relative bg-white rounded-2xl border border-gray-200 shadow-lg transition-all duration-700 cursor-pointer ${
                expandedCard === 'carson' 
                  ? 'md:col-span-3 p-12' 
                  : 'p-8 hover:shadow-2xl hover:-translate-y-1'
              } ${expandedCard && expandedCard !== 'carson' ? 'opacity-0 pointer-events-none absolute' : ''}`}
            >
              {!expandedCard || expandedCard === 'carson' ? (
                <>
                  {/* Collapsed State */}
                  {expandedCard !== 'carson' && (
                    <>
                      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#01B2D6]/10 mb-6 group-hover:bg-[#01B2D6]/20 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-[#01B2D6]">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-semibold text-gray-900 mb-3">Carson</h3>
                      <p className="text-gray-600 mb-6">
                        Tracks down payment discrepancies and resolves missing or incorrect payments.
                      </p>
                      <div className="text-sm text-[#01B2D6] font-medium">
                        Click to learn more →
                      </div>
                    </>
                  )}

                  {/* Expanded State */}
                  {expandedCard === 'carson' && (
                    <div className="flex flex-col md:flex-row gap-12 items-start">
                      {/* Left Side - Agent Info */}
                      <div className="flex-1 md:max-w-md">
                        <div className="flex items-center gap-4 mb-6">
                          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-[#01B2D6]/10">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-[#01B2D6]">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-4xl font-bold text-gray-900">Carson</h3>
                            <p className="text-lg text-gray-600">Payment Reconciliation</p>
                          </div>
                        </div>

                        <div className="space-y-4 mb-8">
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">About Carson</h4>
                            <p className="text-gray-600">
                              Carson is your financial detective, specializing in tracking down and resolving payment discrepancies with insurance companies. He investigates missing payments, partial payments, incorrect amounts, and overpayments to ensure every dollar is accounted for.
                            </p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Capabilities</h4>
                            <ul className="text-gray-600 space-y-1">
                              <li>• Missing payment investigation</li>
                              <li>• Payment discrepancy resolution</li>
                              <li>• Check trace and reissue requests</li>
                              <li>• Duplicate EOB retrieval</li>
                              <li>• Overpayment refund processing</li>
                              <li>• EFT payment tracking</li>
                              <li>• Handles hundreds of reconciliation calls per day</li>
                            </ul>
                          </div>
                        </div>

                        <div className="flex gap-4">
                          {!isConnected ? (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleBeginDemo();
                              }}
                              disabled={isConnecting}
                              className="px-8 py-4 bg-[#01B2D6] text-white rounded-lg font-semibold text-lg hover:bg-[#0195b3] transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                              {isConnecting ? (
                                <>
                                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  Connecting...
                                </>
                              ) : (
                                <>
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                                  </svg>
                                  Begin Conversation
                                </>
                              )}
                            </button>
                          ) : (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEndDemo();
                              }}
                              className="px-8 py-4 bg-red-500 text-white rounded-lg font-semibold text-lg hover:bg-red-600 transition-colors"
                            >
                              End Conversation
                            </button>
                          )}
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleExpandCard('carson');
                            }}
                            className="px-6 py-4 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                          >
                            Close
                          </button>
                        </div>
                      </div>

                      {/* Right Side - Glowing Orb Visualization */}
                      <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] py-8">
                        {isConnected ? (
                          <div className="flex flex-col items-center gap-6">
                            {/* Single Glowing Orb */}
                            <div 
                              className="w-40 h-40 rounded-full bg-gradient-to-br from-[#01B2D6] via-[#0195b3] to-[#017a8f] transition-all duration-700"
                              style={{
                                boxShadow: isRecording 
                                  ? '0 0 80px 20px rgba(1, 178, 214, 0.6), 0 0 120px 30px rgba(1, 178, 214, 0.3), inset 0 0 40px rgba(255, 255, 255, 0.2)'
                                  : '0 0 40px 10px rgba(1, 178, 214, 0.4), inset 0 0 20px rgba(255, 255, 255, 0.1)',
                                animation: isRecording ? 'pulse-glow 2s ease-in-out infinite' : 'none'
                              }}
                            />
                            
                            {/* Status Text */}
                            <p className="text-gray-600 text-center">
                              {isRecording ? 'Carson is speaking...' : 'Listening...'}
                            </p>
                            
                            <p className="text-sm text-gray-500 text-center max-w-xs">
                              Try asking: "Can you track down a missing payment?" or "Show me how you resolve a discrepancy"
                            </p>
                          </div>
                        ) : (
                          <div className="text-center text-gray-500">
                            <p className="mb-4">Click "Begin Conversation" to start talking with Carson</p>
                            <p className="text-sm">He'll demonstrate how he tracks down payment issues</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              ) : null}
            </div>
          </div>
        </div>
      </section>

    </main>
  )
}

