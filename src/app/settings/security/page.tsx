import type { Metadata } from "next"
import { Separator } from "@/components/ui/separator"
import { ChangePasswordForm } from "@/components/settings/ChangePasswordForm"
import { DeleteAccountSection } from "@/components/settings/DeleteAccountSection"

export const metadata: Metadata = { title: "Security" }

export default function SecuritySettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Security</h2>
        <p className="text-sm text-muted-foreground">
          Manage your password and account security.
        </p>
      </div>
      <Separator />

      <div className="space-y-1">
        <h3 className="font-medium">Change password</h3>
        <p className="text-sm text-muted-foreground">
          Use a strong password you don&apos;t use elsewhere.
        </p>
      </div>
      <ChangePasswordForm />

      <Separator />

      <div className="space-y-1">
        <h3 className="font-medium text-destructive">Danger zone</h3>
        <p className="text-sm text-muted-foreground">
          Irreversible actions. Proceed with caution.
        </p>
      </div>
      <DeleteAccountSection />
    </div>
  )
}
