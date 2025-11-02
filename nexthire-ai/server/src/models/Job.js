import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  company: { type: String, required: true },
  role: { type: String, required: true },
  jobLink: { type: String },
  status: { type: String, enum: ['Applied','Interview','Offer','Rejected','Accepted'], default: 'Applied' },
  dateApplied: { type: Date },
  interviewDate: { type: Date },
  notes: { type: String },
  tags: [{ type: String }]
}, { timestamps: true });

export default mongoose.model('Job', jobSchema);
