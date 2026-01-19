'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useRetellAgent } from '@/hooks/useRetellAgent';
import { AGENTS } from '@/config/agents';

// Agent metadata
const AGENT_INFO: Record<string, { name: string; description: string; icon: string }> = {
  chloe: {
    name: 'Chloe',
    description: 'Cosentus company information expert',
    icon: '💼'
  },
  cindy: {
    name: 'Cindy',
    description: 'Patient billing support specialist',
    icon: '💳'
  },
  chris: {
    name: 'Chris',
    description: 'Insurance claim follow-up specialist',
    icon: '📋'
  },
  cara: {
    name: 'Cara',
    description: 'Eligibility & benefits verification',
    icon: '✓'
  },
  carly: {
    name: 'Carly',
    description: 'Prior authorization follow-up',
    icon: '📝'
  },
  carson: {
    name: 'Carson',
    description: 'Payment reconciliation specialist',
    icon: '💰'
  },
  cassidy: {
    name: 'Cassidy',
    description: 'Pre-service anesthesia cost estimates',
    icon: '💵'
  },
  courtney: {
    name: 'Courtney',
    description: 'Medical appointment scheduling',
    icon: '📅'
  }
};

export default function VoiceEmbed() {
  const params = useParams();
  const agentKey = params.agent as string;
  const agentInfo = AGENT_INFO[agentKey];
  const agentId = AGENTS[agentKey as keyof typeof AGENTS];

  const [status, setStatus] = useState('Ready');

  const { isConnected, isRecording, isConnecting, error, connect, disconnect } = useRetellAgent({
    agentId: agentId || '',
    onStatusChange: (newStatus) => {
      setStatus(newStatus);
    },
  });

  // Get URL parameters for customization
  const [customColor, setCustomColor] = useState('#01B2D6');
  const [buttonText, setButtonText] = useState('Begin Conversation');
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('color')) {
        setCustomColor('#' + params.get('color'));
      }
      if (params.get('buttonText')) {
        setButtonText(params.get('buttonText') || 'Begin Conversation');
      }
      if (params.get('theme')) {
        setTheme(params.get('theme') || 'light');
      }
    }
  }, []);

  if (!agentInfo || !agentId) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Agent Not Found</h1>
          <p className="text-gray-600">The agent &quot;{agentKey}&quot; does not exist.</p>
        </div>
      </div>
    );
  }

  const bgColor = theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50';
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const subtextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
  const cardBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white';

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen ${bgColor} p-6`}>
      <div className={`${cardBg} rounded-2xl shadow-xl p-8 max-w-md w-full`}>
        {/* Agent Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{agentInfo.icon}</div>
          <h1 className={`text-3xl font-bold ${textColor} mb-2`}>{agentInfo.name}</h1>
          <p className={`${subtextColor}`}>{agentInfo.description}</p>
        </div>

        {/* Status Indicator */}
        <div className="mb-6">
          {isConnected ? (
            <div className="flex flex-col items-center gap-4">
              {/* Glowing Orb */}
              <div 
                className="w-32 h-32 rounded-full transition-all duration-700"
                style={{
                  background: `linear-gradient(135deg, ${customColor}, ${customColor}dd)`,
                  boxShadow: isRecording 
                    ? `0 0 60px 15px ${customColor}99, 0 0 90px 25px ${customColor}44, inset 0 0 30px rgba(255, 255, 255, 0.2)`
                    : `0 0 30px 8px ${customColor}66, inset 0 0 15px rgba(255, 255, 255, 0.1)`,
                  animation: isRecording ? 'pulse 2s ease-in-out infinite' : 'none'
                }}
              />
              
              {/* Status Text */}
              <p className={`${subtextColor} text-center`}>
                {isRecording ? `${agentInfo.name} is speaking...` : 'Listening...'}
              </p>
            </div>
          ) : (
            <div className="text-center">
              <p className={`${subtextColor}`}>
                {isConnecting ? 'Connecting...' : status}
              </p>
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Action Button */}
        <div className="flex flex-col gap-3">
          {!isConnected ? (
            <button
              onClick={connect}
              disabled={isConnecting}
              className="w-full py-4 text-white rounded-lg font-semibold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
              style={{
                backgroundColor: customColor,
                opacity: isConnecting ? 0.5 : 1
              }}
            >
              {isConnecting ? 'Connecting...' : buttonText}
            </button>
          ) : (
            <button
              onClick={disconnect}
              className="w-full py-4 bg-red-500 text-white rounded-lg font-semibold text-lg hover:bg-red-600 transition-colors"
            >
              End Conversation
            </button>
          )}
        </div>

        {/* Powered By */}
        <div className="mt-6 text-center">
          <p className={`text-xs ${subtextColor}`}>
            Powered by <span className="font-semibold">Cosentus AI</span>
          </p>
        </div>
      </div>

      {/* Add pulse animation */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
      `}</style>
    </div>
  );
}
