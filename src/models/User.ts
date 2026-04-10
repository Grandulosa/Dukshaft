import mongoose, { Schema, type Document, type Model } from "mongoose"

export interface IUser extends Document {
  name: string
  email: string
  password: string
  role: "user" | "admin"
  avatarUrl: string | null
  bio: string | null
  preferences: {
    notifications: boolean
    theme: "light" | "dark" | "system"
  }
  emailVerified: boolean
  emailVerificationToken: string | null
  emailVerificationExpires: Date | null
  passwordResetToken: string | null
  passwordResetExpires: Date | null
  onboardingCompleted: boolean
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true, maxlength: 50 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    avatarUrl: { type: String, default: null },
    bio: { type: String, default: null, maxlength: 200 },
    preferences: {
      notifications: { type: Boolean, default: true },
      theme: { type: String, enum: ["light", "dark", "system"], default: "system" },
    },
    emailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String, default: null },
    emailVerificationExpires: { type: Date, default: null },
    passwordResetToken: { type: String, default: null },
    passwordResetExpires: { type: Date, default: null },
    onboardingCompleted: { type: Boolean, default: false },
  },
  { timestamps: true }
)

// Indexes for token lookups — these fields are queried with an equality filter
// plus an expiry comparison, so a single-field index is the right shape.
UserSchema.index({ emailVerificationToken: 1 }, { sparse: true })
UserSchema.index({ passwordResetToken: 1 }, { sparse: true })

const User: Model<IUser> =
  mongoose.models.User ?? mongoose.model<IUser>("User", UserSchema)

export default User
