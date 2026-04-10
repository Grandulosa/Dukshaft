"use client"

import { useRef, useState } from "react"
import { Camera, Trash2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

interface AvatarUploadProps {
  currentAvatarUrl: string | null
  userName: string
}

function initials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export function AvatarUpload({ currentAvatarUrl, userName }: AvatarUploadProps) {
  const [avatarUrl, setAvatarUrl] = useState(currentAvatarUrl)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError("")

    const formData = new FormData()
    formData.append("avatar", file)

    try {
      const res = await fetch("/api/user/avatar", { method: "POST", body: formData })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? "Upload failed")
        return
      }

      setAvatarUrl(data.avatarUrl)
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  async function handleRemove() {
    setUploading(true)
    setError("")

    try {
      const res = await fetch("/api/user/avatar", { method: "DELETE" })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? "Failed to remove avatar")
        return
      }
      setAvatarUrl(null)
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex items-center gap-4">
      <Avatar className="h-16 w-16">
        {avatarUrl && <AvatarImage src={avatarUrl} alt={userName} />}
        <AvatarFallback className="text-lg">{initials(userName)}</AvatarFallback>
      </Avatar>

      <div className="space-y-1">
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
          >
            <Camera className="mr-1.5 h-3.5 w-3.5" />
            {uploading ? "Uploading…" : "Change photo"}
          </Button>

          {avatarUrl && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={uploading}
              onClick={handleRemove}
            >
              <Trash2 className="mr-1.5 h-3.5 w-3.5" />
              Remove
            </Button>
          )}
        </div>

        <p className="text-xs text-muted-foreground">
          JPEG, PNG, WebP or GIF — max 2 MB
        </p>

        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleFileChange}
        aria-label="Upload avatar"
      />
    </div>
  )
}
