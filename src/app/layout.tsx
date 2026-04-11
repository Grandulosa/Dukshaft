import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { CookieConsent } from "@/components/layout/CookieConsent"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Dukshaft Studio",
    template: "%s | Dukshaft Studio",
  },
  description: "Building great products for modern teams.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  ),
}

import { InteractiveBackground } from "@/components/layout/InteractiveBackground"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <InteractiveBackground />
        <div className="flex min-h-screen flex-col relative z-0">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <Toaster />
        <CookieConsent />
      </body>
    </html>
  )
}
