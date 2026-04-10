"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const links = [
  { label: "Profile", href: "/settings/profile" },
  { label: "Security", href: "/settings/security" },
  { label: "Preferences", href: "/settings/preferences" },
]

export function SettingsSidebar() {
  const pathname = usePathname()

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
    </nav>
  )
}
