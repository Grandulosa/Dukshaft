"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const steps = [
  {
    title: "Verify your email",
    description: "Check your inbox and click the verification link we sent you.",
  },
  {
    title: "Complete your profile",
    description: "Add a photo and bio in Settings → Profile.",
  },
  {
    title: "Explore the dashboard",
    description: "Your workspace is ready. Dive in whenever you're ready.",
  },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleComplete() {
    setLoading(true)
    try {
      await fetch("/api/user/onboarding", { method: "POST" })
      router.push("/dashboard")
      router.refresh()
    } catch {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome to Dukshaft Studio!</CardTitle>
          <CardDescription>
            Your account is ready. Here&apos;s what to do next.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3">
          {steps.map((step, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-lg border p-3"
            >
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <div>
                <p className="text-sm font-medium">{step.title}</p>
                <p className="text-xs text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </CardContent>

        <CardFooter>
          <Button className="w-full" onClick={handleComplete} disabled={loading}>
            {loading ? "Setting up…" : "Get started →"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
