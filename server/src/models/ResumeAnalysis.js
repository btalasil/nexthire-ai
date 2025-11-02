import mongoose from 'mongoose';

const resumeAnalysisSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  extractedSkills: [{ type: String }],
  missingKeywords: [{ type: String }],
  score: { type: Number, default: 0 },
  rawText: { type: String }
}, { timestamps: true });

export default mongoose.model('ResumeAnalysis', resumeAnalysisSchema);
