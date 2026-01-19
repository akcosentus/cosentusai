'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useRetellAgent } from '@/hooks/useRetellAgent';
import { AGENTS } from '@/config/agents';

// Agent metadata matching landing page
const AGENT_INFO: Record<string, { 
  name: string; 
  subtitle: string;
  about: string;
  capabilities: string[];
  icon: React.ReactElement;
}> = {
  chloe: {
    name: 'Chloe',
    subtitle: 'Company Information Expert',
    about: 'Chloe specializes in providing comprehensive information about Cosentus services, pricing, and capabilities. She helps potential clients understand how our AI-powered solutions can transform their revenue cycle management.',
    capabilities: [
      'Company services overview',
      'Pricing and package information',
      'AI capabilities demonstration',
      'Custom solution consultation',
      'Integration guidance'
    ],
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-[#01B2D6]">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
      </svg>
    )
  },
  cindy: {
    name: 'Cindy',
    subtitle: 'Patient Billing Support',
    about: 'Cindy specializes in handling inbound patient calls for outstanding balance inquiries and payment processing. She provides clear, empathetic assistance to help patients understand and resolve their billing questions.',
    capabilities: [
      'Outstanding balance information',
      'Secure payment processing',
      'Speaks 50+ languages fluently',
      'Handles up to 20 calls simultaneously',
      'Payment plan setup assistance'
    ],
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-[#01B2D6]">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
      </svg>
    )
  },
  chris: {
    name: 'Chris',
    subtitle: 'Insurance Claim Follow-Up',
    about: 'Chris handles insurance claim follow-ups and denial resolution. He works with insurance carriers to track claim status, resolve denials, and ensure timely reimbursement for healthcare providers.',
    capabilities: [
      'Claim status tracking',
      'Denial resolution',
      'Carrier communication',
      'Appeals processing',
      'Reimbursement optimization'
    ],
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-[#01B2D6]">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
      </svg>
    )
  },
  cassidy: {
    name: 'Cassidy',
    subtitle: 'Anesthesia Cost Estimates',
    about: 'Cassidy helps patients understand what their anesthesia will cost before their scheduled surgery. She gathers procedure details, applies facility-specific pricing rules, and provides clear cost estimates for insured patients, self-pay patients, and cosmetic surgery cases.',
    capabilities: [
      'Pre-surgery anesthesia cost estimates',
      'Insurance and self-pay pricing calculations',
      'Facility-specific pricing rules application',
      'Unit-based and flat-rate pricing models',
      'Payment plan and financial assistance guidance',
      'Multi-hour complex surgery estimates',
      'Handles hundreds of estimate calls per day'
    ],
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-[#01B2D6]">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
      </svg>
    )
  },
  courtney: {
    name: 'Courtney',
    subtitle: 'Medical Appointment Scheduling',
    about: 'Courtney helps medical practices schedule patient appointments efficiently. She handles both outbound calls (calling patients to schedule) and inbound calls (patients calling to book). She gathers patient details, finds convenient appointment times, and coordinates with the practice\'s calendar system.',
    capabilities: [
      'Inbound and outbound scheduling',
      'Real-time calendar integration',
      'Appointment reminders and rescheduling',
      'Patient detail collection and confirmation',
      'Handles hundreds of scheduling calls per day'
    ],
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-[#01B2D6]">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
      </svg>
    )
  },
  cara: {
    name: 'Cara',
    subtitle: 'Eligibility & Benefits Verification',
    about: 'Cara verifies patient insurance eligibility and benefits before procedures. She ensures accurate coverage information and helps prevent claim denials due to eligibility issues.',
    capabilities: [
      'Real-time eligibility verification',
      'Benefits coverage analysis',
      'Pre-authorization requirements',
      'Coverage limitations identification',
      'Multi-payer support'
    ],
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-[#01B2D6]">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  carly: {
    name: 'Carly',
    subtitle: 'Prior Authorization Follow-Up',
    about: 'Carly manages prior authorization requests and follow-ups with insurance companies. She tracks authorization status and expedites approvals to prevent treatment delays.',
    capabilities: [
      'Authorization status tracking',
      'Expedited review requests',
      'Payer communication',
      'Documentation management',
      'Approval timeline optimization'
    ],
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-[#01B2D6]">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
      </svg>
    )
  },
  carson: {
    name: 'Carson',
    subtitle: 'Payment Reconciliation',
    about: 'Carson specializes in payment reconciliation and identifying discrepancies between expected and received payments. He helps practices recover missing revenue and maintain accurate financial records.',
    capabilities: [
      'Payment variance analysis',
      'Missing payment identification',
      'EOB reconciliation',
      'Underpayment recovery',
      'Financial reporting'
    ],
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-[#01B2D6]">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
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

  return (
    <div className="flex items-center justify-center min-h-screen p-8">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-12">
        <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center justify-center w-20 h-20 rounded-full bg-[#01B2D6]/10">
                {agentInfo.icon}
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
                  onClick={connect}
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
                  onClick={disconnect}
                  className="px-8 py-4 bg-red-500 text-white rounded-lg font-semibold text-lg hover:bg-red-600 transition-colors"
                >
                  End Conversation
                </button>
              )}
            </div>
        </div>
      </div>
    </div>
  );
}
