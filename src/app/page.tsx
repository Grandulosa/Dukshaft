"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { DragCarousel } from "@/components/ui/drag-carousel"
import { AppCard, type AppCardData } from "@/components/showcase/AppCard"
import { SiteCard, type SiteCardData } from "@/components/showcase/SiteCard"
import { ContactSection } from "@/components/showcase/ContactSection"
import { ArrowRight, Sparkles, Layers, Box, Star } from "lucide-react"

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

const reviews = [
  {
    name: "Sarah Mitchell",
    company: "Vanguard Creatives",
    role: "CEO",
    rating: 5,
    quote: "Dukshaft transformed our online presence completely. The attention to detail and the modern design exceeded every expectation we had.",
    gradient: "from-rose-500 to-pink-700",
  },
  {
    name: "James Okafor",
    company: "TechNova Solutions",
    role: "CTO",
    rating: 5,
    quote: "The enterprise application they built for us is rock-solid. Our team productivity has increased by 40% since deployment.",
    gradient: "from-blue-600 to-cyan-700",
  },
  {
    name: "Priya Sharma",
    company: "EcoTravel Adventures",
    role: "Founder",
    rating: 5,
    quote: "From the first call to launch, the experience was seamless. Our new website speaks exactly who we are as a brand.",
    gradient: "from-green-500 to-emerald-700",
  },
  {
    name: "Lucas Fernandez",
    company: "Bloom & Co.",
    role: "Marketing Director",
    rating: 5,
    quote: "We saw a 3x increase in online sales within the first month of our new site going live. Absolutely phenomenal work.",
    gradient: "from-fuchsia-500 to-purple-700",
  },
  {
    name: "Amara Diallo",
    company: "UrbanEats Guide",
    role: "Product Lead",
    rating: 5,
    quote: "The app they developed is exactly what our users needed. Clean, fast, and beautiful — our ratings jumped from 3.2 to 4.8.",
    gradient: "from-amber-500 to-orange-700",
  },
]

// 4 sticky sections (hero, websites, apps, reviews). Each advances every 35% of viewport height.
const SECTION_COUNT = 4
const STEP_RATIO = 0.35
// Navbar height in px (h-14 = 3.5rem = 56px)
const NAVBAR_PX = 56

export default function HomePage() {
  const [activeTab, setActiveTab] = useState(0)
  const isScrollingRef = useRef(false)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const contactRef = useRef<HTMLDivElement>(null)
  const hasAutoScrolledToContact = useRef(false)

  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual"
    }
    window.scrollTo(0, 0)

    const handleScroll = () => {
      if (isScrollingRef.current) return
      const scrollY = window.scrollY

      // The sticky container has height 175vh, so it unsticks at scrollY = 75vh.
      // We trigger the state change to '3' once the contact section is prominent (e.g. at 100vh).
      const contactThreshold = window.innerHeight * 1.4 + NAVBAR_PX
      if (scrollY >= contactThreshold) {
        setActiveTab(4)
        return
      }

      // Reset contact auto-scroll flag if user scrolls back up
      if (scrollY < contactThreshold - 100) {
        hasAutoScrolledToContact.current = false
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
    if (index === 4) {
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

      {/* Sticky scroll area — 175vh gives sections 0-2 their scroll range while
          eliminating the huge gap before the contact section */}
      <div className="relative w-full h-[210vh]">

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
                  onClick={() => scrollTo(4)}
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

          {/* Section 3: Client Reviews (Keep rendered during transition to contact) */}
          {(activeTab === 3 || activeTab === 4) && (
            <section className="absolute inset-0 flex flex-col items-center justify-center animate-in fade-in zoom-in-95 slide-in-from-bottom-8 duration-700 ease-out fill-mode-both w-full">
              <div className="absolute left-0 top-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[150px] -z-10 pointer-events-none" />

              <div className="container mb-12 flex flex-col items-center text-center">
                <div className="inline-flex items-center justify-center p-3.5 mb-6 rounded-2xl bg-amber-500/10 ring-1 ring-amber-500/20 shadow-sm">
                  <Star className="w-7 h-7 text-amber-600 dark:text-amber-400" />
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">Client Reviews</h2>
                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl font-light">
                  Don&apos;t just take our word for it. Here&apos;s what our clients say about working with Dukshaft.
                </p>
              </div>

              <div className="w-full px-[max(1rem,calc((100vw-1400px)/2+2rem))]">
                <DragCarousel arrowStep={360}>
                  {reviews.map((review) => (
                    <div
                      key={review.name}
                      className="flex-shrink-0 w-[340px] rounded-2xl overflow-hidden bg-card border border-border/50 shadow-lg p-6 flex flex-col gap-4 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
                    >
                      <div className="flex gap-1">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <p className="text-base text-muted-foreground leading-relaxed flex-1">&quot;{review.quote}&quot;</p>
                      <div className="flex items-center gap-3 pt-2 border-t border-border/50">
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${review.gradient} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                          {review.name[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{review.name}</p>
                          <p className="text-xs text-muted-foreground">{review.role} · {review.company}</p>
                        </div>
                      </div>
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
        {[0, 1, 2, 3, 4].map((idx) => (
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
