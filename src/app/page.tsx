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

  // Determine which agent ID to use
  const currentAgentId = activeAgent === 'chloe' ? CHLOE_AGENT_ID : 
                         activeAgent === 'cindy' ? CINDY_AGENT_ID : '';

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

            {/* Symptom Checker Demo - Coming Soon */}
            <div className="group relative bg-white rounded-2xl border border-gray-200 p-8 shadow-lg opacity-60">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-gray-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">Agent 3</h3>
              <p className="text-gray-600 mb-6">
                Coming soon...
              </p>
              <div className="text-sm text-gray-400 font-medium text-center">
                Available Soon
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  )
}

