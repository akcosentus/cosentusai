'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import { useRetellAgent } from '@/hooks/useRetellAgent';
import { useRateLimit } from '@/hooks/useRateLimit';
import { AGENTS } from '@/config/agents';
import Orb from '@/components/Orb';

// Agent metadata
const AGENT_INFO: Record<string, { 
  name: string; 
  subtitle: string;
  shortDescription: string;
  about: string;
  capabilities: string[];
}> = {
  chloe: {
    name: 'Chloe',
    subtitle: 'Company Information Expert',
    shortDescription: 'Provides comprehensive information about Cosentus services, pricing, and AI capabilities.',
    about: 'Chloe specializes in providing comprehensive information about Cosentus services, pricing, and capabilities. She helps potential clients understand how our AI-powered solutions can transform their revenue cycle management.',
    capabilities: [
      'Company services overview',
      'Pricing and package information',
      'AI capabilities demonstration',
      'Custom solution consultation',
      'Integration guidance'
    ]
  },
  cindy: {
    name: 'Cindy',
    subtitle: 'Payment & Balance Specialist',
    shortDescription: 'Handles outstanding balances and payment processing in 50+ languages.',
    about: 'Cindy specializes in handling inbound patient calls for outstanding balance inquiries and payment processing. She provides clear, empathetic assistance to help patients understand and resolve their billing questions.',
    capabilities: [
      'Outstanding balance information',
      'Secure payment processing',
      'Speaks 50+ languages fluently',
      'Handles up to 20 calls simultaneously',
      'Payment plan setup assistance'
    ]
  },
  chris: {
    name: 'Chris',
    subtitle: 'Insurance Claim Follow-Up',
    shortDescription: 'Handles outbound insurance claim follow-ups with carriers to resolve denials and track status.',
    about: 'Chris handles insurance claim follow-ups and denial resolution. He works with insurance carriers to track claim status, resolve denials, and ensure timely reimbursement for healthcare providers.',
    capabilities: [
      'Claim status tracking',
      'Denial resolution',
      'Carrier communication',
      'Appeals processing',
      'Reimbursement optimization'
    ]
  },
  cassidy: {
    name: 'Cassidy',
    subtitle: 'Anesthesia Cost Estimates',
    shortDescription: 'Provides pre-surgery anesthesia cost estimates for patients.',
    about: 'Cassidy helps patients understand what their anesthesia will cost before their scheduled surgery. She gathers procedure details, applies facility-specific pricing rules, and provides clear cost estimates.',
    capabilities: [
      'Pre-surgery anesthesia cost estimates',
      'Insurance and self-pay pricing',
      'Facility-specific pricing rules',
      'Payment plan guidance',
      'Complex surgery estimates'
    ]
  },
  courtney: {
    name: 'Courtney',
    subtitle: 'Medical Appointment Scheduling',
    shortDescription: 'Schedules patient appointments efficiently with real-time calendar integration.',
    about: 'Courtney helps medical practices schedule patient appointments efficiently. She handles both outbound and inbound calls, gathering patient details and finding convenient appointment times.',
    capabilities: [
      'Inbound and outbound scheduling',
      'Real-time calendar integration',
      'Appointment reminders',
      'Patient detail collection',
      'Rescheduling assistance'
    ]
  },
  cara: {
    name: 'Cara',
    subtitle: 'Eligibility & Benefits Verification',
    shortDescription: 'Verifies patient insurance eligibility and benefits before procedures.',
    about: 'Cara verifies patient insurance eligibility and benefits before procedures. She ensures accurate coverage information and helps prevent claim denials.',
    capabilities: [
      'Real-time eligibility verification',
      'Benefits coverage analysis',
      'Pre-authorization requirements',
      'Coverage limitations',
      'Multi-payer support'
    ]
  },
  carly: {
    name: 'Carly',
    subtitle: 'Prior Authorization Follow-Up',
    shortDescription: 'Manages prior authorization requests and expedites approvals.',
    about: 'Carly manages prior authorization requests and follow-ups with insurance companies. She tracks authorization status and expedites approvals to prevent treatment delays.',
    capabilities: [
      'Authorization status tracking',
      'Expedited review requests',
      'Payer communication',
      'Documentation management',
      'Approval timeline optimization'
    ]
  },
  carson: {
    name: 'Carson',
    subtitle: 'Payment Reconciliation',
    shortDescription: 'Specializes in payment reconciliation and identifying discrepancies.',
    about: 'Carson specializes in payment reconciliation and identifying discrepancies between expected and received payments. He helps practices recover missing revenue.',
    capabilities: [
      'Payment variance analysis',
      'Missing payment identification',
      'EOB reconciliation',
      'Underpayment recovery',
      'Financial reporting'
    ]
  }
};

export default function VoiceEmbed() {
  const params = useParams();
  const agentKey = params.agent as string;
  const agentInfo = AGENT_INFO[agentKey];
  const agentId = AGENTS[agentKey as keyof typeof AGENTS];

  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const { isConnected, isRecording, isConnecting, error, connect, disconnect } = useRetellAgent({
    agentId: agentId || '',
  });

  const { rateLimitState, recordCall } = useRateLimit();

  if (!agentInfo || !agentId) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Agent Not Found</h1>
          <p className="text-gray-600">The agent &quot;{agentKey}&quot; does not exist.</p>
        </div>
      </div>
    );
  }

  const handleExpandCard = (cardId: string) => {
    if (expandedCard === cardId) {
      setExpandedCard(null);
      if (isConnected) {
        disconnect();
      }
    } else {
      setExpandedCard(cardId);
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
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-8 bg-transparent">
      <div className={`w-full transition-all duration-700 ${expandedCard ? 'max-w-6xl' : 'max-w-md'}`}>
        {/* Agent Card - EXACT COPY from landing page */}
        <div 
          onClick={() => !isConnected && handleExpandCard(agentKey)}
          className={`group relative bg-white rounded-2xl border border-gray-200 shadow-lg transition-all duration-700 cursor-pointer ${
            expandedCard === agentKey 
              ? 'p-12' 
              : 'p-8 hover:shadow-2xl hover:-translate-y-1'
          }`}
        >
          {!expandedCard || expandedCard === agentKey ? (
            <>
              {/* Collapsed State */}
              {expandedCard !== agentKey && (
                <>
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#01B2D6]/10 mb-6 group-hover:bg-[#01B2D6]/20 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-[#01B2D6]">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-3">{agentInfo.name}</h3>
                  <p className="text-gray-600 mb-6">
                    {agentInfo.shortDescription}
                  </p>
                  <div className="text-sm text-[#01B2D6] font-medium">
                    Click to learn more →
                  </div>
                </>
              )}

              {/* Expanded State */}
              {expandedCard === agentKey && (
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
                        <h3 className="text-4xl font-bold text-gray-900">{agentInfo.name}</h3>
                        <p className="text-lg text-gray-600">{agentInfo.subtitle}</p>
                      </div>
                    </div>

                    <div className="space-y-4 mb-8">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">About {agentInfo.name}</h4>
                        <p className="text-gray-600">
                          {agentInfo.about}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Capabilities</h4>
                        <ul className="text-gray-600 space-y-1">
                          {agentInfo.capabilities.map((capability, index) => (
                            <li key={index}>• {capability}</li>
                          ))}
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
                          handleExpandCard(agentKey);
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
                        {/* WebGL Orb */}
                        <div style={{ width: '220px', height: '220px', position: 'relative', background: '#ffffff', borderRadius: '50%', marginTop: '24px' }}>
                          <Orb 
                            hue={55}
                            hoverIntensity={0.22}
                            rotateOnHover={true}
                            forceHoverState={false}
                            backgroundColor="#ffffff"
                          />
                        </div>
                        
                        {/* Status Text */}
                        <p className="text-gray-600 text-center">
                          {isRecording ? `${agentInfo.name} is speaking...` : 'Listening...'}
                        </p>
                      </div>
                    ) : (
                      <div className="text-center text-gray-400 mt-6">
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
      </div>

    </div>
  );
}
