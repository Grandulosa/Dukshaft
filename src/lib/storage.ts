import fs from "fs/promises"
import path from "path"

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads", "avatars")
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"]
const MAX_BYTES = 2 * 1024 * 1024 // 2 MB

export function validateImageFile(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return "Only JPEG, PNG, WebP, and GIF images are allowed"
  }
  if (file.size > MAX_BYTES) {
    return "Image must be smaller than 2 MB"
  }
  return null
}

function extFromMime(mime: string): string {
  const map: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
  }
  return map[mime] ?? "jpg"
}

/**
 * Saves an avatar and returns its public URL path.
 * TODO: swap this function body for Cloudinary/S3 before production deployment.
 *   Interface: (userId: string, file: File) => Promise<string>
 */
export async function uploadAvatar(userId: string, file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer())
  const filename = `${userId}-${Date.now()}.${extFromMime(file.type)}`
  await fs.mkdir(UPLOADS_DIR, { recursive: true })
  await fs.writeFile(path.join(UPLOADS_DIR, filename), buffer)
  return `/uploads/avatars/${filename}`
}

/**
 * Deletes a previously uploaded avatar.
 * TODO: swap for cloud storage deletion.
 */
export async function deleteAvatar(avatarUrl: string): Promise<void> {
  if (!avatarUrl.startsWith("/uploads/avatars/")) return
  try {
    await fs.unlink(path.join(UPLOADS_DIR, path.basename(avatarUrl)))
  } catch {
    // Already deleted or never existed — safe to ignore
  }
}
