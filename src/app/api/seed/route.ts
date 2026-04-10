import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { connectDB } from "@/lib/db"
import User from "@/models/User"
import Project from "@/models/Project"

export const dynamic = "force-dynamic"

// Only reachable in development — returns 404 in production
export async function POST() {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  try {
    await connectDB()

    // Wipe existing seed data
    await User.deleteMany({ email: "seed@dukshaft.dev" })

    const hashedPassword = await bcrypt.hash("Seed@1234!", 12)
    const user = await User.create({
      name: "Seed User",
      email: "seed@dukshaft.dev",
      password: hashedPassword,
      role: "user",
      emailVerified: true,
      onboardingCompleted: true,
      preferences: { notifications: true, theme: "system" },
    })

    // Wipe projects owned by this user
    await Project.deleteMany({ owner: user._id })

    const projects = await Project.insertMany([
      {
        title: "Marketing Site Redesign",
        description: "Rebuild the public-facing marketing pages with the new brand.",
        status: "active",
        owner: user._id,
        tags: ["design", "frontend"],
      },
      {
        title: "API Performance Audit",
        description: "Identify and fix N+1 queries and slow endpoints.",
        status: "active",
        owner: user._id,
        tags: ["backend", "performance"],
      },
      {
        title: "Mobile App — Beta",
        description: null,
        status: "draft",
        owner: user._id,
        tags: ["mobile"],
      },
      {
        title: "Legacy Data Migration",
        description: "One-time migration of customer data from the old platform.",
        status: "archived",
        owner: user._id,
        tags: ["database", "migration"],
      },
    ])

    return NextResponse.json(
      {
        message: "Seed complete",
        user: { id: user._id, email: user.email },
        projects: projects.map((p) => ({ id: p._id, title: p.title })),
      },
      { status: 201 }
    )
  } catch (err) {
    console.error("[seed]", err)
    return NextResponse.json({ error: "Seed failed" }, { status: 500 })
  }
}
