import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function LandingPage() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center bg-black overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://assets.nflxext.com/ffe/siteui/vlv3/f841d4c7-10e6-40c4-821e-42b6e8a6edd7/f9368347-e982-4856-a5a4-396796381f28/US-en-20240101-popsignuptwoweeks-perspective_alpha_website_large.jpg')] bg-cover bg-center opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60" />

      <nav className="absolute top-0 left-0 right-0 flex items-center justify-between px-12 py-6 z-10">
        <span className="text-[#e50914] text-4xl font-black tracking-tight select-none">NETFLIX</span>
        <Link href="/sign-in">
          <Button className="bg-[#e50914] hover:bg-[#f40612] text-white font-semibold px-5 py-2 rounded">
            Sign In
          </Button>
        </Link>
      </nav>

      <div className="relative z-10 text-center text-white max-w-3xl px-6">
        <h1 className="text-5xl md:text-7xl font-black mb-4 leading-tight">
          Unlimited movies, TV shows, and more
        </h1>
        <p className="text-xl md:text-2xl mb-4 font-medium">Watch anywhere. Cancel anytime.</p>
        <p className="text-lg mb-8 text-gray-200">Ready to watch? Create an account to get started.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/sign-up">
            <Button size="lg" className="bg-[#e50914] hover:bg-[#f40612] text-white font-bold text-lg px-10 py-6 rounded">
              Get Started
            </Button>
          </Link>
          <Link href="/sign-in">
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 font-bold text-lg px-10 py-6 rounded">
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
