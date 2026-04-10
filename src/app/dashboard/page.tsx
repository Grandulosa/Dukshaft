import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { connectDB } from "@/lib/db"
import User from "@/models/User"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import EmailVerificationBanner from "@/components/dashboard/EmailVerificationBanner"

export default async function DashboardPage() {
  const session = await getSession()
  if (!session) redirect("/login")

  await connectDB()
  const user = await User.findById(session.sub).select(
    "name onboardingCompleted emailVerified avatarUrl"
  )

  if (!user) redirect("/login")
  if (!user.onboardingCompleted) redirect("/onboarding")

  return (
    <div className="container py-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="mt-1 text-muted-foreground">
            Welcome back, <strong>{user.name}</strong>
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/settings/profile">Settings</Link>
        </Button>
      </div>

      {!user.emailVerified && <EmailVerificationBanner />}
    </div>
  )
}
