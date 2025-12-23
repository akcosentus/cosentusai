'use client';

import { PolkaDotBackground } from '@/components/PolkaDotBackground';
import { useState } from 'react';
import { useRetellAgent } from '@/hooks/useRetellAgent';

export default function Home() {
  const [inputValue, setInputValue] = useState('');
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [agentStatus, setAgentStatus] = useState<string>('');

  // Retell Agent ID for Chloe (from environment variables only)
  const AGENT_ID = process.env.NEXT_PUBLIC_RETELL_AGENT_ID;

  const { isConnected, isRecording, isConnecting, error, connect, disconnect } = useRetellAgent({
    agentId: AGENT_ID || '',
    onStatusChange: (status) => {
      setAgentStatus(status);
    },
  });

  // Check if environment variables are configured
  const isConfigured = !!AGENT_ID;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      // Handle search submission
      setInputValue('');
    }
  };

  const handleExpandCard = (cardId: string) => {
    if (expandedCard === cardId) {
      // Collapse if already expanded
      setExpandedCard(null);
      if (isConnected) {
        disconnect();
      }
    } else {
      setExpandedCard(cardId);
    }
  };

  const handleBeginDemo = async () => {
    await connect();
  };

  const handleEndDemo = () => {
    disconnect();
    setExpandedCard(null);
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
          
          {/* Search Bar - Between Hero and Subheading */}
          <div className="mt-12 lg:mt-16 w-full max-w-3xl mx-auto">
            <form onSubmit={handleSubmit} className="relative flex items-center rounded-full border border-gray-300 bg-white shadow-2xl">
              {/* Plus Icon */}
              <button type="button" className="absolute left-5 flex h-10 w-10 items-center justify-center text-gray-500 hover:text-gray-700 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </button>

              {/* Input */}
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask anything"
                className="w-full rounded-full py-4 pl-20 pr-20 text-base text-gray-900 placeholder-gray-400 focus:outline-none"
              />

              {/* Send Button - Up Arrow with Fade */}
              <button 
                type="submit" 
                disabled={!inputValue.trim()}
                className={`absolute right-5 flex h-10 w-10 items-center justify-center rounded-full bg-[#01B2D6] text-white transition-all ${
                  inputValue.trim() 
                    ? 'opacity-100 hover:bg-[#0195b3]' 
                    : 'opacity-30 cursor-not-allowed'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
                </svg>
              </button>
            </form>
          </div>

          <p className="mt-8 text-lg text-gray-700 sm:text-xl md:text-2xl lg:mt-10">
            Stop juggling vendors. Full-cycle healthcare automation built on 25 years of expertise.
          </p>
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

            {/* Appointment Booking Demo - Coming Soon */}
            <div className="group relative bg-white rounded-2xl border border-gray-200 p-8 shadow-lg opacity-60">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-gray-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">Agent 2</h3>
              <p className="text-gray-600 mb-6">
                Coming soon...
              </p>
              <div className="text-sm text-gray-400 font-medium text-center">
                Available Soon
              </div>
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

