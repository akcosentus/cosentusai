import { GravityStarsBackground } from '@/components/animate-ui/components/backgrounds/gravity-stars';

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-white">
      {/* Gravity Stars Animated Background */}
      <GravityStarsBackground 
        starsCount={200}
        className="absolute inset-0 z-0 pointer-events-none" 
        style={{ color: '#01B2D6' }} 
      />
      {/* Glassmorphic Navbar */}
      <nav className="fixed left-1/2 top-8 z-50 -translate-x-1/2 transform">
        <div className="rounded-full border border-gray-200 bg-white/80 px-8 py-4 shadow-2xl backdrop-blur-md">
          <ul className="flex items-center gap-6 text-sm font-medium text-gray-900 lg:gap-8 lg:text-base">
            <li>
              <a href="#about" className="transition-all hover:text-[#01B2D6]">
                About Us
              </a>
            </li>
            <li>
              <a href="#services" className="transition-all hover:text-[#01B2D6]">
                Services
              </a>
            </li>
            <li>
              <a href="#partnership" className="transition-all hover:text-[#01B2D6]">
                Partnership
              </a>
            </li>
            <li>
              <a href="#resources" className="transition-all hover:text-[#01B2D6]">
                Resources
              </a>
            </li>
            <li>
              <a href="#blogs" className="transition-all hover:text-[#01B2D6]">
                Blogs
              </a>
            </li>
            <li>
              <a href="#news" className="transition-all hover:text-[#01B2D6]">
                News
              </a>
            </li>
            <li>
              <a href="#events" className="transition-all hover:text-[#01B2D6]">
                Events
              </a>
            </li>
            <li>
              <a href="#care" className="transition-all hover:text-[#01B2D6]">
                We Care
              </a>
            </li>
            <li>
              <a href="#contact" className="transition-all hover:text-[#01B2D6]">
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
    </main>
  )
}

