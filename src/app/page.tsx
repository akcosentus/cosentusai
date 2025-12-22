'use client';

import { GravityStarsBackground } from '@/components/animate-ui/components/backgrounds/gravity-stars';
import { useState } from 'react';
import { useRealtimeVoice } from '@/hooks/useRealtimeVoice';

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean }>>([]);
  const [inputValue, setInputValue] = useState('');
  const [activeDemo, setActiveDemo] = useState<string | null>(null);

  const { isConnected, isRecording, error, connect, disconnect } = useRealtimeVoice({
    scenario: activeDemo || undefined,
    onTranscript: (text, isUser) => {
      setMessages(prev => [...prev, { text, isUser }]);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setMessages([...messages, { text: inputValue, isUser: true }]);
      setInputValue('');
      setIsChatOpen(true);
      
      // Simulate AI response
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          text: "Thanks for your message! Our AI assistant is processing your request.", 
          isUser: false 
        }]);
      }, 1000);
    }
  };

  const handleStartVoiceDemo = async (demoType: string) => {
    setActiveDemo(demoType);
    setIsChatOpen(true);
    setMessages([{ text: `Starting ${demoType} demo... Please allow microphone access.`, isUser: false }]);
    await connect();
  };

  const handleEndVoiceDemo = () => {
    disconnect();
    setActiveDemo(null);
    setMessages(prev => [...prev, { text: 'Voice demo ended.', isUser: false }]);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-white">
      {/* Gravity Stars Animated Background */}
      <GravityStarsBackground 
        starsCount={300}
        starsOpacity={1}
        glowIntensity={30}
        movementSpeed={0.6}
        starsInteraction={true}
        starsInteractionType="merge"
        className="absolute inset-0 z-0 pointer-events-none" 
        style={{ color: '#01B2D6' }} 
      />
      {/* Top Navbar with Extended Fade */}
      <nav 
        className="fixed top-0 z-30 pb-24 pointer-events-none transition-all duration-500" 
        style={{ 
          background: 'radial-gradient(ellipse 65vw 80% at 50% 0%, #01B2D6 0%, #01B2D6 25%, rgba(1, 178, 214, 0.8) 45%, rgba(1, 178, 214, 0.5) 65%, rgba(1, 178, 214, 0.2) 82%, rgba(1, 178, 214, 0.05) 95%, rgba(1, 178, 214, 0) 100%)',
          left: isChatOpen ? '40vw' : '50%',
          transform: 'translateX(-50%)',
          width: isChatOpen ? '80vw' : '100vw'
        }}
      >
        <div className="mx-auto flex items-center justify-center px-4 py-6 sm:px-8 pointer-events-auto">
          <ul className="flex flex-wrap items-center justify-center gap-4 text-sm font-light text-white sm:gap-6 md:gap-8 md:text-base lg:gap-10 lg:text-lg">
            <li className="whitespace-nowrap">
              <a href="#about" className="transition-all hover:text-white/80">
                About Us
              </a>
            </li>
            <li className="whitespace-nowrap">
              <a href="#services" className="transition-all hover:text-white/80">
                Services
              </a>
            </li>
            <li className="whitespace-nowrap">
              <a href="#partnership" className="transition-all hover:text-white/80">
                Partnership
              </a>
            </li>
            <li className="whitespace-nowrap">
              <a href="#resources" className="transition-all hover:text-white/80">
                Resources
              </a>
            </li>
            <li className="whitespace-nowrap">
              <a href="#blogs" className="transition-all hover:text-white/80">
                Blogs
              </a>
            </li>
            <li className="whitespace-nowrap">
              <a href="#news" className="transition-all hover:text-white/80">
                News
              </a>
            </li>
            <li className="whitespace-nowrap">
              <a href="#events" className="transition-all hover:text-white/80">
                Events
              </a>
            </li>
            <li className="whitespace-nowrap">
              <a href="#care" className="transition-all hover:text-white/80">
                We Care
              </a>
            </li>
            <li className="whitespace-nowrap">
              <a href="#contact" className="transition-all hover:text-white/80">
                Contact Us
              </a>
            </li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <div 
        className="relative z-10 flex min-h-screen items-center justify-center px-6 py-12 transition-all duration-500"
        style={{ marginRight: isChatOpen ? '20vw' : '0' }}
      >
        <div className="max-w-5xl text-center">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl md:text-7xl lg:text-8xl">
            One platform. Patient to payment.
          </h1>
          
          <p className="mt-8 text-lg text-gray-700 sm:text-xl md:text-2xl lg:mt-10">
            Stop juggling vendors. Full-cycle healthcare automation built on 25 years of expertise.
          </p>
          
          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6 lg:mt-16">
            <button className="w-full rounded-lg bg-[#01B2D6] px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-[#0195b3] focus:outline-none focus:ring-4 focus:ring-[#01B2D6]/50 sm:w-auto sm:text-xl">
              See Our AI
            </button>
            
            <button className="w-full rounded-lg border-2 border-gray-900 bg-transparent px-8 py-4 text-lg font-semibold text-gray-900 transition-all hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-400 sm:w-auto sm:text-xl">
              Watch Demo
            </button>
          </div>
        </div>
      </div>

      {/* Voice Demo Section */}
      <section 
        className="relative z-10 py-24 px-6 transition-all duration-500"
        style={{ marginRight: isChatOpen ? '20vw' : '0' }}
      >
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              Experience AI Voice Assistance
            </h2>
            <p className="mt-6 text-lg text-gray-600 sm:text-xl max-w-3xl mx-auto">
              Try our real-time voice agents powered by OpenAI. Natural conversations for healthcare workflows.
            </p>
          </div>

          {/* Demo Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Patient Intake Demo */}
            <div className="group relative bg-white rounded-2xl border border-gray-200 p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#01B2D6]/10 mb-6 group-hover:bg-[#01B2D6]/20 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-[#01B2D6]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">Patient Intake</h3>
              <p className="text-gray-600 mb-6">
                Automated patient information collection with natural conversation flow.
              </p>
              <button 
                onClick={() => handleStartVoiceDemo('patient-intake')}
                disabled={isConnected}
                className="w-full rounded-lg bg-[#01B2D6] px-6 py-3 text-base font-semibold text-white transition-all hover:bg-[#0195b3] focus:outline-none focus:ring-4 focus:ring-[#01B2D6]/50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isConnected && activeDemo === 'patient-intake' ? 'Demo Active' : 'Try Demo'}
              </button>
            </div>

            {/* Appointment Booking Demo */}
            <div className="group relative bg-white rounded-2xl border border-gray-200 p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#01B2D6]/10 mb-6 group-hover:bg-[#01B2D6]/20 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-[#01B2D6]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">Appointment Booking</h3>
              <p className="text-gray-600 mb-6">
                Schedule appointments through voice with intelligent calendar management.
              </p>
              <button 
                onClick={() => handleStartVoiceDemo('appointment-booking')}
                disabled={isConnected}
                className="w-full rounded-lg bg-[#01B2D6] px-6 py-3 text-base font-semibold text-white transition-all hover:bg-[#0195b3] focus:outline-none focus:ring-4 focus:ring-[#01B2D6]/50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isConnected && activeDemo === 'appointment-booking' ? 'Demo Active' : 'Try Demo'}
              </button>
            </div>

            {/* Symptom Checker Demo */}
            <div className="group relative bg-white rounded-2xl border border-gray-200 p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#01B2D6]/10 mb-6 group-hover:bg-[#01B2D6]/20 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-[#01B2D6]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">Symptom Checker</h3>
              <p className="text-gray-600 mb-6">
                AI-powered symptom assessment with empathetic conversation.
              </p>
              <button 
                onClick={() => handleStartVoiceDemo('symptoms')}
                disabled={isConnected}
                className="w-full rounded-lg bg-[#01B2D6] px-6 py-3 text-base font-semibold text-white transition-all hover:bg-[#0195b3] focus:outline-none focus:ring-4 focus:ring-[#01B2D6]/50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isConnected && activeDemo === 'symptoms' ? 'Demo Active' : 'Try Demo'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Search Bar */}
      <div 
        className="fixed bottom-8 z-50 w-full px-4 transition-all duration-500"
        style={{ 
          left: isChatOpen ? '40vw' : '50%',
          transform: isChatOpen ? 'translateX(-50%)' : 'translateX(-50%)',
          maxWidth: isChatOpen ? '35vw' : '48rem'
        }}
      >
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

          {/* Microphone Icon */}
          <button type="submit" className="absolute right-5 flex h-10 w-10 items-center justify-center rounded-full bg-[#01B2D6] text-white hover:bg-[#0195b3] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </button>
        </form>
      </div>

      {/* Chat Window - Right Side */}
      <div 
        className={`fixed top-0 right-0 h-screen w-[20vw] bg-white border-l border-gray-200 shadow-2xl z-50 transition-transform duration-500 flex flex-col ${
          isChatOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Chat Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-black">
          <div className="flex items-center gap-3">
            <img 
              src="https://cosentus.com/wp-content/uploads/2021/08/New-Cosentus-Logo-1.png" 
              alt="Cosentus" 
              className="h-6 w-auto"
            />
            {isRecording && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-white/80">Recording</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {isConnected && (
              <button 
                onClick={handleEndVoiceDemo}
                className="px-3 py-1 text-sm bg-white/20 hover:bg-white/30 text-white rounded transition-colors"
              >
                End Call
              </button>
            )}
            <button 
              onClick={() => {
                setIsChatOpen(false);
                if (isConnected) disconnect();
              }}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800">
              Error: {error}
            </div>
          )}
          {messages.map((message, index) => (
            <div 
              key={index}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                  message.isUser 
                    ? 'bg-[#01B2D6] text-white' 
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="text-sm">{message.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

