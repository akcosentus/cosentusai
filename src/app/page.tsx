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
        className="absolute inset-0 z-0 pointer-events-none" 
        style={{ color: '#01B2D6' }} 
      />
      {/* Top Navbar with Extended Fade */}
      <nav className="fixed top-0 left-1/2 -translate-x-1/2 z-50 pb-32" style={{ 
        background: 'radial-gradient(ellipse 100% 100% at 50% 0%, #01B2D6 0%, #01B2D6 15%, rgba(1, 178, 214, 0.8) 40%, rgba(1, 178, 214, 0.4) 60%, rgba(1, 178, 214, 0.1) 80%, rgba(1, 178, 214, 0) 100%)'
      }}>
        <div className="mx-auto flex items-center justify-center px-12 py-6">
          <ul className="flex items-center gap-8 text-base font-light text-white lg:gap-10 lg:text-lg">
            <li>
              <a href="#about" className="transition-all hover:text-white/80">
                About Us
              </a>
            </li>
            <li>
              <a href="#services" className="transition-all hover:text-white/80">
                Services
              </a>
            </li>
            <li>
              <a href="#partnership" className="transition-all hover:text-white/80">
                Partnership
              </a>
            </li>
            <li>
              <a href="#resources" className="transition-all hover:text-white/80">
                Resources
              </a>
            </li>
            <li>
              <a href="#blogs" className="transition-all hover:text-white/80">
                Blogs
              </a>
            </li>
            <li>
              <a href="#news" className="transition-all hover:text-white/80">
                News
              </a>
            </li>
            <li>
              <a href="#events" className="transition-all hover:text-white/80">
                Events
              </a>
            </li>
            <li>
              <a href="#care" className="transition-all hover:text-white/80">
                We Care
              </a>
            </li>
            <li>
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
    </main>
  )
}

