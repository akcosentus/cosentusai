import { GravityStarsBackground } from '@/components/animate-ui/components/backgrounds/gravity-stars';

export default function Home() {
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
      <nav className="fixed top-0 left-1/2 -translate-x-1/2 z-50 pb-24 w-[100vw] pointer-events-none" style={{ 
        background: 'radial-gradient(ellipse 65vw 80% at 50% 0%, #01B2D6 0%, #01B2D6 20%, rgba(1, 178, 214, 0.8) 40%, rgba(1, 178, 214, 0.5) 60%, rgba(1, 178, 214, 0.2) 80%, rgba(1, 178, 214, 0.05) 95%, rgba(1, 178, 214, 0) 100%)'
      }}>
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
      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-12">
        <div className="max-w-5xl text-center">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl md:text-7xl lg:text-8xl">
            One platform. Patient to payment.
          </h1>
          
          <p className="mt-8 text-xl text-gray-700 sm:text-2xl md:text-3xl lg:mt-10">
            Stop juggling vendors. Full-cycle healthcare automation built on 25 years of expertise.
          </p>
          
          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6 lg:mt-16">
            <button className="w-full rounded-lg bg-[#01B2D6] px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-[#0195b3] focus:outline-none focus:ring-4 focus:ring-[#01B2D6]/50 sm:w-auto sm:text-xl">
              Chat with AI
            </button>
            
            <button className="w-full rounded-lg border-2 border-gray-900 bg-transparent px-8 py-4 text-lg font-semibold text-gray-900 transition-all hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-400 sm:w-auto sm:text-xl">
              Watch Demo
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Search Bar */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-3xl px-4">
        <div className="relative flex items-center rounded-full border border-gray-300 bg-white shadow-2xl">
          {/* Plus Icon */}
          <button className="absolute left-5 flex h-10 w-10 items-center justify-center text-gray-500 hover:text-gray-700 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>

          {/* Input */}
          <input
            type="text"
            placeholder="Ask anything"
            className="w-full rounded-full py-4 pl-20 pr-20 text-base text-gray-900 placeholder-gray-400 focus:outline-none"
          />

          {/* Microphone Icon */}
          <button className="absolute right-5 flex h-10 w-10 items-center justify-center rounded-full bg-[#01B2D6] text-white hover:bg-[#0195b3] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
            </svg>
          </button>
        </div>
      </div>
    </main>
  )
}

