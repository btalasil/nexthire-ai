import mongoose from "mongoose";

const JobSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    company: { type: String, required: true },
    role: { type: String, required: true },
    link: { type: String },            // ✅ must exist
    status: { type: String },
    appliedAt: { type: Date },         // ✅ must exist
    tags: { type: [String], default: [] },
    notes: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Job", JobSchema);
