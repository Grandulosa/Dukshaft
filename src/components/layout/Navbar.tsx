import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { getSession } from "@/lib/auth"
import { connectDB } from "@/lib/db"
import User from "@/models/User"
import { MobileNav } from "./MobileNav"

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
]

export async function Navbar() {
  const session = await getSession()

  let navUser: { name: string; avatarUrl?: string } | null = null
  if (session) {
    await connectDB()
    const user = await User.findById(session.sub).select("name avatarUrl").lean()
    if (user) {
      navUser = {
        name: (user as { name: string; avatarUrl?: string }).name,
        avatarUrl: (user as { name: string; avatarUrl?: string }).avatarUrl,
      }
    }
  }

  const initials = navUser?.name
    ? navUser.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : ""

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        {/* Logo */}
        <Link href="/" className="mr-6 flex items-center">
          <span className="font-bold text-xl">Dukshaft Studio</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex flex-1 items-center gap-6 text-sm">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-2 ml-auto">
          {navUser ? (
            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-full px-3 py-1.5 hover:bg-accent transition-colors"
            >
              <Avatar className="h-7 w-7">
                {navUser.avatarUrl && (
                  <AvatarImage src={navUser.avatarUrl} alt={navUser.name} />
                )}
                <AvatarFallback className="text-xs">{initials}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{navUser.name}</span>
            </Link>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Sign in</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/signup">Get Started</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile menu */}
        <MobileNav user={navUser} />
      </div>
    </header>
  )
}
