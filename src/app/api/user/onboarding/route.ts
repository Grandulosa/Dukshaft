import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { connectDB } from "@/lib/db"
import User from "@/models/User"

export const dynamic = "force-dynamic"

export async function POST() {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    await connectDB()
    await User.findByIdAndUpdate(session.sub, { onboardingCompleted: true })

    return NextResponse.json({ message: "Onboarding complete" }, { status: 200 })
  } catch (err) {
    console.error("[onboarding POST]", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
