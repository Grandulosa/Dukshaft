import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { connectDB } from "@/lib/db"
import User from "@/models/User"
import { updateProfileSchema } from "@/lib/validations/user"

export const dynamic = "force-dynamic"

const SAFE_SELECT =
  "-password -emailVerificationToken -emailVerificationExpires -passwordResetToken -passwordResetExpires"

export async function GET() {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    await connectDB()
    const user = await User.findById(session.sub).select(SAFE_SELECT)
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

    return NextResponse.json({ user }, { status: 200 })
  } catch (err) {
    console.error("[profile GET]", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await request.json()
    const result = updateProfileSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      )
    }

    await connectDB()
    const user = await User.findByIdAndUpdate(
      session.sub,
      { name: result.data.name, bio: result.data.bio ?? null },
      { new: true }
    ).select(SAFE_SELECT)

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

    return NextResponse.json({ user }, { status: 200 })
  } catch (err) {
    console.error("[profile PATCH]", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
