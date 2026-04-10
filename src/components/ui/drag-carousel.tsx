"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useDragScroll } from "@/hooks/useDragScroll"
import { cn } from "@/lib/utils"

interface DragCarouselProps {
  children: React.ReactNode
  className?: string
  /** Gap between cards in rem. Default 1.5 */
  gap?: number
  /** Show prev/next arrow buttons on desktop */
  showArrows?: boolean
  /** How many px to scroll per arrow click */
  arrowStep?: number
}

/**
 * A horizontally scrollable drag carousel.
 * - Drag with mouse or touch to scroll
 * - Momentum glide after release
 * - Optional prev/next arrow buttons
 * - Hides scrollbar via CSS while keeping scroll functional
 */
export function DragCarousel({
  children,
  className,
  gap = 1.5,
  showArrows = true,
  arrowStep = 340,
}: DragCarouselProps) {
  const { ref, handlers } = useDragScroll<HTMLDivElement>({ friction: 0.90 })

  // Redirect vertical wheel events to the page so the page can scroll normally
  // even when the cursor is over the carousel.
  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault()
        window.scrollBy({ top: e.deltaY })
      }
    }
    el.addEventListener("wheel", onWheel, { passive: false })
    return () => el.removeEventListener("wheel", onWheel)
  }, [ref])

  function scrollBy(delta: number) {
    ref.current?.scrollBy({ left: delta, behavior: "smooth" })
  }

  return (
    <div className="relative group">
      {/* Left arrow */}
      {showArrows && (
        <button
          onClick={() => scrollBy(-arrowStep)}
          aria-label="Scroll left"
          className="absolute left-0 top-1/2 z-10 -translate-y-1/2 -translate-x-3 hidden md:flex items-center justify-center h-8 w-8 rounded-full border bg-background shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-accent"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      )}

      {/* Scrollable track */}
      <div
        ref={ref}
        {...handlers}
        data-carousel-track
        style={{ gap: `${gap}rem`, cursor: "grab" }}
        className={cn(
          // Hide scrollbar cross-browser while keeping scroll functional
          "flex overflow-x-auto scroll-smooth",
          "scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]",
          // Padding so cards at the edge don't clip their shadows
          "px-1 py-3",
          className
        )}
      >
        {children}
      </div>

      {/* Right arrow */}
      {showArrows && (
        <button
          onClick={() => scrollBy(arrowStep)}
          aria-label="Scroll right"
          className="absolute right-0 top-1/2 z-10 -translate-y-1/2 translate-x-3 hidden md:flex items-center justify-center h-8 w-8 rounded-full border bg-background shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-accent"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
