

'use client';

import { useState, useEffect } from 'react';
import { useRetellAgent } from '@/hooks/useRetellAgent';
import { AGENTS } from '@/config/agents';

// Add animation styles with nth-child delays
// Cards stay hidden for 1.5s, then animate in one by one
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
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
    .agent-card {
      opacity: 0;
    }
    .agent-card.animate {
      animation: fadeInUp 0.6s ease-out both;
    }
    .agent-card.animate:nth-child(1) { animation-delay: 0s; }
    .agent-card.animate:nth-child(2) { animation-delay: 0.1s; }
    .agent-card.animate:nth-child(3) { animation-delay: 0.2s; }
    .agent-card.animate:nth-child(4) { animation-delay: 0.3s; }
    .agent-card.animate:nth-child(5) { animation-delay: 0.4s; }
    .agent-card.animate:nth-child(6) { animation-delay: 0.5s; }
    .agent-card.animate:nth-child(7) { animation-delay: 0.6s; }
    .agent-card.animate:nth-child(8) { animation-delay: 0.7s; }
  `;
  if (!document.head.querySelector('style[data-voice-animations]')) {
    style.setAttribute('data-voice-animations', 'true');
    document.head.appendChild(style);
  }
}

export default function AllVoiceAgents() {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [activeAgent, setActiveAgent] = useState<'allison' | 'cindy' | 'chris' | 'james' | 'olivia' | 'michael' | 'emily' | 'sarah' | null>(null);
  const [startAnimation, setStartAnimation] = useState(false);

  // Wait 2.8 seconds before starting animation to ensure iframe is fully loaded
  useEffect(() => {
    const timer = setTimeout(() => {
      setStartAnimation(true);
    }, 2800);
    return () => clearTimeout(timer);
  }, []);

  // Centralized Agent IDs
  const ALLISON_AGENT_ID = AGENTS.allison;
  const CINDY_AGENT_ID = AGENTS.cindy;
  const CHRIS_AGENT_ID = AGENTS.chris;
  const JAMES_AGENT_ID = AGENTS.james;
  const OLIVIA_AGENT_ID = AGENTS.olivia;
  const MICHAEL_AGENT_ID = AGENTS.michael;
  const EMILY_AGENT_ID = AGENTS.emily;
  const SARAH_AGENT_ID = AGENTS.sarah;

  // Determine which agent ID to use
  const currentAgentId = activeAgent === 'allison' ? ALLISON_AGENT_ID : 
                         activeAgent === 'cindy' ? CINDY_AGENT_ID :
                         activeAgent === 'chris' ? CHRIS_AGENT_ID :
                         activeAgent === 'james' ? JAMES_AGENT_ID :
                         activeAgent === 'olivia' ? OLIVIA_AGENT_ID :
                         activeAgent === 'michael' ? MICHAEL_AGENT_ID :
                         activeAgent === 'emily' ? EMILY_AGENT_ID :
                         activeAgent === 'sarah' ? SARAH_AGENT_ID : '';

  const { isConnected, isRecording, isConnecting, error, connect, disconnect } = useRetellAgent({
    agentId: currentAgentId || '',
  });

  const handleExpandCard = (cardId: string) => {
    if (expandedCard === cardId) {
      setExpandedCard(null);
      setActiveAgent(null);
      if (isConnected) {
        disconnect();
      }
    } else {
      setExpandedCard(cardId);
      setActiveAgent(cardId as 'allison' | 'cindy' | 'chris' | 'james' | 'olivia' | 'michael' | 'emily' | 'sarah');
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
    <div className="min-h-screen pt-16 pb-4 px-4 md:pt-20 md:pb-8 md:px-8 bg-transparent">
      <div className="max-w-[1600px] mx-auto relative">
        {/* Logo - Top Right of Grid */}
        <img 
          src="/cosentu-white-logo.png" 
          alt="Cosentus" 
          className="absolute -top-12 right-0 w-40 md:w-48 z-[100]"
        />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 auto-rows-fr">
  {/* Cindy - Payment & Balance Agent */}
  <div 
    onClick={() => !isConnected && handleExpandCard('cindy')}
    className={`agent-card ${startAnimation ? "animate" : ""} group relative bg-white rounded-2xl border border-gray-200 shadow-lg transition-all duration-700 cursor-pointer ${
      expandedCard === 'cindy' 
        ? 'md:col-span-4 p-6 md:p-12' 
        : 'p-4 md:p-6 h-full hover:shadow-2xl hover:-translate-y-1'
    } ${expandedCard && expandedCard !== 'cindy' ? 'hidden' : ''}`}
  >
    {!expandedCard || expandedCard === 'cindy' ? (
      <>
        {/* Collapsed State */}
        {expandedCard !== 'cindy' && (
          <>
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#01B2D6]/10 mb-4 group-hover:bg-[#01B2D6]/20 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-[#01B2D6]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">Cindy</h3>
            <p className="text-gray-600 mb-4">
              Handles outstanding balances and payment processing in 50+ languages.
            </p>
            <div className="text-sm text-[#01B2D6] font-medium">
              Click to learn more →
            </div>
          </>
        )}

        {/* Expanded State */}
        {expandedCard === 'cindy' && (
          <div className="max-w-6xl mx-auto">
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
                    <li>• Real-time balance inquiries and payment history</li>
                    <li>• Secure credit card and ACH payment processing</li>
                    <li>• Payment plan setup and modification</li>
                    <li>• Insurance coverage explanations</li>
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
          </div>
        )}
      </>
    ) : null}
  </div>

  {/* Chris - Insurance Claim Follow-Up */}
  <div 
    onClick={() => !isConnected && handleExpandCard('chris')}
    className={`agent-card ${startAnimation ? "animate" : ""} group relative bg-white rounded-2xl border border-gray-200 shadow-lg transition-all duration-700 cursor-pointer ${
      expandedCard === 'chris' 
        ? 'md:col-span-4 p-6 md:p-12' 
        : 'p-4 md:p-6 h-full hover:shadow-2xl hover:-translate-y-1'
    } ${expandedCard && expandedCard !== 'chris' ? 'hidden' : ''}`}
  >
    {!expandedCard || expandedCard === 'chris' ? (
      <>
        {/* Collapsed State */}
        {expandedCard !== 'chris' && (
          <>
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#01B2D6]/10 mb-4 group-hover:bg-[#01B2D6]/20 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-[#01B2D6]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">Chris</h3>
            <p className="text-gray-600 mb-4">
              Handles outbound insurance claim follow-ups with carriers to resolve denials and track status.
            </p>
            <div className="text-sm text-[#01B2D6] font-medium">
              Click to learn more →
            </div>
          </>
        )}

        {/* Expanded State */}
        {expandedCard === 'chris' && (
          <div className="max-w-6xl mx-auto">
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
                    <li>• Outbound claim status follow-ups with carriers</li>
                    <li>• Denial investigation and appeal preparation</li>
                    <li>• Missing information requests and documentation</li>
                    <li>• Timely filing deadline tracking</li>
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
        </div>
        )}
      </>
    ) : null}
  </div>

  {/* Emily - Pre-Service Anesthesia Cost Estimates */}
  <div 
    onClick={() => !isConnected && handleExpandCard('emily')}
    className={`agent-card ${startAnimation ? "animate" : ""} group relative bg-white rounded-2xl border border-gray-200 shadow-lg transition-all duration-700 cursor-pointer ${
      expandedCard === 'emily' 
        ? 'md:col-span-4 p-6 md:p-12' 
        : 'p-4 md:p-6 h-full hover:shadow-2xl hover:-translate-y-1'
    } ${expandedCard && expandedCard !== 'emily' ? 'hidden' : ''}`}
  >
    {!expandedCard || expandedCard === 'emily' ? (
      <>
        {/* Collapsed State */}
        {expandedCard !== 'emily' && (
          <>
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#01B2D6]/10 mb-4 group-hover:bg-[#01B2D6]/20 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-[#01B2D6]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V18zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V13.5zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V18zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V18zm2.498-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zM8.25 6h7.5v2.25h-7.5V6zM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 002.25 2.25h10.5a2.25 2.25 0 002.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0012 2.25z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">Emily</h3>
            <p className="text-gray-600 mb-4">
              Provides pre-surgery anesthesia cost estimates for patients.
            </p>
            <div className="text-sm text-[#01B2D6] font-medium">
              Click to learn more →
            </div>
          </>
        )}

        {/* Expanded State */}
        {expandedCard === 'emily' && (
          <div className="max-w-6xl mx-auto">
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
                  <h3 className="text-4xl font-bold text-gray-900">Emily</h3>
                  <p className="text-lg text-gray-600">Pre-Service Anesthesia Cost Estimates</p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">About Cassidy</h4>
                  <p className="text-gray-600">
                    Emily helps patients understand what their anesthesia will cost before their scheduled surgery. She gathers procedure details, applies facility-specific pricing rules, and provides clear cost estimates for insured patients, self-pay patients, and cosmetic surgery cases.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Capabilities</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Pre-surgery anesthesia cost estimates</li>
                    <li>• Insurance vs. self-pay pricing calculations</li>
                    <li>• Facility-specific rate application</li>
                    <li>• Payment plan and financial assistance options</li>
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
                    handleExpandCard('emily');
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
                    {isRecording ? 'Emily is speaking...' : 'Listening...'}
                  </p>
                  
                  <p className="text-sm text-gray-500 text-center max-w-xs">
                    {isRecording 
                      ? 'Emily is providing your cost estimate...' 
                      : 'Tell Emily about your upcoming surgery'}
                  </p>
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                  <p className="text-sm">
                    {isConnecting ? 'Connecting...' : 'Click "Begin Conversation" to start'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        )}
      </>
    ) : null}
  </div>

  {/* Sarah - Medical Appointment Scheduling */}
  <div 
    onClick={() => !isConnected && handleExpandCard('sarah')}
    className={`agent-card ${startAnimation ? "animate" : ""} group relative bg-white rounded-2xl border border-gray-200 shadow-lg transition-all duration-700 cursor-pointer ${
      expandedCard === 'sarah' 
        ? 'md:col-span-4 p-6 md:p-12' 
        : 'p-4 md:p-6 h-full hover:shadow-2xl hover:-translate-y-1'
    } ${expandedCard && expandedCard !== 'sarah' ? 'hidden' : ''}`}
  >
    {!expandedCard || expandedCard === 'sarah' ? (
      <>
        {/* Collapsed State */}
        {expandedCard !== 'sarah' && (
          <>
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#01B2D6]/10 mb-4 group-hover:bg-[#01B2D6]/20 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-[#01B2D6]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">Sarah</h3>
            <p className="text-gray-600 mb-4">
              Handles medical appointment scheduling for practices and patients.
            </p>
            <div className="text-sm text-[#01B2D6] font-medium">
              Click to learn more →
            </div>
          </>
        )}

        {/* Expanded State */}
        {expandedCard === 'sarah' && (
          <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-12 items-start">
            {/* Left Side - Agent Info */}
            <div className="flex-1 md:max-w-md">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-[#01B2D6]/10">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-[#01B2D6]">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-4xl font-bold text-gray-900">Sarah</h3>
                  <p className="text-lg text-gray-600">Medical Appointment Scheduling</p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">About Courtney</h4>
                  <p className="text-gray-600">
                    Sarah handles appointment scheduling for medical practices, managing both inbound calls from patients and outbound calls to schedule appointments. She coordinates with calendar systems, confirms patient details, and handles rescheduling efficiently.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Capabilities</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Inbound and outbound appointment scheduling</li>
                    <li>• Inbound and outbound appointment scheduling</li>
                    <li>• Real-time calendar availability checks</li>
                    <li>• Insurance verification and referral management</li>
                    <li>• Automated reminders and rescheduling</li>
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
                    handleExpandCard('sarah');
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
                    {isRecording ? 'Sarah is speaking...' : 'Listening...'}
                  </p>
                  
                  <p className="text-sm text-gray-500 text-center max-w-xs">
                    {isRecording 
                      ? 'Sarah is finding available appointment times...' 
                      : 'Tell Sarah when you need an appointment'}
                  </p>
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                  <p className="text-sm">
                    {isConnecting ? 'Connecting...' : 'Click "Begin Conversation" to start'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        )}
      </>
    ) : null}
  </div>
  {/* Allison - Customer Service Agent */}
  <div 
    onClick={() => !isConnected && handleExpandCard('allison')}
    className={`agent-card ${startAnimation ? "animate" : ""} group relative bg-white rounded-2xl border border-gray-200 shadow-lg transition-all duration-700 cursor-pointer ${
      expandedCard === 'allison' 
        ? 'md:col-span-4 p-6 md:p-12' 
        : 'p-4 md:p-6 h-full hover:shadow-2xl hover:-translate-y-1'
    } ${expandedCard && expandedCard !== 'allison' ? 'hidden' : ''}`}
  >
    {!expandedCard || expandedCard === 'allison' ? (
      <>
        {/* Collapsed State */}
        {expandedCard !== 'allison' && (
          <>
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#01B2D6]/10 mb-4 group-hover:bg-[#01B2D6]/20 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-[#01B2D6]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">Allison</h3>
            <p className="text-gray-600 mb-4">
              General customer service agent ready to assist with any questions.
            </p>
            <div className="text-sm text-[#01B2D6] font-medium">
              Click to learn more →
            </div>
          </>
        )}

        {/* Expanded State */}
        {expandedCard === 'allison' && (
          <div className="max-w-6xl mx-auto">
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
                  <h3 className="text-4xl font-bold text-gray-900">Allison</h3>
                  <p className="text-lg text-gray-600">Customer Service Agent</p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">About Chloe</h4>
                  <p className="text-gray-600">
                    Allison is your friendly AI assistant, trained to handle customer inquiries with professionalism and care. She can help with general questions, provide information, and guide you through various processes.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Capabilities</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>• General billing and account inquiries</li>
                    <li>• Appointment scheduling assistance</li>
                    <li>• Practice information and directions</li>
                    <li>• After-hours call handling</li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-4">
                {!isConnected ? (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (false) {
                        alert('⚠️ Environment variables not configured!\n\nPlease add RETELL_API_KEY and NEXT_PUBLIC_RETELL_AGENT_ID to your .env.local file.\n\nSee ENV_SETUP.md for instructions.');
                        return;
                      }
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
                    handleExpandCard('allison');
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
                    {isRecording ? 'Allison is speaking...' : 'Listening...'}
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
        </div>
        )}
      </>
    ) : null}
  </div>

  {/* James - Eligibility & Benefits Verification */}
  <div 
    onClick={() => !isConnected && handleExpandCard('james')}
    className={`agent-card ${startAnimation ? "animate" : ""} group relative bg-white rounded-2xl border border-gray-200 shadow-lg transition-all duration-700 cursor-pointer ${
      expandedCard === 'james' 
        ? 'md:col-span-4 p-6 md:p-12' 
        : 'p-4 md:p-6 h-full hover:shadow-2xl hover:-translate-y-1'
    } ${expandedCard && expandedCard !== 'james' ? 'hidden' : ''}`}
  >
    {!expandedCard || expandedCard === 'james' ? (
      <>
        {/* Collapsed State */}
        {expandedCard !== 'james' && (
          <>
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#01B2D6]/10 mb-4 group-hover:bg-[#01B2D6]/20 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-[#01B2D6]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">James</h3>
            <p className="text-gray-600 mb-4">
              Verifies patient insurance eligibility and benefits before services.
            </p>
            <div className="text-sm text-[#01B2D6] font-medium">
              Click to learn more →
            </div>
          </>
        )}

        {/* Expanded State */}
        {expandedCard === 'james' && (
          <div className="max-w-6xl mx-auto">
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
                  <h3 className="text-4xl font-bold text-gray-900">James</h3>
                  <p className="text-lg text-gray-600">Eligibility & Benefits Verification</p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">About Cara</h4>
                  <p className="text-gray-600">
                    James specializes in calling insurance companies to verify patient coverage before services are rendered. She checks eligibility, benefits, deductibles, and in-network status to ensure accurate billing.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Capabilities</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Real-time insurance eligibility verification</li>
                    <li>• Benefits, deductibles, and coverage limits</li>
                    <li>• In-network vs. out-of-network status</li>
                    <li>• Secondary insurance coordination</li>
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
                    handleExpandCard('james');
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
                    {isRecording ? 'James is speaking...' : 'Listening...'}
                  </p>
                  
                  <p className="text-sm text-gray-500 text-center max-w-xs">
                    Try asking: "Can you show me how you verify insurance?" or "Walk me through an eligibility check"
                  </p>
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                  <p className="text-sm">
                    {isConnecting ? 'Connecting...' : 'Click "Begin Conversation" to start'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        )}
      </>
    ) : null}
  </div>

  {/* Carly - Prior Authorization Follow-Up */}
  <div 
      onClick={() => !isConnected && handleExpandCard('olivia')}
      className={`agent-card ${startAnimation ? "animate" : ""} group relative bg-white rounded-2xl border border-gray-200 shadow-lg transition-all duration-700 cursor-pointer ${
        expandedCard === 'olivia' 
          ? 'md:col-span-4 p-6 md:p-12' 
          : 'p-4 md:p-6 h-full hover:shadow-2xl hover:-translate-y-1'
      } ${expandedCard && expandedCard !== 'olivia' ? 'hidden' : ''}`}
    >
    {!expandedCard || expandedCard === 'olivia' ? (
      <>
        {/* Collapsed State */}
        {expandedCard !== 'olivia' && (
          <>
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#01B2D6]/10 mb-4 group-hover:bg-[#01B2D6]/20 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-[#01B2D6]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">Olivia</h3>
            <p className="text-gray-600 mb-4">
              Tracks prior authorization approvals and expedites urgent cases.
            </p>
            <div className="text-sm text-[#01B2D6] font-medium">
              Click to learn more →
            </div>
          </>
        )}

        {/* Expanded State */}
        {expandedCard === 'olivia' && (
          <div className="max-w-6xl mx-auto">
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
                  <h3 className="text-4xl font-bold text-gray-900">Olivia</h3>
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
                    <li>• Prior authorization status tracking</li>
                    <li>• Expedited review requests for urgent cases</li>
                    <li>• Denial reason documentation and appeals</li>
                    <li>• Authorization number and validity tracking</li>
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
                    handleExpandCard('olivia');
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
                    {isRecording ? 'Olivia is speaking...' : 'Listening...'}
                  </p>
                  
                  <p className="text-sm text-gray-500 text-center max-w-xs">
                    Try asking: "Can you check on a prior auth?" or "Show me how you handle an urgent case"
                  </p>
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                  <p className="text-sm">
                    {isConnecting ? 'Connecting...' : 'Click "Begin Conversation" to start'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        )}
      </>
    ) : null}
    </div>

    {/* Michael - Payment Reconciliation */}
    <div 
      onClick={() => !isConnected && handleExpandCard('michael')}
      className={`agent-card ${startAnimation ? "animate" : ""} group relative bg-white rounded-2xl border border-gray-200 shadow-lg transition-all duration-700 cursor-pointer ${
        expandedCard === 'michael' 
          ? 'md:col-span-4 p-6 md:p-12'
          : 'p-4 md:p-6 h-full hover:shadow-2xl hover:-translate-y-1'
      } ${expandedCard && expandedCard !== 'michael' ? 'hidden' : ''}`}
  >
    {!expandedCard || expandedCard === 'michael' ? (
      <>
        {/* Collapsed State */}
        {expandedCard !== 'michael' && (
          <>
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#01B2D6]/10 mb-4 group-hover:bg-[#01B2D6]/20 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-[#01B2D6]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">Michael</h3>
            <p className="text-gray-600 mb-4">
              Tracks down payment discrepancies and resolves missing or incorrect payments.
            </p>
            <div className="text-sm text-[#01B2D6] font-medium">
              Click to learn more →
            </div>
          </>
        )}

        {/* Expanded State */}
        {expandedCard === 'michael' && (
          <div className="max-w-6xl mx-auto">
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
                  <h3 className="text-4xl font-bold text-gray-900">Michael</h3>
                  <p className="text-lg text-gray-600">Payment Reconciliation</p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">About Carson</h4>
                  <p className="text-gray-600">
                    Michael is your financial detective, specializing in tracking down and resolving payment discrepancies with insurance companies. He investigates missing payments, partial payments, incorrect amounts, and overpayments to ensure every dollar is accounted for.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Capabilities</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Missing payment investigation and recovery</li>
                    <li>• Payment discrepancy resolution with carriers</li>
                    <li>• Check trace and reissue requests</li>
                    <li>• EOB retrieval and overpayment refunds</li>
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
                    handleExpandCard('michael');
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
                    {isRecording ? 'Michael is speaking...' : 'Listening...'}
                  </p>
                  
                  <p className="text-sm text-gray-500 text-center max-w-xs">
                    Try asking: "Can you track down a missing payment?" or "Show me how you resolve a discrepancy"
                  </p>
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                  <p className="text-sm">
                    {isConnecting ? 'Connecting...' : 'Click "Begin Conversation" to start'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        )}
      </>
    ) : null}
  </div>

        </div>
      </div>
    </div>
  )
}
