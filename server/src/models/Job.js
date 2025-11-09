import mongoose from "mongoose";

const JobSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    company: { type: String, required: true },
    role: { type: String, required: true },
    link: { type: String },
    status: { type: String },
    appliedAt: { type: String },   // ✅ store as plain string
    tags: { type: [String], default: [] },
    notes: { type: String },
  },
  { timestamps: true }
);

// ✅ Important fix: reuse model if already compiled
export default mongoose.models.Job || mongoose.model("Job", JobSchema);
                                                                                                                                               