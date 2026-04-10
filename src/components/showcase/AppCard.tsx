import { cn } from "@/lib/utils"

export interface AppCardData {
  name: string
  tagline: string
  /** Tailwind gradient classes for the mock-screen background */
  gradient: string
  /** Accent colour for the top bar dot */
  accent: string
  /** Short UI label shown inside the mock screen */
  uiLabel: string
  /** Icon character or emoji to display in mock screen */
  icon: string
}

interface AppCardProps {
  app: AppCardData
  className?: string
}

/**
 * Simulates an app screenshot using pure CSS / Tailwind.
 * Replace the inner mock-screen div with a real <Image> when
 * actual screenshots are available.
 */
export function AppCard({ app, className }: AppCardProps) {
  return (
    <div
      className={cn(
        "flex-none w-[260px] rounded-xl border bg-card shadow-sm overflow-hidden select-none",
        "transition-transform duration-200 hover:-translate-y-1 hover:shadow-md",
        className
      )}
    >
      {/* Mock screen */}
      <div className={cn("relative h-40 w-full", app.gradient)}>
        {/* Fake window chrome */}
        <div className="absolute inset-x-0 top-0 flex items-center gap-1.5 bg-black/20 px-3 py-2 backdrop-blur-sm">
          <span className="h-2 w-2 rounded-full bg-red-400" />
          <span className="h-2 w-2 rounded-full bg-yellow-400" />
          <span className="h-2 w-2 rounded-full bg-green-400" />
          <span className="ml-2 flex-1 rounded bg-white/10 px-2 py-0.5 text-[10px] text-white/70 truncate">
            {app.name.toLowerCase().replace(/\s/g, "-")}.app
          </span>
        </div>

        {/* Fake app content */}
        <div className="flex h-full flex-col items-center justify-center gap-2 pt-6">
          <span className="text-4xl" role="img" aria-label={app.name}>
            {app.icon}
          </span>
          <span className="rounded-full bg-white/20 px-3 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
            {app.uiLabel}
          </span>
        </div>
      </div>

      {/* Card footer */}
      <div className="p-4">
        <p className="font-semibold text-sm">{app.name}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{app.tagline}</p>
      </div>
    </div>
  )
}
