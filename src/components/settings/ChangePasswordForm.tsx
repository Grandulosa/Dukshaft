"use client"

import { useState } from "react"
import { changePasswordSchema } from "@/lib/validations/user"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function ChangePasswordForm() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [serverError, setServerError] = useState("")
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  function validate(): boolean {
    const result = changePasswordSchema.safeParse(form)
    if (!result.success) {
      const errs: Record<string, string> = {}
      result.error.errors.forEach((e) => {
        const field = e.path[0] as string
        if (!errs[field]) errs[field] = e.message
      })
      setErrors(errs)
      return false
    }
    setErrors({})
    return true
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    setServerError("")
    setSuccess(false)

    try {
      const res = await fetch("/api/user/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (!res.ok) {
        setServerError(data.error ?? "Something went wrong")
        return
      }

      setSuccess(true)
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" })
    } catch {
      setServerError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4 max-w-md">
      {serverError && (
        <Alert variant="destructive">
          <AlertDescription>{serverError}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert>
          <AlertDescription>Password updated successfully.</AlertDescription>
        </Alert>
      )}

      <div className="space-y-1">
        <Label htmlFor="currentPassword">Current password</Label>
        <Input
          id="currentPassword"
          type="password"
          autoComplete="current-password"
          value={form.currentPassword}
          onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
          aria-describedby={errors.currentPassword ? "cur-pw-error" : undefined}
        />
        {errors.currentPassword && (
          <p id="cur-pw-error" className="text-xs text-destructive">{errors.currentPassword}</p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="newPassword">New password</Label>
        <Input
          id="newPassword"
          type="password"
          autoComplete="new-password"
          placeholder="Min 8 chars, upper, lower, number, symbol"
          value={form.newPassword}
          onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
          aria-describedby={errors.newPassword ? "new-pw-error" : undefined}
        />
        {errors.newPassword && (
          <p id="new-pw-error" className="text-xs text-destructive">{errors.newPassword}</p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="confirmPassword">Confirm new password</Label>
        <Input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          value={form.confirmPassword}
          onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
          aria-describedby={errors.confirmPassword ? "confirm-pw-error" : undefined}
        />
        {errors.confirmPassword && (
          <p id="confirm-pw-error" className="text-xs text-destructive">{errors.confirmPassword}</p>
        )}
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Updating…" : "Update password"}
      </Button>
    </form>
  )
}
