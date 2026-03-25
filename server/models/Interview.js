import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['ai', 'user'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    min: 0,
    max: 10,
    default: null
  },
  feedback: {
    strengths: [String],
    weaknesses: [String],
    missingPoints: [String],
    improvedAnswer: String
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const interviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  role: {
    type: String,
    enum: ['Frontend', 'Backend', 'Full Stack', 'HR'],
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true
  },
  messages: [messageSchema],
  overallScore: {
    type: Number,
    min: 0,
    max: 10,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'completed'],
    default: 'active'
  }
}, {
  timestamps: true
});

interviewSchema.index({ userId: 1, createdAt: -1 });
interviewSchema.index({ userId: 1, role: 1 });

export default mongoose.model('Interview', interviewSchema);
