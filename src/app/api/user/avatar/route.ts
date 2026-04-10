import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { connectDB } from "@/lib/db"
import User from "@/models/User"
import { uploadAvatar, deleteAvatar, validateImageFile } from "@/lib/storage"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const formData = await request.formData()
    const file = formData.get("avatar")

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const validationError = validateImageFile(file)
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 })
    }

    await connectDB()
    const user = await User.findById(session.sub)
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

    if (user.avatarUrl) await deleteAvatar(user.avatarUrl)

    const avatarUrl = await uploadAvatar(session.sub, file)
    user.avatarUrl = avatarUrl
    await user.save()

    return NextResponse.json({ avatarUrl }, { status: 200 })
  } catch (err) {
    console.error("[avatar POST]", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE() {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    await connectDB()
    const user = await User.findById(session.sub)
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

    if (user.avatarUrl) {
      await deleteAvatar(user.avatarUrl)
      user.avatarUrl = null
      await user.save()
    }

    return NextResponse.json({ message: "Avatar removed" }, { status: 200 })
  } catch (err) {
    console.error("[avatar DELETE]", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
