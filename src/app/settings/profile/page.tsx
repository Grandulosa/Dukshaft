import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { connectDB } from "@/lib/db"
import User from "@/models/User"
import { Separator } from "@/components/ui/separator"
import { AvatarUpload } from "@/components/settings/AvatarUpload"
import { ProfileForm } from "@/components/settings/ProfileForm"

export const metadata: Metadata = { title: "Profile" }

export default async function ProfileSettingsPage() {
  const session = await getSession()
  if (!session) redirect("/login")

  await connectDB()
  const raw = await User.findById(session.sub)
    .select("name bio avatarUrl email")
    .lean()

  if (!raw) redirect("/login")

  // Serialize: lean() returns ObjectId for _id — stringify removes it
  const user = JSON.parse(JSON.stringify(raw)) as {
    name: string
    bio: string | null
    avatarUrl: string | null
    email: string
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Profile</h2>
        <p className="text-sm text-muted-foreground">
          Update your photo and personal details.
        </p>
      </div>
      <Separator />
      <AvatarUpload
        currentAvatarUrl={user.avatarUrl}
        userName={user.name}
      />
      <Separator />
      <ProfileForm
        initialName={user.name}
        initialBio={user.bio ?? ""}
        email={user.email}
      />
    </div>
  )
}
