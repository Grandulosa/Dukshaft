"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"

type Theme = "light" | "dark" | "system"

interface PreferencesFormProps {
  initialNotifications: boolean
  initialTheme: Theme
}

const themes: { value: Theme; label: string }[] = [
  { value: "system", label: "System" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
]

export function PreferencesForm({
  initialNotifications,
  initialTheme,
}: PreferencesFormProps) {
  const [notifications, setNotifications] = useState(initialNotifications)
  const [theme, setTheme] = useState<Theme>(initialTheme)
  const [serverError, setServerError] = useState("")
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setServerError("")
    setSuccess(false)

    try {
      const res = await fetch("/api/user/preferences", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notifications, theme }),
      })
      const data = await res.json()

      if (!res.ok) {
        setServerError(data.error ?? "Something went wrong")
        return
      }

      setSuccess(true)
    } catch {
      setServerError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
      {serverError && (
        <Alert variant="destructive">
          <AlertDescription>{serverError}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert>
          <AlertDescription>Preferences saved.</AlertDescription>
        </Alert>
      )}

      <div className="flex items-center justify-between rounded-lg border p-4">
        <div className="space-y-0.5">
          <Label htmlFor="notifications" className="text-base">
            Email notifications
          </Label>
          <p className="text-sm text-muted-foreground">
            Receive email updates about your account activity.
          </p>
        </div>
        <Switch
          id="notifications"
          checked={notifications}
          onCheckedChange={setNotifications}
        />
      </div>

      <div className="space-y-2">
        <Label>Theme</Label>
        <p className="text-sm text-muted-foreground">
          Stored in your account. Dark mode toggle coming soon.
        </p>
        <div className="flex gap-2">
          {themes.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setTheme(t.value)}
              className={`rounded-md border px-4 py-2 text-sm font-medium transition-colors ${
                theme === t.value
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-input bg-background hover:bg-accent"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Saving…" : "Save preferences"}
      </Button>
    </form>
  )
}
