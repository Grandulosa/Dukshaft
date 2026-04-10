"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function DeleteAccountSection() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ password: "", confirmation: "" })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [serverError, setServerError] = useState("")
  const [loading, setLoading] = useState(false)

  function reset() {
    setForm({ password: "", confirmation: "" })
    setErrors({})
    setServerError("")
  }

  async function handleDelete() {
    const newErrors: Record<string, string> = {}
    if (!form.password) newErrors.password = "Password is required"
    if (form.confirmation !== "delete my account")
      newErrors.confirmation = 'Type "delete my account" to confirm'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    setServerError("")

    try {
      const res = await fetch("/api/user/account", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (!res.ok) {
        setServerError(data.error ?? "Something went wrong")
        return
      }

      router.push("/")
      router.refresh()
    } catch {
      setServerError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-3 max-w-md">
      <p className="text-sm text-muted-foreground">
        Permanently delete your account and all associated data. This action
        cannot be undone.
      </p>

      <Dialog
        open={open}
        onOpenChange={(v) => {
          setOpen(v)
          if (!v) reset()
        }}
      >
        <DialogTrigger asChild>
          <Button variant="destructive" size="sm">
            Delete account
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete account</DialogTitle>
            <DialogDescription>
              This will permanently delete your account and all data. There is
              no way to recover it.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {serverError && (
              <Alert variant="destructive">
                <AlertDescription>{serverError}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-1">
              <Label htmlFor="del-password">Your password</Label>
              <Input
                id="del-password"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="del-confirm">
                Type <span className="font-mono text-foreground">delete my account</span> to confirm
              </Label>
              <Input
                id="del-confirm"
                value={form.confirmation}
                onChange={(e) =>
                  setForm({ ...form, confirmation: e.target.value })
                }
              />
              {errors.confirmation && (
                <p className="text-xs text-destructive">{errors.confirmation}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? "Deleting…" : "Delete my account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
