import mongoose from 'mongoose';

const resumeAnalysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  atsScore: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  },
  feedback: {
    strengths: [String],
    weaknesses: [String],
    missingKeywords: [String],
    suggestions: [String]
  },
  resumeText: {
    type: String,
    required: true
  },
  verdict: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

resumeAnalysisSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('ResumeAnalysis', resumeAnalysisSchema);
