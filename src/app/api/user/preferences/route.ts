import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { connectDB } from "@/lib/db"
import User from "@/models/User"
import { updatePreferencesSchema } from "@/lib/validations/user"

export const dynamic = "force-dynamic"

export async function PATCH(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await request.json()
    const result = updatePreferencesSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      )
    }

    await connectDB()
    const user = await User.findByIdAndUpdate(
      session.sub,
      { preferences: result.data },
      { new: true }
    ).select("preferences")

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

    return NextResponse.json({ preferences: user.preferences }, { status: 200 })
  } catch (err) {
    console.error("[preferences PATCH]", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
