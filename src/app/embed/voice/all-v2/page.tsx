

'use client';

import { useState, useEffect } from 'react';
import type { CSSProperties } from 'react';
import { useRetellAgent } from '@/hooks/useRetellAgent';
import { useRateLimit } from '@/hooks/useRateLimit';
import { AGENTS } from '@/config/agents';
import Orb from '@/components/Orb';

declare global {
  interface Window {
    __cosentusVoiceAgentsAnimated?: boolean;
  }
}

// Add global styles for animations (match chat embed)
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
  `;
  if (!document.head.querySelector('style[data-voice-animations]')) {
    style.setAttribute('data-voice-animations', 'true');
    document.head.appendChild(style);
  }
}

export default function AllVoiceAgents() {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [activeAgent, setActiveAgent] = useState<'allison' | 'cindy' | 'chris' | 'james' | 'olivia' | 'michael' | 'emily' | 'sarah' | null>(null);
  const [aboutExpanded, setAboutExpanded] = useState(false);
  const [capabilitiesExpanded, setCapabilitiesExpanded] = useState(false);

  // Only animate cards once per page load (prevents "second ripple" on remount/hydration)
  const [shouldAnimateCards] = useState(() => {
    if (typeof window === 'undefined') return true;
    return !window.__cosentusVoiceAgentsAnimated;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.__cosentusVoiceAgentsAnimated = true;
    }
  }, []);

  // Reset collapsible sections when card changes
  useEffect(() => {
    setAboutExpanded(false);
    setCapabilitiesExpanded(false);
  }, [expandedCard]);

  const cardAnimationStyle = (index: number): CSSProperties | undefined => {
    if (!shouldAnimateCards) return undefined;
    return {
      // Fast fade in when cards appear
      animation: `fadeInUp 0.4s ease-out ${index * 0.05}s both`,
    };
  };

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

  const { rateLimitState, recordCall } = useRateLimit();

  const handleExpandCard = (cardId: string) => {
    if (expandedCard === cardId) {
      // Fade out expanded card, then show all cards
      const expandedCardEl = document.querySelector('.agent-card:not(.hidden)') as HTMLElement;
      if (expandedCardEl) {
        expandedCardEl.style.transition = 'opacity 300ms ease-out';
        expandedCardEl.style.opacity = '0';
        setTimeout(() => {
      setExpandedCard(null);
      setActiveAgent(null);
      if (isConnected) {
        disconnect();
          }
        }, 300);
      } else {
        setExpandedCard(null);
        setActiveAgent(null);
        if (isConnected) {
          disconnect();
        }
      }
    } else {
      setExpandedCard(cardId);
      setActiveAgent(cardId as 'allison' | 'cindy' | 'chris' | 'james' | 'olivia' | 'michael' | 'emily' | 'sarah');
    }
  };

  const handleBeginDemo = async () => {
    try {
      // Check client-side rate limit first (friction layer)
      if (!rateLimitState.allowed) {
        alert(rateLimitState.message || 'Please wait before starting another conversation.');
        return;
      }

      // Check if getUserMedia is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('Your browser does not support microphone access. Please use a modern browser like Chrome, Firefox, Safari, or Edge.');
        return;
      }

      // Request microphone permission first
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Stop the test stream immediately (we just needed to check permission)
      stream.getTracks().forEach(track => track.stop());
      
      // Record the call attempt (before connecting - if connection fails, we still count it as attempt)
      recordCall();
      
      // Now start the actual call
      await connect();
    } catch (err: any) {
      console.error('Connection error:', err);
      
      // Check if it's a rate limit error from backend
      if (err.message && (
        err.message.includes('Too many') || 
        err.message.includes('wait') || 
        err.message.includes('rate limit') ||
        err.message.includes('429')
      )) {
        // Backend rate limit - show the error message from backend
        alert(err.message || 'Too many demo attempts. Please wait before trying again.');
        return;
      }
      
      // Provide specific error messages for microphone errors
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        alert('Microphone access was denied. Please allow microphone access in your browser settings and try again.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        alert('No microphone found. Please connect a microphone and try again.');
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        alert('Your microphone is being used by another application. Please close other apps using the microphone and try again.');
      } else if (err.name === 'SecurityError') {
        alert('Microphone access is blocked. This iframe needs the "allow=microphone" attribute. Please contact the website administrator.');
      } else {
        // Generic error - could be connection error, rate limit, etc.
        alert(err.message || 'Failed to start conversation. Please try again.');
      }
    }
  };

  const handleEndDemo = () => {
    disconnect();
    setActiveAgent(null);
  };

  return (
    <div className="min-h-screen pt-16 pb-4 px-3 md:pt-20 md:pb-8 md:px-8 bg-transparent">

      <style>{`
        .animated-border-card {
          position: relative !important;
          overflow: hidden !important;
          border: none !important;
          background: #01B2D6 !important;
          filter: drop-shadow(0 0 25px rgba(0, 0, 0, 0.12));
        }
        
        .animated-border-card::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 300%;
          height: 300%;
          background: conic-gradient(
            from 0deg,
            transparent 0%,
            transparent 30%,
            rgba(255, 255, 255, 0.12) 37%,
            rgba(255, 255, 255, 0.25) 42%,
            rgba(255, 255, 255, 0.35) 46%,
            rgba(255, 255, 255, 0.35) 54%,
            rgba(255, 255, 255, 0.25) 58%,
            rgba(255, 255, 255, 0.12) 63%,
            transparent 70%,
            transparent 100%
          );
          transform: translate(-50%, -50%) rotate(0deg);
          animation: border-spin 10s linear infinite;
          z-index: 0;
          pointer-events: none;
        }
        
        .animated-border-card::after {
          content: '';
          position: absolute;
          inset: 3px;
          background: white;
          border-radius: 14px;
          z-index: 1;
          pointer-events: none;
        }
        
        .animated-border-card > * {
          position: relative;
          z-index: 2;
        }
        
        @keyframes border-spin {
          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }
      `}</style>
      <div className="max-w-[872px] mx-auto relative">
        {/* Logo - Top Right of Grid */}
        <img 
          src="/cosentu-white-logo.png" 
          alt="Cosentus" 
          className="absolute -top-8 right-0 w-28 md:-top-12 md:w-48 z-[100]"
        />
        {/* Instruction Text - Top Left (Desktop Only) */}
        {!expandedCard && (
          <p className="absolute -top-8 left-0 text-black text-xs md:-top-12 md:text-sm font-medium z-[100] hidden md:block">
            Click any agent to learn more
          </p>
        )}
        <div className="flex flex-wrap gap-4 md:gap-6 justify-center">
  {/* Cindy - Payment & Balance Agent */}
  <div 
    onClick={() => !isConnected && handleExpandCard('cindy')}
    style={cardAnimationStyle(0)}
    className={`agent-card group relative bg-white rounded-2xl shadow-lg transition-opacity duration-300 cursor-pointer ${
      expandedCard === 'cindy' 
        ? 'w-full p-4 md:p-12 animated-border-card' 
        : 'w-[calc((100%-1rem)/2-12px)] md:w-[200px] h-[241px] md:h-64 hover:shadow-2xl hover:-translate-y-1 overflow-hidden'
    } ${expandedCard && expandedCard !== 'cindy' ? 'hidden' : ''}`}
  >
    {!expandedCard || expandedCard === 'cindy' ? (
      <>
        {/* Collapsed State */}
        {expandedCard !== 'cindy' && (
          <div className="flex flex-col h-full">
            {/* Avatar - takes most of card space */}
            <div className="h-[80%] md:h-[230px] overflow-hidden">
            <img 
              src="/avatar-cindy.png" 
              alt="Cindy" 
                className="w-full h-full object-contain scale-[1.07] md:scale-[1.06]"
              />
            </div>
            
            {/* Blue strip at bottom */}
            <div className="bg-[#01B2D6] py-2.5 px-4 text-center flex-1 flex flex-col justify-center">
              <h3 className="text-white text-sm md:text-base font-bold mb-0.5">CINDY</h3>
              <p className="text-white text-[10px] md:text-xs mb-1.5">Patient Support</p>
              <p className="text-white text-[10px] opacity-80 md:hidden">Click to learn more →</p>
            </div>
          </div>
        )}

        {/* Expanded State */}
        {expandedCard === 'cindy' && (
          <div className="max-w-6xl mx-auto">
          {/* Mobile Layout */}
          <div className="md:hidden flex flex-col h-[500px]">
            {/* Header with Close X */}
            <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-white">
              <div className="flex items-center gap-2">
                <img 
                  src="/avatar-cindy.png" 
                  alt="Cindy" 
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Cindy</h3>
                  <p className="text-sm text-gray-600">Payment & Balance</p>
                </div>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleExpandCard('cindy');
                }}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Status Bar */}
            <div className="px-3 py-2 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center gap-2 text-[11px]">
                <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`} />
                <span className="text-gray-700">
                  {isConnected ? (isRecording ? 'Speaking...' : 'Listening...') : 'Ready to start'}
                </span>
              </div>
            </div>

            {/* Content - All visible, no scrolling */}
            <div className="flex-1 px-3 py-3 overflow-y-auto bg-white">
              <div className="space-y-3">
                {/* About */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">About</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Cindy is multilingual and can handle over 20 phone calls at once. She specializes in helping patients understand their outstanding balances and payment options with clear, empathetic assistance.
                  </p>
                </div>

                {/* Capabilities */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">Capabilities</h4>
                  <ul className="text-sm text-gray-600 space-y-1 leading-relaxed">
                    <li>• Real-time balance inquiries and payment history</li>
                    <li>• Secure credit card payment processing</li>
                    <li>• Balance breakdown by date of service</li>
                    <li>• Insurance coverage explanations</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Fixed Bottom Button */}
            <div className="p-3 border-t border-gray-200 bg-white">
              {!isConnected ? (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBeginDemo();
                  }}
                  disabled={isConnecting}
                  className="w-full py-2.5 bg-[#01B2D6] text-white rounded-lg text-sm font-semibold hover:bg-[#0195b3] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isConnecting ? (
                    <>
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Connecting...
                    </>
                  ) : (
                    'Begin Conversation'
                  )}
                </button>
              ) : (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEndDemo();
                  }}
                  className="w-full py-2.5 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors"
                >
                  End Conversation
                </button>
              )}
            </div>
          </div>

          {/* Desktop Layout - Magazine/Editorial */}
          <div className="hidden md:block">
            {/* Close X - Top Right */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleExpandCard('cindy');
              }}
              className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-colors z-10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {/* Top Row: Header + Orb */}
            <div className="flex items-start justify-between">
              {/* Left: Avatar + Name */}
              <div className="flex items-center gap-5">
                <img 
                  src="/avatar-cindy.png" 
                  alt="Cindy" 
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-4xl font-bold text-gray-900">Cindy</h3>
                  <p className="text-lg text-gray-500 mt-1">Payment & Balance Specialist</p>
                  <div className="mt-3 w-48 h-[2px] bg-[#01B2D6]" />
                </div>
              </div>

              </div>
            
            {/* Content: Description (left) + Orb/Status (right) */}
            <div className="flex items-center mt-2 mb-6 gap-8">
              {/* Left Half - Description */}
              <div className="w-1/2">
                <p className="text-gray-600 text-base leading-relaxed">
                    Cindy is multilingual and can handle over 20 phone calls at once. She specializes in helping patients understand their outstanding balances and payment options with clear, empathetic assistance.
                  </p>
                </div>
              
              {/* Right Half - Orb / Status */}
              <div className="w-1/2 flex flex-col items-center justify-center min-h-[200px]">
                {isConnected ? (
                  <>
                    <div style={{ width: '160px', height: '160px', position: 'relative', background: '#ffffff', borderRadius: '50%' }}>
                      <Orb 
                        hue={55}
                        hoverIntensity={0.22}
                        rotateOnHover={true}
                        forceHoverState={false}
                        backgroundColor="#ffffff"
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-3">
                      {isRecording ? 'Cindy is speaking...' : 'Listening...'}
                    </p>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                    </svg>
                    <p className="text-sm">{isConnecting ? 'Connecting...' : 'Ready to start'}</p>
                  </div>
                )}
                </div>
              </div>

            {/* Capabilities */}
            <div className="grid grid-cols-2 gap-x-10 gap-y-4 mb-6 bg-gray-100 rounded-xl p-6">
              <div className="flex items-center gap-3">
                <span className="text-[#01B2D6] font-light text-lg">|</span>
                <span className="text-gray-600 text-sm">Real-time balance inquiries and payment history</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#01B2D6] font-light text-lg">|</span>
                <span className="text-gray-600 text-sm">Secure credit card payment processing</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#01B2D6] font-light text-lg">|</span>
                <span className="text-gray-600 text-sm">Balance breakdown by date of service</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#01B2D6] font-light text-lg">|</span>
                <span className="text-gray-600 text-sm">Insurance coverage explanations</span>
              </div>
            </div>
            
            {/* Divider */}
            <div className="border-t border-gray-200 my-6" />
            
            {/* Buttons - spread apart */}
            <div className="flex justify-between items-center">
                {!isConnected ? (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBeginDemo();
                    }}
                    disabled={isConnecting}
                  className="px-8 py-4 bg-[#01B2D6] text-white rounded-xl text-lg font-semibold hover:bg-[#0195b3] transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {isConnecting ? (
                      <>
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Connecting...
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
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
                  className="px-8 py-4 bg-red-500 text-white rounded-xl text-lg font-semibold hover:bg-red-600 transition-colors"
                  >
                    End Conversation
                  </button>
                )}
            </div>

            {/* Error Display */}
              {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">
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
    style={cardAnimationStyle(1)}
    className={`agent-card group relative bg-white rounded-2xl shadow-lg transition-opacity duration-300 cursor-pointer ${
      expandedCard === 'chris' 
        ? 'w-full p-4 md:p-12 animated-border-card' 
        : 'w-[calc((100%-1rem)/2-12px)] md:w-[200px] h-[241px] md:h-64 hover:shadow-2xl hover:-translate-y-1 overflow-hidden'
    } ${expandedCard && expandedCard !== 'chris' ? 'hidden' : ''}`}
  >
    {!expandedCard || expandedCard === 'chris' ? (
      <>
        {/* Collapsed State */}
        {expandedCard !== 'chris' && (
          <div className="flex flex-col h-full">
            {/* Avatar - takes most of card space */}
            <div className="h-[80%] md:h-[230px] overflow-hidden">
            <img 
              src="/avatar-michael.png" 
              alt="Chris" 
                className="w-full h-full object-contain scale-[1.07] md:scale-[1.06]"
              />
            </div>
            
            {/* Blue strip at bottom */}
            <div className="bg-[#01B2D6] py-2.5 px-4 text-center flex-1 flex flex-col justify-center">
              <h3 className="text-white text-sm md:text-base font-bold mb-0.5">CHRIS</h3>
              <p className="text-white text-[10px] md:text-xs mb-1.5">Claims Follow-Up</p>
              <p className="text-white text-[10px] opacity-80 md:hidden">Click to learn more →</p>
            </div>
          </div>
        )}

        {/* Expanded State */}
        {expandedCard === 'chris' && (
          <div className="max-w-6xl mx-auto">
          {/* Mobile Layout */}
          <div className="md:hidden flex flex-col h-[500px]">
            {/* Header with Close X */}
            <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-white">
              <div className="flex items-center gap-2">
                <img 
                  src="/avatar-michael.png" 
                  alt="Chris" 
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Chris</h3>
                  <p className="text-sm text-gray-600">Insurance Claims</p>
                </div>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleExpandCard('chris');
                }}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Status Bar */}
            <div className="px-3 py-2 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center gap-2 text-[11px]">
                <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`} />
                <span className="text-gray-700">
                  {isConnected ? (isRecording ? 'Speaking...' : 'Listening...') : 'Ready to start'}
                </span>
              </div>
            </div>

            {/* Content - All visible, no scrolling */}
            <div className="flex-1 px-3 py-3 overflow-y-auto bg-white">
              <div className="space-y-3">
                {/* About */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">About</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Chris specializes in calling insurance companies to follow up on claim statuses, resolve denials, and gather information needed for billing. He navigates complex phone systems and speaks naturally with insurance representatives.
                  </p>
                </div>

                {/* Capabilities */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">Capabilities</h4>
                  <ul className="text-sm text-gray-600 space-y-1 leading-relaxed">
                    <li>• Outbound claim status follow-ups with carriers</li>
                    <li>• Denial investigation and appeal preparation</li>
                    <li>• Missing information requests and documentation</li>
                    <li>• Timely filing deadline tracking</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Fixed Bottom Button */}
            <div className="p-3 border-t border-gray-200 bg-white">
              {!isConnected ? (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBeginDemo();
                  }}
                  disabled={isConnecting}
                  className="w-full py-2.5 bg-[#01B2D6] text-white rounded-lg text-sm font-semibold hover:bg-[#0195b3] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isConnecting ? (
                    <>
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Connecting...
                    </>
                  ) : (
                    'Begin Conversation'
                  )}
                </button>
              ) : (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEndDemo();
                  }}
                  className="w-full py-2.5 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors"
                >
                  End Conversation
                </button>
              )}
            </div>
          </div>

          {/* Desktop Layout - Magazine/Editorial */}
          <div className="hidden md:block">
            {/* Close X - Top Right */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleExpandCard('chris');
              }}
              className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-colors z-10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {/* Top Row: Header + Orb */}
            <div className="flex items-start justify-between">
              {/* Left: Avatar + Name */}
              <div className="flex items-center gap-5">
                <img 
                  src="/avatar-michael.png" 
                  alt="Chris" 
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-4xl font-bold text-gray-900">Chris</h3>
                  <p className="text-lg text-gray-500 mt-1">Insurance Claim Specialist</p>
                  <div className="mt-3 w-48 h-[2px] bg-[#01B2D6]" />
                </div>
              </div>

              </div>
            
            {/* Content: Description (left) + Orb/Status (right) */}
            <div className="flex items-center mt-2 mb-6 gap-8">
              {/* Left Half - Description */}
              <div className="w-1/2">
                <p className="text-gray-600 text-base leading-relaxed">
                    Chris specializes in calling insurance companies to follow up on claim statuses, resolve denials, and gather information needed for billing. He navigates complex phone systems and speaks naturally with insurance representatives.
                  </p>
                </div>
              
              {/* Right Half - Orb / Status */}
              <div className="w-1/2 flex flex-col items-center justify-center min-h-[200px]">
                {isConnected ? (
                  <>
                    <div style={{ width: '160px', height: '160px', position: 'relative', background: '#ffffff', borderRadius: '50%' }}>
                      <Orb 
                        hue={55}
                        hoverIntensity={0.22}
                        rotateOnHover={true}
                        forceHoverState={false}
                        backgroundColor="#ffffff"
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-3">
                      {isRecording ? 'Chris is speaking...' : 'Listening...'}
                    </p>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                    </svg>
                    <p className="text-sm">{isConnecting ? 'Connecting...' : 'Ready to start'}</p>
                  </div>
                )}
                </div>
              </div>

            {/* Capabilities */}
            <div className="grid grid-cols-2 gap-x-10 gap-y-4 mb-6 bg-gray-100 rounded-xl p-6">
              <div className="flex items-center gap-3">
                <span className="text-[#01B2D6] font-light text-lg">|</span>
                <span className="text-gray-600 text-sm">Outbound claim status follow-ups with carriers</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#01B2D6] font-light text-lg">|</span>
                <span className="text-gray-600 text-sm">Denial investigation and appeal preparation</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#01B2D6] font-light text-lg">|</span>
                <span className="text-gray-600 text-sm">Missing information requests and documentation</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#01B2D6] font-light text-lg">|</span>
                <span className="text-gray-600 text-sm">Timely filing deadline tracking</span>
              </div>
            </div>
            
            {/* Divider */}
            <div className="border-t border-gray-200 my-6" />
            
            {/* Buttons - spread apart */}
            <div className="flex justify-between items-center">
                {!isConnected ? (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBeginDemo();
                    }}
                    disabled={isConnecting}
                  className="px-8 py-4 bg-[#01B2D6] text-white rounded-xl text-lg font-semibold hover:bg-[#0195b3] transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {isConnecting ? (
                      <>
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Connecting...
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
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
                  className="px-8 py-4 bg-red-500 text-white rounded-xl text-lg font-semibold hover:bg-red-600 transition-colors"
                  >
                    End Conversation
                  </button>
                )}
            </div>

            {/* Error Display */}
              {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">
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

  {/* Emily - Pre-Service Anesthesia Cost Estimates */}
  <div 
    onClick={() => !isConnected && handleExpandCard('emily')}
    style={cardAnimationStyle(2)}
    className={`agent-card group relative bg-white rounded-2xl shadow-lg transition-opacity duration-300 cursor-pointer ${
      expandedCard === 'emily' 
        ? 'w-full p-4 md:p-12 animated-border-card' 
        : 'w-[calc((100%-1rem)/2-12px)] md:w-[200px] h-[241px] md:h-64 hover:shadow-2xl hover:-translate-y-1 overflow-hidden'
    } ${expandedCard && expandedCard !== 'emily' ? 'hidden' : ''}`}
  >
    {!expandedCard || expandedCard === 'emily' ? (
      <>
        {/* Collapsed State */}
        {expandedCard !== 'emily' && (
          <div className="flex flex-col h-full">
            {/* Avatar - takes most of card space */}
            <div className="h-[80%] md:h-[230px] overflow-hidden">
            <img 
              src="/avatar-emily.png" 
              alt="Emily" 
                className="w-full h-full object-contain scale-[1.07] md:scale-[1.06]"
              />
            </div>
            
            {/* Blue strip at bottom */}
            <div className="bg-[#01B2D6] py-2.5 px-4 text-center flex-1 flex flex-col justify-center">
              <h3 className="text-white text-sm md:text-base font-bold mb-0.5">EMILY</h3>
              <p className="text-white text-[10px] md:text-xs mb-1.5">Cost Estimation</p>
              <p className="text-white text-[10px] opacity-80 md:hidden">Click to learn more →</p>
            </div>
          </div>
        )}

        {/* Expanded State */}
        {expandedCard === 'emily' && (
          <div className="max-w-6xl mx-auto">
          {/* Mobile Layout */}
          <div className="md:hidden flex flex-col h-[500px]">
            {/* Header with Close X */}
            <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-white">
              <div className="flex items-center gap-2">
                <img 
                  src="/avatar-emily.png" 
                  alt="Emily" 
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Emily</h3>
                  <p className="text-sm text-gray-600">Anesthesia Estimates</p>
                </div>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleExpandCard('emily');
                }}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Status Bar */}
            <div className="px-3 py-2 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center gap-2 text-[11px]">
                <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`} />
                <span className="text-gray-700">
                  {isConnected ? (isRecording ? 'Speaking...' : 'Listening...') : 'Ready to start'}
                </span>
              </div>
            </div>

            {/* Content - All visible, no scrolling */}
            <div className="flex-1 px-3 py-3 overflow-y-auto bg-white">
              <div className="space-y-3">
                {/* About */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">About</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Emily helps patients understand what their anesthesia will cost before their scheduled surgery. She gathers procedure details, applies facility-specific pricing rules, and provides clear cost estimates for insured patients, self-pay patients, and cosmetic surgery cases.
                  </p>
                </div>

                {/* Capabilities */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">Capabilities</h4>
                  <ul className="text-sm text-gray-600 space-y-1 leading-relaxed">
                    <li>• Pre-surgery anesthesia cost estimates</li>
                    <li>• Insurance vs. self-pay pricing calculations</li>
                    <li>• Facility-specific rate application</li>
                    <li>• Payment plan and financial assistance options</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Fixed Bottom Button */}
            <div className="p-3 border-t border-gray-200 bg-white">
              {!isConnected ? (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBeginDemo();
                  }}
                  disabled={isConnecting}
                  className="w-full py-2.5 bg-[#01B2D6] text-white rounded-lg text-sm font-semibold hover:bg-[#0195b3] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isConnecting ? (
                    <>
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Connecting...
                    </>
                  ) : (
                    'Begin Conversation'
                  )}
                </button>
              ) : (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEndDemo();
                  }}
                  className="w-full py-2.5 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors"
                >
                  End Conversation
                </button>
              )}
            </div>
          </div>

          {/* Desktop Layout - Magazine/Editorial */}
          <div className="hidden md:block">
            {/* Close X - Top Right */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleExpandCard('emily');
              }}
              className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-colors z-10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {/* Top Row: Header + Orb */}
            <div className="flex items-start justify-between">
              {/* Left: Avatar + Name */}
              <div className="flex items-center gap-5">
                <img 
                  src="/avatar-emily.png" 
                  alt="Emily" 
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-4xl font-bold text-gray-900">Emily</h3>
                  <p className="text-lg text-gray-500 mt-1">Pre-Service Anesthesia Cost Estimates</p>
                  <div className="mt-3 w-48 h-[2px] bg-[#01B2D6]" />
                </div>
              </div>

              </div>
            
            {/* Content: Description (left) + Orb/Status (right) */}
            <div className="flex items-center mt-2 mb-6 gap-8">
              {/* Left Half - Description */}
              <div className="w-1/2">
                <p className="text-gray-600 text-base leading-relaxed">
                    Emily helps patients understand what their anesthesia will cost before their scheduled surgery. She gathers procedure details, applies facility-specific pricing rules, and provides clear cost estimates for insured patients, self-pay patients, and cosmetic surgery cases.
                  </p>
                </div>
              
              {/* Right Half - Orb / Status */}
              <div className="w-1/2 flex flex-col items-center justify-center min-h-[200px]">
                {isConnected ? (
                  <>
                    <div style={{ width: '160px', height: '160px', position: 'relative', background: '#ffffff', borderRadius: '50%' }}>
                      <Orb 
                        hue={55}
                        hoverIntensity={0.22}
                        rotateOnHover={true}
                        forceHoverState={false}
                        backgroundColor="#ffffff"
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-3">
                      {isRecording ? 'Emily is speaking...' : 'Listening...'}
                    </p>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                    </svg>
                    <p className="text-sm">{isConnecting ? 'Connecting...' : 'Ready to start'}</p>
                  </div>
                )}
                </div>
              </div>

            {/* Capabilities */}
            <div className="grid grid-cols-2 gap-x-10 gap-y-4 mb-6 bg-gray-100 rounded-xl p-6">
              <div className="flex items-center gap-3">
                <span className="text-[#01B2D6] font-light text-lg">|</span>
                <span className="text-gray-600 text-sm">Pre-surgery anesthesia cost estimates</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#01B2D6] font-light text-lg">|</span>
                <span className="text-gray-600 text-sm">Insurance vs. self-pay pricing calculations</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#01B2D6] font-light text-lg">|</span>
                <span className="text-gray-600 text-sm">Facility-specific rate application</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#01B2D6] font-light text-lg">|</span>
                <span className="text-gray-600 text-sm">Payment plan and financial assistance options</span>
              </div>
            </div>
            
            {/* Divider */}
            <div className="border-t border-gray-200 my-6" />
            
            {/* Buttons - spread apart */}
            <div className="flex justify-between items-center">
                {!isConnected ? (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBeginDemo();
                    }}
                    disabled={isConnecting}
                  className="px-8 py-4 bg-[#01B2D6] text-white rounded-xl text-lg font-semibold hover:bg-[#0195b3] transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {isConnecting ? (
                      <>
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Connecting...
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
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
                  className="px-8 py-4 bg-red-500 text-white rounded-xl text-lg font-semibold hover:bg-red-600 transition-colors"
                  >
                    End Conversation
                  </button>
                )}
            </div>

            {/* Error Display */}
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">
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

  {/* Sarah - Medical Appointment Scheduling */}
  <div 
    onClick={() => !isConnected && handleExpandCard('sarah')}
    style={cardAnimationStyle(3)}
    className={`agent-card group relative bg-white rounded-2xl shadow-lg transition-opacity duration-300 cursor-pointer ${
      expandedCard === 'sarah' 
        ? 'w-full p-4 md:p-12 animated-border-card' 
        : 'w-[calc((100%-1rem)/2-12px)] md:w-[200px] h-[241px] md:h-64 hover:shadow-2xl hover:-translate-y-1 overflow-hidden'
    } ${expandedCard && expandedCard !== 'sarah' ? 'hidden' : ''}`}
  >
    {!expandedCard || expandedCard === 'sarah' ? (
      <>
        {/* Collapsed State */}
        {expandedCard !== 'sarah' && (
          <div className="flex flex-col h-full">
            {/* Avatar - takes most of card space */}
            <div className="h-[80%] md:h-[230px] overflow-hidden">
            <img 
              src="/avatar-sarah.png" 
              alt="Sarah" 
                className="w-full h-full object-contain scale-[1.07] md:scale-[1.06]"
              />
            </div>
            
            {/* Blue strip at bottom */}
            <div className="bg-[#01B2D6] py-2.5 px-4 text-center flex-1 flex flex-col justify-center">
              <h3 className="text-white text-sm md:text-base font-bold mb-0.5">SARAH</h3>
              <p className="text-white text-[10px] md:text-xs mb-1.5">Appt. Scheduling</p>
              <p className="text-white text-[10px] opacity-80 md:hidden">Click to learn more →</p>
            </div>
          </div>
        )}

        {/* Expanded State */}
        {expandedCard === 'sarah' && (
          <div className="max-w-6xl mx-auto">
          {/* Mobile Layout */}
          <div className="md:hidden flex flex-col h-[500px]">
            {/* Header with Close X */}
            <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-white">
              <div className="flex items-center gap-3">
                <img 
                  src="/avatar-sarah.png" 
                  alt="Sarah" 
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Sarah</h3>
                  <p className="text-sm text-gray-600">Appointment Scheduling</p>
                </div>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleExpandCard('sarah');
                }}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Status Bar */}
            <div className="px-3 py-2 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center gap-2 text-[11px]">
                <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`} />
                <span className="text-gray-700">
                  {isConnected ? (isRecording ? 'Sarah Speaking...' : 'Listening...') : 'Ready to start'}
                </span>
              </div>
            </div>

            {/* Content - All visible, no scrolling */}
            <div className="flex-1 px-3 py-3 overflow-y-auto bg-white">
              <div className="space-y-3">
                {/* About */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">About</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Sarah handles appointment scheduling for medical practices, managing both inbound calls from patients and outbound calls to schedule appointments. She coordinates with calendar systems, confirms patient details, and handles rescheduling efficiently.
                  </p>
                </div>

                {/* Capabilities */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">Capabilities</h4>
                  <ul className="text-sm text-gray-600 space-y-1 leading-relaxed">
                    <li>• Inbound and outbound appointment scheduling</li>
                    <li>• Real-time calendar availability checks</li>
                    <li>• Insurance verification and referral management</li>
                    <li>• Automated reminders and rescheduling</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Fixed Bottom Button */}
            <div className="p-3 border-t border-gray-200 bg-white">
              {!isConnected ? (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBeginDemo();
                  }}
                  disabled={isConnecting}
                  className="w-full py-2.5 bg-[#01B2D6] text-white rounded-lg text-sm font-semibold hover:bg-[#0195b3] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isConnecting ? (
                    <>
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Connecting...
                    </>
                  ) : (
                    'Begin Conversation'
                  )}
                </button>
              ) : (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEndDemo();
                  }}
                  className="w-full py-2.5 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors"
                >
                  End Conversation
                </button>
              )}
            </div>
          </div>

          {/* Desktop Layout - Magazine/Editorial */}
          <div className="hidden md:block">
            {/* Close X - Top Right */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleExpandCard('sarah');
              }}
              className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-colors z-10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {/* Top Row: Header + Orb */}
            <div className="flex items-start justify-between">
              {/* Left: Avatar + Name */}
              <div className="flex items-center gap-5">
                <img 
                  src="/avatar-sarah.png" 
                  alt="Sarah" 
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-4xl font-bold text-gray-900">Sarah</h3>
                  <p className="text-lg text-gray-500 mt-1">Medical Appointment Scheduling</p>
                  <div className="mt-3 w-48 h-[2px] bg-[#01B2D6]" />
                </div>
              </div>

              </div>
            
            {/* Content: Description (left) + Orb/Status (right) */}
            <div className="flex items-center mt-2 mb-6 gap-8">
              {/* Left Half - Description */}
              <div className="w-1/2">
                <p className="text-gray-600 text-base leading-relaxed">
                    Sarah handles appointment scheduling for medical practices, managing both inbound calls from patients and outbound calls to schedule appointments. She coordinates with calendar systems, confirms patient details, and handles rescheduling efficiently.
                  </p>
                </div>
              
              {/* Right Half - Orb / Status */}
              <div className="w-1/2 flex flex-col items-center justify-center min-h-[200px]">
                {isConnected ? (
                  <>
                    <div style={{ width: '160px', height: '160px', position: 'relative', background: '#ffffff', borderRadius: '50%' }}>
                      <Orb 
                        hue={55}
                        hoverIntensity={0.22}
                        rotateOnHover={true}
                        forceHoverState={false}
                        backgroundColor="#ffffff"
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-3">
                      {isRecording ? 'Sarah is speaking...' : 'Listening...'}
                    </p>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                    </svg>
                    <p className="text-sm">{isConnecting ? 'Connecting...' : 'Ready to start'}</p>
                  </div>
                )}
                </div>
              </div>

            {/* Capabilities */}
            <div className="grid grid-cols-2 gap-x-10 gap-y-4 mb-6 bg-gray-100 rounded-xl p-6">
              <div className="flex items-center gap-3">
                <span className="text-[#01B2D6] font-light text-lg">|</span>
                <span className="text-gray-600 text-sm">Inbound and outbound appointment scheduling</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#01B2D6] font-light text-lg">|</span>
                <span className="text-gray-600 text-sm">Real-time calendar availability checks</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#01B2D6] font-light text-lg">|</span>
                <span className="text-gray-600 text-sm">Insurance verification and referral management</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#01B2D6] font-light text-lg">|</span>
                <span className="text-gray-600 text-sm">Automated reminders and rescheduling</span>
              </div>
            </div>
            
            {/* Divider */}
            <div className="border-t border-gray-200 my-6" />
            
            {/* Buttons - spread apart */}
            <div className="flex justify-between items-center">
                {!isConnected ? (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBeginDemo();
                    }}
                    disabled={isConnecting}
                  className="px-8 py-4 bg-[#01B2D6] text-white rounded-xl text-lg font-semibold hover:bg-[#0195b3] transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {isConnecting ? (
                      <>
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Connecting...
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
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
                  className="px-8 py-4 bg-red-500 text-white rounded-xl text-lg font-semibold hover:bg-red-600 transition-colors"
                  >
                    End Conversation
                  </button>
                )}
            </div>

            {/* Error Display */}
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">
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
  {/* Allison - Customer Service Agent */}
  <div 
    onClick={() => !isConnected && handleExpandCard('allison')}
    style={cardAnimationStyle(4)}
    className={`agent-card group relative bg-white rounded-2xl shadow-lg transition-opacity duration-300 cursor-pointer ${
      expandedCard === 'allison' 
        ? 'w-full p-4 md:p-12 animated-border-card' 
        : 'w-[calc((100%-1rem)/2-12px)] md:w-[200px] h-[241px] md:h-64 hover:shadow-2xl hover:-translate-y-1 overflow-hidden'
    } ${expandedCard && expandedCard !== 'allison' ? 'hidden' : ''}`}
  >
    {!expandedCard || expandedCard === 'allison' ? (
      <>
        {/* Collapsed State */}
        {expandedCard !== 'allison' && (
          <div className="flex flex-col h-full">
            {/* Avatar - takes most of card space */}
            <div className="h-[80%] md:h-[230px] overflow-hidden">
            <img 
              src="/avatar-allison.png" 
              alt="Allison" 
                className="w-full h-full object-contain scale-[1.07] md:scale-[1.06]"
              />
            </div>
            
            {/* Blue strip at bottom */}
            <div className="bg-[#01B2D6] py-2.5 px-4 text-center flex-1 flex flex-col justify-center">
              <h3 className="text-white text-sm md:text-base font-bold mb-0.5">ALLISON</h3>
              <p className="text-white text-[10px] md:text-xs mb-1.5">Customer Support</p>
              <p className="text-white text-[10px] opacity-80 md:hidden">Click to learn more →</p>
            </div>
          </div>
        )}

        {/* Expanded State */}
        {expandedCard === 'allison' && (
          <div className="max-w-6xl mx-auto">
          {/* Mobile Layout */}
          <div className="md:hidden flex flex-col h-[500px]">
            {/* Header with Close X */}
            <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-white">
              <div className="flex items-center gap-3">
                <img 
                  src="/avatar-allison.png" 
                  alt="Allison" 
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Allison</h3>
                  <p className="text-sm text-gray-600">Customer Service</p>
                </div>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleExpandCard('allison');
                }}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Status Bar */}
            <div className="px-3 py-2 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center gap-2 text-[11px]">
                <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`} />
                <span className="text-gray-700">
                  {isConnected ? (isRecording ? 'Allison Speaking...' : 'Listening...') : 'Ready to start'}
                </span>
              </div>
            </div>

            {/* Content - All visible, no scrolling */}
            <div className="flex-1 px-3 py-3 overflow-y-auto bg-white">
              <div className="space-y-3">
                {/* About */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">About</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Allison is your friendly AI assistant, trained to handle customer inquiries with professionalism and care. She can help with general questions, provide information, and guide you through various processes.
                  </p>
                </div>

                {/* Capabilities */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">Capabilities</h4>
                  <ul className="text-sm text-gray-600 space-y-1 leading-relaxed">
                    <li>• General billing and account inquiries</li>
                      <li>• Appointment scheduling assistance</li>
                      <li>• Practice information and directions</li>
                      <li>• After-hours call handling</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Fixed Bottom Button */}
            <div className="p-3 border-t border-gray-200 bg-white">
              {!isConnected ? (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBeginDemo();
                  }}
                  disabled={isConnecting}
                  className="w-full py-2.5 bg-[#01B2D6] text-white rounded-lg text-sm font-semibold hover:bg-[#0195b3] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isConnecting ? (
                    <>
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Connecting...
                    </>
                  ) : (
                    'Begin Conversation'
                  )}
                </button>
              ) : (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEndDemo();
                  }}
                  className="w-full py-2.5 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors"
                >
                  End Conversation
                </button>
              )}
            </div>
          </div>

          {/* Desktop Layout - Magazine/Editorial */}
          <div className="hidden md:block">
            {/* Close X - Top Right */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleExpandCard('allison');
              }}
              className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-colors z-10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {/* Top Row: Header + Orb */}
            <div className="flex items-start justify-between">
              {/* Left: Avatar + Name */}
              <div className="flex items-center gap-5">
                <img 
                  src="/avatar-allison.png" 
                  alt="Allison" 
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-4xl font-bold text-gray-900">Allison</h3>
                  <p className="text-lg text-gray-500 mt-1">Customer Service Agent</p>
                  <div className="mt-3 w-48 h-[2px] bg-[#01B2D6]" />
                </div>
              </div>

              </div>
            
            {/* Content: Description (left) + Orb/Status (right) */}
            <div className="flex items-center mt-2 mb-6 gap-8">
              {/* Left Half - Description */}
              <div className="w-1/2">
                <p className="text-gray-600 text-base leading-relaxed">
                    Allison is your friendly AI assistant, trained to handle customer inquiries with professionalism and care. She can help with general questions, provide information, and guide you through various processes.
                  </p>
                </div>
              
              {/* Right Half - Orb / Status */}
              <div className="w-1/2 flex flex-col items-center justify-center min-h-[200px]">
                {isConnected ? (
                  <>
                    <div style={{ width: '160px', height: '160px', position: 'relative', background: '#ffffff', borderRadius: '50%' }}>
                      <Orb 
                        hue={55}
                        hoverIntensity={0.22}
                        rotateOnHover={true}
                        forceHoverState={false}
                        backgroundColor="#ffffff"
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-3">
                      {isRecording ? 'Allison is speaking...' : 'Listening...'}
                    </p>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                    </svg>
                    <p className="text-sm">{isConnecting ? 'Connecting...' : 'Ready to start'}</p>
                  </div>
                )}
                </div>
              </div>

            {/* Capabilities */}
            <div className="grid grid-cols-2 gap-x-10 gap-y-4 mb-6 bg-gray-100 rounded-xl p-6">
              <div className="flex items-center gap-3">
                <span className="text-[#01B2D6] font-light text-lg">|</span>
                <span className="text-gray-600 text-sm">General billing and account inquiries</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#01B2D6] font-light text-lg">|</span>
                <span className="text-gray-600 text-sm">Appointment scheduling assistance</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#01B2D6] font-light text-lg">|</span>
                <span className="text-gray-600 text-sm">Practice information and directions</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#01B2D6] font-light text-lg">|</span>
                <span className="text-gray-600 text-sm">After-hours call handling</span>
              </div>
            </div>
            
            {/* Divider */}
            <div className="border-t border-gray-200 my-6" />
            
            {/* Buttons - spread apart */}
            <div className="flex justify-between items-center">
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
                  className="px-8 py-4 bg-[#01B2D6] text-white rounded-xl text-lg font-semibold hover:bg-[#0195b3] transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {isConnecting ? (
                      <>
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Connecting...
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
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
                  className="px-8 py-4 bg-red-500 text-white rounded-xl text-lg font-semibold hover:bg-red-600 transition-colors"
                  >
                    End Conversation
                  </button>
                )}
            </div>

            {/* Error Display */}
              {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">
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

  {/* Harper - Eligibility & Benefits Verification */}
  <div 
    onClick={() => !isConnected && handleExpandCard('james')}
    style={cardAnimationStyle(5)}
    className={`agent-card group relative bg-white rounded-2xl shadow-lg transition-opacity duration-300 cursor-pointer ${
      expandedCard === 'james' 
        ? 'w-full p-4 md:p-12 animated-border-card' 
        : 'w-[calc((100%-1rem)/2-12px)] md:w-[200px] h-[241px] md:h-64 hover:shadow-2xl hover:-translate-y-1 overflow-hidden'
    } ${expandedCard && expandedCard !== 'james' ? 'hidden' : ''}`}
  >
    {!expandedCard || expandedCard === 'james' ? (
      <>
        {/* Collapsed State */}
        {expandedCard !== 'james' && (
          <div className="flex flex-col h-full">
            {/* Avatar - takes most of card space */}
            <div className="h-[80%] md:h-[230px] overflow-hidden">
            <img 
              src="/avatar-harper.png" 
              alt="Harper" 
                className="w-full h-full object-contain scale-[1.07] md:scale-[1.06]"
              />
            </div>
            
            {/* Blue strip at bottom */}
            <div className="bg-[#01B2D6] py-2.5 px-4 text-center flex-1 flex flex-col justify-center">
              <h3 className="text-white text-sm md:text-base font-bold mb-0.5">HARPER</h3>
              <p className="text-white text-[10px] md:text-xs mb-1.5">Eligibility Verification</p>
              <p className="text-white text-[10px] opacity-80 md:hidden">Click to learn more →</p>
            </div>
          </div>
        )}

        {/* Expanded State */}
        {expandedCard === 'james' && (
          <div className="max-w-6xl mx-auto">
          {/* Mobile Layout */}
          <div className="md:hidden flex flex-col h-[500px]">
            {/* Header with Close X */}
            <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-white">
              <div className="flex items-center gap-3">
                <img 
                  src="/avatar-harper.png" 
                  alt="Harper" 
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Harper</h3>
                  <p className="text-sm text-gray-600">Eligibility & Benefits</p>
                </div>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleExpandCard('james');
                }}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Status Bar */}
            <div className="px-3 py-2 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center gap-2 text-[11px]">
                <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`} />
                <span className="text-gray-700">
                  {isConnected ? (isRecording ? 'Harper Speaking...' : 'Listening...') : 'Ready to start'}
                </span>
              </div>
            </div>

            {/* Content - All visible, no scrolling */}
            <div className="flex-1 px-3 py-3 overflow-y-auto bg-white">
              <div className="space-y-3">
                {/* About */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">About</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Harper specializes in calling insurance companies to verify patient coverage before services are rendered. She checks eligibility, benefits, deductibles, and in-network status to ensure accurate billing.
                  </p>
                </div>

                {/* Capabilities */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">Capabilities</h4>
                  <ul className="text-sm text-gray-600 space-y-1 leading-relaxed">
                    <li>• Real-time insurance eligibility verification</li>
                      <li>• Benefits, deductibles, and coverage limits</li>
                      <li>• In-network vs. out-of-network status</li>
                      <li>• Secondary insurance coordination</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Fixed Bottom Button */}
            <div className="p-3 border-t border-gray-200 bg-white">
              {!isConnected ? (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBeginDemo();
                  }}
                  disabled={isConnecting}
                  className="w-full py-2.5 bg-[#01B2D6] text-white rounded-lg text-sm font-semibold hover:bg-[#0195b3] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isConnecting ? (
                    <>
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Connecting...
                    </>
                  ) : (
                    'Begin Conversation'
                  )}
                </button>
              ) : (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEndDemo();
                  }}
                  className="w-full py-2.5 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors"
                >
                  End Conversation
                </button>
              )}
            </div>
          </div>

          {/* Desktop Layout - Magazine/Editorial */}
          <div className="hidden md:block">
            {/* Close X - Top Right */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleExpandCard('james');
              }}
              className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-colors z-10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {/* Top Row: Header + Orb */}
            <div className="flex items-start justify-between">
              {/* Left: Avatar + Name */}
              <div className="flex items-center gap-5">
                <img 
                  src="/avatar-harper.png" 
                  alt="Harper" 
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-4xl font-bold text-gray-900">Harper</h3>
                  <p className="text-lg text-gray-500 mt-1">Eligibility & Benefits Verification</p>
                  <div className="mt-3 w-48 h-[2px] bg-[#01B2D6]" />
                </div>
              </div>

              </div>
            
            {/* Content: Description (left) + Orb/Status (right) */}
            <div className="flex items-center mt-2 mb-6 gap-8">
              {/* Left Half - Description */}
              <div className="w-1/2">
                <p className="text-gray-600 text-base leading-relaxed">
                    Harper specializes in calling insurance companies to verify patient coverage before services are rendered. She checks eligibility, benefits, deductibles, and in-network status to ensure accurate billing.
                  </p>
                </div>
              
              {/* Right Half - Orb / Status */}
              <div className="w-1/2 flex flex-col items-center justify-center min-h-[200px]">
                {isConnected ? (
                  <>
                    <div style={{ width: '160px', height: '160px', position: 'relative', background: '#ffffff', borderRadius: '50%' }}>
                      <Orb 
                        hue={55}
                        hoverIntensity={0.22}
                        rotateOnHover={true}
                        forceHoverState={false}
                        backgroundColor="#ffffff"
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-3">
                      {isRecording ? 'Harper is speaking...' : 'Listening...'}
                    </p>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                    </svg>
                    <p className="text-sm">{isConnecting ? 'Connecting...' : 'Ready to start'}</p>
                  </div>
                )}
                </div>
              </div>

            {/* Capabilities */}
            <div className="grid grid-cols-2 gap-x-10 gap-y-4 mb-6 bg-gray-100 rounded-xl p-6">
              <div className="flex items-center gap-3">
                <span className="text-[#01B2D6] font-light text-lg">|</span>
                <span className="text-gray-600 text-sm">Real-time insurance eligibility verification</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#01B2D6] font-light text-lg">|</span>
                <span className="text-gray-600 text-sm">Benefits, deductibles, and coverage limits</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#01B2D6] font-light text-lg">|</span>
                <span className="text-gray-600 text-sm">In-network vs. out-of-network status</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#01B2D6] font-light text-lg">|</span>
                <span className="text-gray-600 text-sm">Secondary insurance coordination</span>
              </div>
            </div>
            
            {/* Divider */}
            <div className="border-t border-gray-200 my-6" />
            
            {/* Buttons - spread apart */}
            <div className="flex justify-between items-center">
                {!isConnected ? (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBeginDemo();
                    }}
                    disabled={isConnecting}
                  className="px-8 py-4 bg-[#01B2D6] text-white rounded-xl text-lg font-semibold hover:bg-[#0195b3] transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {isConnecting ? (
                      <>
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Connecting...
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
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
                  className="px-8 py-4 bg-red-500 text-white rounded-xl text-lg font-semibold hover:bg-red-600 transition-colors"
                  >
                    End Conversation
                  </button>
                )}
            </div>

            {/* Error Display */}
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">
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

  {/* Olivia - Prior Authorization Follow-Up */}
  <div 
      onClick={() => !isConnected && handleExpandCard('olivia')}
      style={cardAnimationStyle(6)}
      className={`agent-card group relative bg-white rounded-2xl shadow-lg transition-opacity duration-300 cursor-pointer ${
        expandedCard === 'olivia' 
          ? 'w-full p-4 md:p-12 animated-border-card' 
          : 'w-[calc((100%-1rem)/2-12px)] md:w-[200px] h-[241px] md:h-64 hover:shadow-2xl hover:-translate-y-1 overflow-hidden'
      } ${expandedCard && expandedCard !== 'olivia' ? 'hidden' : ''}`}
    >
    {!expandedCard || expandedCard === 'olivia' ? (
      <>
        {/* Collapsed State */}
        {expandedCard !== 'olivia' && (
          <div className="flex flex-col h-full">
            {/* Avatar - takes most of card space */}
            <div className="h-[80%] md:h-[230px] overflow-hidden">
            <img 
              src="/avatar-olivia.png" 
              alt="Olivia" 
                className="w-full h-full object-contain scale-[1.07] md:scale-[1.06]"
              />
            </div>
            
            {/* Blue strip at bottom */}
            <div className="bg-[#01B2D6] py-2.5 px-4 text-center flex-1 flex flex-col justify-center">
              <h3 className="text-white text-sm md:text-base font-bold mb-0.5">OLIVIA</h3>
              <p className="text-white text-[10px] md:text-xs mb-1.5">Prior Authorization</p>
              <p className="text-white text-[10px] opacity-80 md:hidden">Click to learn more →</p>
            </div>
          </div>
        )}

        {/* Expanded State */}
        {expandedCard === 'olivia' && (
          <div className="max-w-6xl mx-auto">
          {/* Mobile Layout */}
          <div className="md:hidden flex flex-col h-[500px]">
            {/* Header with Close X */}
            <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-white">
              <div className="flex items-center gap-3">
                <img 
                  src="/avatar-olivia.png" 
                  alt="Olivia" 
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Olivia</h3>
                  <p className="text-sm text-gray-600">Prior Authorization</p>
                </div>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleExpandCard('olivia');
                }}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Status Bar */}
            <div className="px-3 py-2 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center gap-2 text-[11px]">
                <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`} />
                <span className="text-gray-700">
                  {isConnected ? (isRecording ? 'Olivia Speaking...' : 'Listening...') : 'Ready to start'}
                </span>
              </div>
            </div>

            {/* Content - All visible, no scrolling */}
            <div className="flex-1 px-3 py-3 overflow-y-auto bg-white">
              <div className="space-y-3">
                {/* About */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">About</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Olivia specializes in calling insurance companies to track down prior authorization approvals. She checks if authorizations are approved, denied, or pending, and can expedite urgent cases to keep procedures on schedule.
                  </p>
                </div>

                {/* Capabilities */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">Capabilities</h4>
                  <ul className="text-sm text-gray-600 space-y-1 leading-relaxed">
                    <li>• Prior authorization status tracking</li>
                      <li>• Expedited review requests for urgent cases</li>
                      <li>• Denial reason documentation and appeals</li>
                      <li>• Authorization number and validity tracking</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Fixed Bottom Button */}
            <div className="p-3 border-t border-gray-200 bg-white">
              {!isConnected ? (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBeginDemo();
                  }}
                  disabled={isConnecting}
                  className="w-full py-2.5 bg-[#01B2D6] text-white rounded-lg text-sm font-semibold hover:bg-[#0195b3] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isConnecting ? (
                    <>
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Connecting...
                    </>
                  ) : (
                    'Begin Conversation'
                  )}
                </button>
              ) : (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEndDemo();
                  }}
                  className="w-full py-2.5 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors"
                >
                  End Conversation
                </button>
              )}
            </div>
          </div>

          {/* Desktop Layout - Magazine/Editorial */}
          <div className="hidden md:block">
            {/* Close X - Top Right */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleExpandCard('olivia');
              }}
              className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-colors z-10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {/* Top Row: Header + Orb */}
            <div className="flex items-start justify-between">
              {/* Left: Avatar + Name */}
              <div className="flex items-center gap-5">
                <img 
                  src="/avatar-olivia.png" 
                  alt="Olivia" 
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-4xl font-bold text-gray-900">Olivia</h3>
                  <p className="text-lg text-gray-500 mt-1">Prior Authorization Follow-Up</p>
                  <div className="mt-3 w-48 h-[2px] bg-[#01B2D6]" />
                </div>
              </div>

              </div>
            
            {/* Content: Description (left) + Orb/Status (right) */}
            <div className="flex items-center mt-2 mb-6 gap-8">
              {/* Left Half - Description */}
              <div className="w-1/2">
                <p className="text-gray-600 text-base leading-relaxed">
                    Olivia specializes in calling insurance companies to track down prior authorization approvals. She checks if authorizations are approved, denied, or pending, and can expedite urgent cases to keep procedures on schedule.
                  </p>
                </div>
              
              {/* Right Half - Orb / Status */}
              <div className="w-1/2 flex flex-col items-center justify-center min-h-[200px]">
                {isConnected ? (
                  <>
                    <div style={{ width: '160px', height: '160px', position: 'relative', background: '#ffffff', borderRadius: '50%' }}>
                      <Orb 
                        hue={55}
                        hoverIntensity={0.22}
                        rotateOnHover={true}
                        forceHoverState={false}
                        backgroundColor="#ffffff"
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-3">
                      {isRecording ? 'Olivia is speaking...' : 'Listening...'}
                    </p>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                    </svg>
                    <p className="text-sm">{isConnecting ? 'Connecting...' : 'Ready to start'}</p>
                  </div>
                )}
                </div>
              </div>

            {/* Capabilities */}
            <div className="grid grid-cols-2 gap-x-10 gap-y-4 mb-6 bg-gray-100 rounded-xl p-6">
              <div className="flex items-center gap-3">
                <span className="text-[#01B2D6] font-light text-lg">|</span>
                <span className="text-gray-600 text-sm">Prior authorization status tracking</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#01B2D6] font-light text-lg">|</span>
                <span className="text-gray-600 text-sm">Expedited review requests for urgent cases</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#01B2D6] font-light text-lg">|</span>
                <span className="text-gray-600 text-sm">Denial reason documentation and appeals</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#01B2D6] font-light text-lg">|</span>
                <span className="text-gray-600 text-sm">Authorization number and validity tracking</span>
              </div>
            </div>
            
            {/* Divider */}
            <div className="border-t border-gray-200 my-6" />
            
            {/* Buttons - spread apart */}
            <div className="flex justify-between items-center">
                {!isConnected ? (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBeginDemo();
                    }}
                    disabled={isConnecting}
                  className="px-8 py-4 bg-[#01B2D6] text-white rounded-xl text-lg font-semibold hover:bg-[#0195b3] transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {isConnecting ? (
                      <>
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Connecting...
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
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
                  className="px-8 py-4 bg-red-500 text-white rounded-xl text-lg font-semibold hover:bg-red-600 transition-colors"
                  >
                    End Conversation
                  </button>
                )}
            </div>

            {/* Error Display */}
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">
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

    {/* Michael - Payment Reconciliation */}
    <div 
      onClick={() => !isConnected && handleExpandCard('michael')}
      style={cardAnimationStyle(7)}
      className={`agent-card group relative bg-white rounded-2xl shadow-lg transition-opacity duration-300 cursor-pointer ${
        expandedCard === 'michael' 
          ? 'w-full p-4 md:p-12 animated-border-card'
          : 'w-[calc((100%-1rem)/2-12px)] md:w-[200px] h-[241px] md:h-64 hover:shadow-2xl hover:-translate-y-1 overflow-hidden'
      } ${expandedCard && expandedCard !== 'michael' ? 'hidden' : ''}`}
  >
    {!expandedCard || expandedCard === 'michael' ? (
      <>
        {/* Collapsed State */}
        {expandedCard !== 'michael' && (
          <div className="flex flex-col h-full">
            {/* Avatar - takes most of card space */}
            <div className="h-[80%] md:h-[230px] overflow-hidden">
            <img 
              src="/avatar-chris.png" 
              alt="Michael" 
                className="w-full h-full object-contain scale-[1.07] md:scale-[1.06]"
              />
            </div>
            
            {/* Blue strip at bottom */}
            <div className="bg-[#01B2D6] py-2.5 px-4 text-center flex-1 flex flex-col justify-center">
              <h3 className="text-white text-sm md:text-base font-bold mb-0.5">MICHAEL</h3>
              <p className="text-white text-[10px] md:text-xs mb-1.5">Payment Recovery</p>
              <p className="text-white text-[10px] opacity-80 md:hidden">Click to learn more →</p>
            </div>
          </div>
        )}

        {/* Expanded State */}
        {expandedCard === 'michael' && (
          <div className="max-w-6xl mx-auto">
          {/* Mobile Layout */}
          <div className="md:hidden flex flex-col h-[500px]">
            {/* Header with Close X */}
            <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-white">
              <div className="flex items-center gap-3">
                <img 
                  src="/avatar-chris.png" 
                  alt="Michael" 
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Michael</h3>
                  <p className="text-sm text-gray-600">Payment Reconciliation</p>
                </div>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleExpandCard('michael');
                }}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Status Bar */}
            <div className="px-3 py-2 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center gap-2 text-[11px]">
                <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`} />
                <span className="text-gray-700">
                  {isConnected ? (isRecording ? 'Michael Speaking...' : 'Listening...') : 'Ready to start'}
                </span>
              </div>
            </div>

            {/* Content - All visible, no scrolling */}
            <div className="flex-1 px-3 py-3 overflow-y-auto bg-white">
              <div className="space-y-3">
                {/* About */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">About</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Michael is your financial detective, specializing in tracking down and resolving payment discrepancies with insurance companies. He investigates missing payments, partial payments, incorrect amounts, and overpayments to ensure every dollar is accounted for.
                  </p>
                </div>

                {/* Capabilities */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">Capabilities</h4>
                  <ul className="text-sm text-gray-600 space-y-1 leading-relaxed">
                    <li>• Missing payment investigation and recovery</li>
                      <li>• Payment discrepancy resolution with carriers</li>
                      <li>• Check trace and reissue requests</li>
                      <li>• EOB retrieval and overpayment refunds</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Fixed Bottom Button */}
            <div className="p-3 border-t border-gray-200 bg-white">
              {!isConnected ? (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBeginDemo();
                  }}
                  disabled={isConnecting}
                  className="w-full py-2.5 bg-[#01B2D6] text-white rounded-lg text-sm font-semibold hover:bg-[#0195b3] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isConnecting ? (
                    <>
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Connecting...
                    </>
                  ) : (
                    'Begin Conversation'
                  )}
                </button>
              ) : (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEndDemo();
                  }}
                  className="w-full py-2.5 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors"
                >
                  End Conversation
                </button>
              )}
            </div>
          </div>

          {/* Desktop Layout - Magazine/Editorial */}
          <div className="hidden md:block">
            {/* Close X - Top Right */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleExpandCard('michael');
              }}
              className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-colors z-10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {/* Top Row: Header + Orb */}
            <div className="flex items-start justify-between">
              {/* Left: Avatar + Name */}
              <div className="flex items-center gap-5">
                <img 
                  src="/avatar-chris.png" 
                  alt="Michael" 
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-4xl font-bold text-gray-900">Michael</h3>
                  <p className="text-lg text-gray-500 mt-1">Payment Reconciliation</p>
                  <div className="mt-3 w-48 h-[2px] bg-[#01B2D6]" />
                </div>
              </div>

              </div>
            
            {/* Content: Description (left) + Orb/Status (right) */}
            <div className="flex items-center mt-2 mb-6 gap-8">
              {/* Left Half - Description */}
              <div className="w-1/2">
                <p className="text-gray-600 text-base leading-relaxed">
                    Michael is your financial detective, specializing in tracking down and resolving payment discrepancies with insurance companies. He investigates missing payments, partial payments, incorrect amounts, and overpayments to ensure every dollar is accounted for.
                  </p>
                </div>
              
              {/* Right Half - Orb / Status */}
              <div className="w-1/2 flex flex-col items-center justify-center min-h-[200px]">
                {isConnected ? (
                  <>
                    <div style={{ width: '160px', height: '160px', position: 'relative', background: '#ffffff', borderRadius: '50%' }}>
                      <Orb 
                        hue={55}
                        hoverIntensity={0.22}
                        rotateOnHover={true}
                        forceHoverState={false}
                        backgroundColor="#ffffff"
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-3">
                      {isRecording ? 'Michael is speaking...' : 'Listening...'}
                    </p>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                    </svg>
                    <p className="text-sm">{isConnecting ? 'Connecting...' : 'Ready to start'}</p>
                  </div>
                )}
                </div>
              </div>

            {/* Capabilities */}
            <div className="grid grid-cols-2 gap-x-10 gap-y-4 mb-6 bg-gray-100 rounded-xl p-6">
              <div className="flex items-center gap-3">
                <span className="text-[#01B2D6] font-light text-lg">|</span>
                <span className="text-gray-600 text-sm">Missing payment investigation and recovery</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#01B2D6] font-light text-lg">|</span>
                <span className="text-gray-600 text-sm">Payment discrepancy resolution with carriers</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#01B2D6] font-light text-lg">|</span>
                <span className="text-gray-600 text-sm">Check trace and reissue requests</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#01B2D6] font-light text-lg">|</span>
                <span className="text-gray-600 text-sm">EOB retrieval and overpayment refunds</span>
              </div>
            </div>
            
            {/* Divider */}
            <div className="border-t border-gray-200 my-6" />
            
            {/* Buttons - spread apart */}
            <div className="flex justify-between items-center">
                {!isConnected ? (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBeginDemo();
                    }}
                    disabled={isConnecting}
                  className="px-8 py-4 bg-[#01B2D6] text-white rounded-xl text-lg font-semibold hover:bg-[#0195b3] transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {isConnecting ? (
                      <>
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Connecting...
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
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
                  className="px-8 py-4 bg-red-500 text-white rounded-xl text-lg font-semibold hover:bg-red-600 transition-colors"
                  >
                    End Conversation
                  </button>
                )}
            </div>

            {/* Error Display */}
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">
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

        </div>
      </div>
    </div>
  )
}
