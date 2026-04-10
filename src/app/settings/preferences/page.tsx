import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { connectDB } from "@/lib/db"
import User from "@/models/User"
import { Separator } from "@/components/ui/separator"
import { PreferencesForm } from "@/components/settings/PreferencesForm"

export const metadata: Metadata = { title: "Preferences" }

export default async function PreferencesSettingsPage() {
  const session = await getSession()
  if (!session) redirect("/login")

  await connectDB()
  const raw = await User.findById(session.sub)
    .select("preferences")
    .lean()

  if (!raw) redirect("/login")

  const user = JSON.parse(JSON.stringify(raw)) as {
    preferences: { notifications: boolean; theme: "light" | "dark" | "system" }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Preferences</h2>
        <p className="text-sm text-muted-foreground">
          Customize how Dukshaft Studio works for you.
        </p>
      </div>
      <Separator />
      <PreferencesForm
        initialNotifications={user.preferences.notifications}
        initialTheme={user.preferences.theme}
      />
    </div>
  )
}
