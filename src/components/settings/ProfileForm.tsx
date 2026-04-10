"use client"

import { useState } from "react"
import { updateProfileSchema } from "@/lib/validations/user"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ProfileFormProps {
  initialName: string
  initialBio: string
  email: string
}

export function ProfileForm({ initialName, initialBio, email }: ProfileFormProps) {
  const [form, setForm] = useState({ name: initialName, bio: initialBio })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [serverError, setServerError] = useState("")
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  function validate(): boolean {
    const result = updateProfileSchema.safeParse(form)
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
      const res = await fetch("/api/user/profile", {
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
          <AlertDescription>Profile updated successfully.</AlertDescription>
        </Alert>
      )}

      <div className="space-y-1">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" value={email} disabled />
        <p className="text-xs text-muted-foreground">
          Email changes are not yet supported.
        </p>
      </div>

      <div className="space-y-1">
        <Label htmlFor="name">Display name</Label>
        <Input
          id="name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          aria-describedby={errors.name ? "name-error" : undefined}
        />
        {errors.name && (
          <p id="name-error" className="text-xs text-destructive">{errors.name}</p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          placeholder="Tell us a little about yourself"
          rows={3}
          maxLength={200}
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
          aria-describedby={errors.bio ? "bio-error" : undefined}
        />
        <div className="flex justify-between">
          {errors.bio ? (
            <p id="bio-error" className="text-xs text-destructive">{errors.bio}</p>
          ) : (
            <span />
          )}
          <p className="text-xs text-muted-foreground">{form.bio.length}/200</p>
        </div>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Saving…" : "Save changes"}
      </Button>
    </form>
  )
}
