"use client"

import Link from "next/link"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
]

interface MobileNavProps {
  user?: { name: string; avatarUrl?: string } | null
}

export function MobileNav({ user }: MobileNavProps) {
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : ""

  return (
    <div className="flex md:hidden ml-auto">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Dukshaft Studio</SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col gap-4 mt-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 mt-4 border-t pt-4">
              {user ? (
                <Link
                  href="/dashboard"
                  className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-accent transition-colors"
                >
                  <Avatar className="h-8 w-8">
                    {user.avatarUrl && (
                      <AvatarImage src={user.avatarUrl} alt={user.name} />
                    )}
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-sm">{user.name}</span>
                </Link>
              ) : (
                <>
                  <Button variant="outline" asChild>
                    <Link href="/login">Sign in</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/signup">Get Started</Link>
                  </Button>
                </>
              )}
            </div>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  )
}
