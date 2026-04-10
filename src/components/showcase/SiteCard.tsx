import { cn } from "@/lib/utils"

export interface SiteCardData {
  name: string
  tagline: string
  /** Tailwind gradient for the hero area of the mock browser */
  gradient: string
  /** Short headline shown in the mock hero */
  headline: string
  /** Category badge text */
  category: string
  /** Accent button colour class */
  buttonColor: string
}

interface SiteCardProps {
  site: SiteCardData
  className?: string
}

/**
 * Simulates a website screenshot using pure CSS / Tailwind.
 * Replace the mock browser with a real <Image> when screenshots are ready.
 */
export function SiteCard({ site, className }: SiteCardProps) {
  return (
    <div
      className={cn(
        "flex-none w-[320px] rounded-xl border bg-card shadow-sm overflow-hidden select-none",
        "transition-transform duration-200 hover:-translate-y-1 hover:shadow-md",
        className
      )}
    >
      {/* Mock browser chrome */}
      <div className="flex items-center gap-1.5 border-b bg-muted/50 px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-red-400" />
        <span className="h-2 w-2 rounded-full bg-yellow-400" />
        <span className="h-2 w-2 rounded-full bg-green-400" />
        <div className="ml-2 flex-1 rounded-full border bg-background px-3 py-0.5 text-[10px] text-muted-foreground truncate">
          {site.name.toLowerCase().replace(/\s/g, "")}.com
        </div>
      </div>

      {/* Mock hero */}
      <div className={cn("relative h-44 w-full", site.gradient)}>
        {/* Fake nav */}
        <div className="flex items-center justify-between px-4 py-2 bg-black/10">
          <span className="text-xs font-bold text-white">{site.name}</span>
          <span
            className={cn(
              "rounded px-2 py-0.5 text-[10px] font-semibold text-white",
              site.buttonColor
            )}
          >
            {site.category}
          </span>
        </div>

        {/* Fake hero content */}
        <div className="flex h-[calc(100%-2rem)] flex-col items-center justify-center gap-2 px-4 text-center">
          <p className="text-base font-bold leading-tight text-white drop-shadow">
            {site.headline}
          </p>
          <div
            className={cn(
              "rounded px-3 py-1 text-[10px] font-semibold text-white",
              site.buttonColor
            )}
          >
            Learn more →
          </div>
        </div>
      </div>

      {/* Card footer */}
      <div className="p-4">
        <p className="font-semibold text-sm">{site.name}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{site.tagline}</p>
      </div>
    </div>
  )
}
