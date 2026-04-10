import mongoose, { Schema, type Document, type Model, type Types } from "mongoose"

export interface IProject extends Document {
  title: string
  description: string | null
  status: "active" | "draft" | "archived"
  owner: Types.ObjectId
  tags: string[]
  deletedAt: Date | null
  createdAt: Date
  updatedAt: Date
}

const ProjectSchema = new Schema<IProject>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      default: null,
      maxlength: 500,
    },
    status: {
      type: String,
      enum: ["active", "draft", "archived"],
      default: "active",
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tags: [{ type: String, trim: true, maxlength: 30 }],
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
)

// Compound indexes for common query patterns
ProjectSchema.index({ owner: 1, deletedAt: 1 })
ProjectSchema.index({ owner: 1, status: 1, deletedAt: 1 })
ProjectSchema.index({ owner: 1, createdAt: -1, deletedAt: 1 })
// Full-text search on title and description
ProjectSchema.index({ title: "text", description: "text" })

const Project: Model<IProject> =
  mongoose.models.Project ?? mongoose.model<IProject>("Project", ProjectSchema)

export default Project
