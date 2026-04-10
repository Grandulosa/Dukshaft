import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import { SettingsSidebar } from "@/components/settings/SettingsSidebar"

export default async function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()
  if (!session) redirect("/login")

  return (
    <div className="container py-8 max-w-4xl">
      <div className="space-y-0.5 mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>
      <Separator className="mb-6" />
      <div className="flex flex-col gap-8 md:flex-row">
        <aside className="w-full md:w-44 shrink-0">
          <SettingsSidebar />
        </aside>
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  )
}
