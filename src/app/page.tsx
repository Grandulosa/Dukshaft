"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { DragCarousel } from "@/components/ui/drag-carousel"
import { AppCard, type AppCardData } from "@/components/showcase/AppCard"
import { SiteCard, type SiteCardData } from "@/components/showcase/SiteCard"
import { ContactSection } from "@/components/showcase/ContactSection"
import { ArrowRight, Sparkles, Layers, Box } from "lucide-react"

const apps: AppCardData[] = [
  {
    name: "TaskMaster Pro",
    tagline: "Smart project & task management",
    gradient: "bg-gradient-to-br from-blue-600 to-indigo-700",
    accent: "bg-blue-400",
    uiLabel: "Dashboard",
    icon: "✅",
  },
  {
    name: "ChatSphere",
    tagline: "Real-time team communication",
    gradient: "bg-gradient-to-br from-violet-600 to-purple-700",
    accent: "bg-violet-400",
    uiLabel: "Channels",
    icon: "💬",
  },
  {
    name: "FinanceTrack",
    tagline: "Expense & budget analytics",
    gradient: "bg-gradient-to-br from-emerald-500 to-teal-700",
    accent: "bg-emerald-400",
    uiLabel: "Analytics",
    icon: "📊",
  },
  {
    name: "FitBuddy",
    tagline: "Personal fitness companion",
    gradient: "bg-gradient-to-br from-orange-500 to-red-600",
    accent: "bg-orange-400",
    uiLabel: "Workouts",
    icon: "🏋️",
  },
  {
    name: "NoteFlow",
    tagline: "Linked knowledge & notes",
    gradient: "bg-gradient-to-br from-amber-500 to-yellow-600",
    accent: "bg-amber-400",
    uiLabel: "Notes",
    icon: "📝",
  },
  {
    name: "ShipLog",
    tagline: "Deployment & release tracking",
    gradient: "bg-gradient-to-br from-slate-600 to-gray-800",
    accent: "bg-slate-400",
    uiLabel: "Releases",
    icon: "🚀",
  },
]

const sites: SiteCardData[] = [
  {
    name: "Vanguard Creatives",
    tagline: "Award-winning design agency",
    gradient: "bg-gradient-to-br from-rose-500 to-pink-700",
    headline: "Bold ideas. Flawless execution.",
    category: "Agency",
    buttonColor: "bg-rose-600",
  },
  {
    name: "EcoTravel Adventures",
    tagline: "Sustainable adventure travel",
    gradient: "bg-gradient-to-br from-green-500 to-emerald-700",
    headline: "Explore the world responsibly.",
    category: "Travel",
    buttonColor: "bg-green-600",
  },
  {
    name: "TechNova Solutions",
    tagline: "Enterprise software consulting",
    gradient: "bg-gradient-to-br from-blue-600 to-cyan-700",
    headline: "Powering the next era of tech.",
    category: "Tech",
    buttonColor: "bg-blue-600",
  },
  {
    name: "Bloom & Co.",
    tagline: "Premium floral & gift boutique",
    gradient: "bg-gradient-to-br from-fuchsia-500 to-purple-700",
    headline: "Every moment deserves beauty.",
    category: "Retail",
    buttonColor: "bg-fuchsia-600",
  },
  {
    name: "UrbanEats Guide",
    tagline: "City food discovery platform",
    gradient: "bg-gradient-to-br from-amber-500 to-orange-700",
    headline: "Your city. Your next bite.",
    category: "Food",
    buttonColor: "bg-amber-600",
  },
]

// 3 sticky sections (hero, websites, apps). Each advances every 35% of viewport height.
// h-[200vh] container: section 2 activates at 70vh scroll, sticky unsticks at ~100vh,
// giving ~30vh of hold time before the contact section flows in naturally.
const SECTION_COUNT = 3
const STEP_RATIO = 0.35
// Navbar height in px (h-14 = 3.5rem = 56px)
const NAVBAR_PX = 56

export default function HomePage() {
  const [activeTab, setActiveTab] = useState(0)
  const isScrollingRef = useRef(false)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const contactRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual"
    }
    window.scrollTo(0, 0)

    const handleScroll = () => {
      if (isScrollingRef.current) return
      const scrollY = window.scrollY

      // Once the sticky container (h-[200vh]) has scrolled past, show contact dot active.
      // Sticky unsticks when scrollY > NAVBAR_PX + window.innerHeight (= 200vh - 100vh + navbar offset).
      const unstickScroll = window.innerHeight + NAVBAR_PX
      if (scrollY >= unstickScroll) {
        setActiveTab(3)
        return
      }

      const step = window.innerHeight * STEP_RATIO
      let next = Math.floor((scrollY + step / 2) / step)
      if (next < 0) next = 0
      if (next >= SECTION_COUNT) next = SECTION_COUNT - 1
      setActiveTab(next)
    }

    const handleScrollEnd = () => {
      isScrollingRef.current = false
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("scrollend", handleScrollEnd, { passive: true })
    handleScroll()
    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("scrollend", handleScrollEnd)
    }
  }, [])

  const scrollTo = (index: number) => {
    if (index === 3) {
      contactRef.current?.scrollIntoView({ behavior: "smooth" })
      return
    }
    isScrollingRef.current = true
    setActiveTab(index)
    window.scrollTo({ top: index * window.innerHeight * STEP_RATIO, behavior: "smooth" })

    // Fallback for browsers without 'scrollend' support
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)
    scrollTimeoutRef.current = setTimeout(() => {
      isScrollingRef.current = false
    }, 1000)
  }

  return (
    <div className="relative w-full bg-transparent selection:bg-primary selection:text-primary-foreground">

      {/* Sticky scroll area — 200vh gives sections 0-2 their scroll range with ~30vh hold
          on section 2 before the contact section scrolls into view naturally below */}
      <div className="relative w-full h-[200vh]">

        {/* Sticky viewport — sits flush below the 56 px navbar (h-14 = 3.5 rem) */}
        <div className="sticky top-14 left-0 w-full h-[calc(100dvh-3.5rem)] overflow-hidden flex flex-col items-center justify-center">

          {/* Section 0: Hero */}
          {activeTab === 0 && (
            <section className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 animate-in fade-in zoom-in-95 slide-in-from-bottom-8 duration-700 ease-out fill-mode-both">
              <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 backdrop-blur-md px-5 py-2 text-sm font-medium text-primary mb-10 shadow-sm hover:bg-primary/10 transition-colors cursor-default">
                <Sparkles className="w-4 h-4 mr-2" />
                The standard for modern digital experiences
              </div>

              <h1 className="max-w-5xl text-5xl font-extrabold tracking-tighter sm:text-7xl lg:text-[5.5rem] leading-[1.1]">
                Websites and Mobile Apps <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400">
                  Built for Growth
                </span>
              </h1>
              <p className="mt-8 max-w-2xl text-xl md:text-2xl text-muted-foreground leading-relaxed font-light">
                At Dukshaft, we craft modern websites and powerful mobile applications that combine stunning design, smart functionality, and real business impact.
              </p>

              <div className="mt-12 flex flex-col sm:flex-row gap-5">
                <Button
                  size="lg"
                  className="rounded-full h-14 px-8 text-lg font-medium shadow-[0_0_40px_-10px_rgba(79,70,229,0.5)] transition-all hover:scale-105 hover:shadow-[0_0_60px_-15px_rgba(79,70,229,0.7)] group"
                  onClick={() => scrollTo(1)}
                >
                  Explore Our Work <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full h-14 px-8 text-lg font-medium backdrop-blur-sm bg-background/50 border-primary/20 hover:bg-primary/5 transition-all"
                  onClick={() => scrollTo(3)}
                >
                  Get in Touch
                </Button>
              </div>
            </section>
          )}

          {/* Section 1: Websites */}
          {activeTab === 1 && (
            <section className="absolute inset-0 flex flex-col items-center justify-center animate-in fade-in zoom-in-95 slide-in-from-bottom-8 duration-700 ease-out fill-mode-both w-full">
              <div className="absolute top-1/2 left-0 w-full h-[600px] bg-gradient-to-b from-transparent via-purple-500/5 to-transparent -translate-y-1/2 -z-10 pointer-events-none" />

              <div className="container mb-12 flex flex-col items-center text-center">
                <div className="inline-flex items-center justify-center p-3.5 mb-6 rounded-2xl bg-purple-500/10 ring-1 ring-purple-500/20 shadow-sm">
                  <Layers className="w-7 h-7 text-purple-600 dark:text-purple-400" />
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">Mastercrafted Websites</h2>
                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl font-light">
                  Immersive, highly optimized web experiences that captivate users and convert leads. Engineered for speed, designed for absolute impact.
                </p>
              </div>

              <div className="w-full px-[max(1rem,calc((100vw-1400px)/2+2rem))]">
                <DragCarousel arrowStep={340}>
                  {sites.map((site) => (
                    <div key={site.name} className="transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl rounded-2xl">
                      <SiteCard site={site} />
                    </div>
                  ))}
                </DragCarousel>
              </div>
            </section>
          )}

          {/* Section 2: Apps */}
          {activeTab === 2 && (
            <section className="absolute inset-0 flex flex-col items-center justify-center animate-in fade-in zoom-in-95 slide-in-from-bottom-8 duration-700 ease-out fill-mode-both w-full">
              <div className="absolute right-0 bottom-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[150px] -z-10 pointer-events-none" />

              <div className="container mb-12 flex flex-col items-center text-center">
                <div className="inline-flex items-center justify-center p-3.5 mb-6 rounded-2xl bg-blue-500/10 ring-1 ring-blue-500/20 shadow-sm">
                  <Box className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">Enterprise Applications</h2>
                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl font-light">
                  Robust, scalable, and intuitive applications built on bleeding-edge modern stacks. We handle the complexity so your users experience absolute simplicity.
                </p>
              </div>

              <div className="w-full px-[max(1rem,calc((100vw-1400px)/2+2rem))]">
                <DragCarousel arrowStep={280}>
                  {apps.map((app) => (
                    <div key={app.name} className="transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl rounded-2xl">
                      <AppCard app={app} />
                    </div>
                  ))}
                </DragCarousel>
              </div>
            </section>
          )}

        </div>
      </div>

      {/* Contact section — normal page flow, scrolls in naturally after the sticky area */}
      <div ref={contactRef}>
        <ContactSection />
      </div>

      {/* Dot navigation */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-50">
        {[0, 1, 2, 3].map((idx) => (
          <button
            key={idx}
            onClick={() => scrollTo(idx)}
            className={`w-3 h-3 rounded-full transition-all duration-500 ${
              activeTab === idx
                ? "bg-primary scale-150 shadow-[0_0_15px_3px_rgba(79,70,229,0.5)]"
                : "bg-muted hover:bg-muted-foreground hover:scale-110"
            }`}
            aria-label={`Go to section ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
