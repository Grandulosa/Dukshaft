"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LogOut } from "lucide-react"
import { cn } from "@/lib/utils"

const links = [
  { label: "Profile", href: "/settings/profile" },
  { label: "Security", href: "/settings/security" },
  { label: "Preferences", href: "/settings/preferences" },
]

export function SettingsSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/login")
    router.refresh()
  }

  return (
    <nav className="flex flex-row gap-1 md:flex-col" aria-label="Settings navigation">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "rounded-md px-3 py-2 text-sm font-medium transition-colors",
            pathname === link.href
              ? "bg-secondary text-secondary-foreground"
              : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
          )}
        >
          {link.label}
        </Link>
      ))}
      <div className="mt-2 md:mt-auto md:pt-4 md:border-t">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </button>
      </div>
    </nav>
  )
}
