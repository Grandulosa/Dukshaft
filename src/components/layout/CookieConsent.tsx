"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Cookie, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CookieConsent() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    // Only show if the user hasn't made a choice yet
    const consent = localStorage.getItem("dukshaft_cookie_consent")
    if (!consent) {
      // Delay showing the banner slightly for better UX
      const timer = setTimeout(() => setShow(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  const acceptAll = () => {
    localStorage.setItem("dukshaft_cookie_consent", "all")
    setShow(false)
  }

  const acceptNecessary = () => {
    localStorage.setItem("dukshaft_cookie_consent", "necessary")
    setShow(false)
  }

  if (!show) return null

  return (
    <div className="fixed bottom-4 right-4 left-4 sm:left-auto sm:w-[450px] z-[100] bg-background/80 backdrop-blur-xl border border-border shadow-2xl rounded-2xl p-6 animate-in slide-in-from-bottom-8 fade-in duration-500">
      <div className="flex items-start gap-4">
        <div className="rounded-full bg-primary/10 p-3 mt-1 hidden sm:block">
          <Cookie className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Cookie className="w-5 h-5 text-primary sm:hidden" />
              We value your privacy
            </h3>
            <button
              onClick={acceptNecessary}
              className="text-muted-foreground hover:text-foreground transition-colors p-1"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            We use cookies and similar technologies to improve your experience, analyze our traffic, and personalize content. By clicking "Accept All", you consent to our use of cookies. Read our{" "}
            <Link href="/legal/privacy" className="text-primary hover:underline font-medium">
              Privacy Policy
            </Link>{" "}
            for more details.
          </p>
          <div className="mt-5 flex flex-col-reverse sm:flex-row gap-3">
            <Button
              variant="outline"
              className="w-full sm:w-auto font-medium"
              onClick={acceptNecessary}
            >
              Decline Optional
            </Button>
            <Button
              className="w-full sm:w-auto font-medium sm:ml-auto"
              onClick={acceptAll}
            >
              Accept All
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
