import Interview from '../models/Interview.js';
import * as aiService from '../services/aiService.js';

export const startInterview = async (req, res) => {
  try {
    const { role, difficulty } = req.body;

    if (!role || !difficulty) {
      return res.status(400).json({ message: 'Role and difficulty are required' });
    }

    let questionData;
    if (role === 'HR') {
      questionData = await aiService.getHRQuestion(difficulty);
    } else {
      questionData = await aiService.askQuestion(role, difficulty);
    }

    const interview = await Interview.create({
      userId: req.user._id,
      role,
      difficulty,
      messages: [{
        role: 'ai',
        content: questionData.question,
        timestamp: new Date()
      }]
    });

    res.status(201).json({
      interviewId: interview._id,
      question: questionData.question,
      topic: questionData.topic,
      expectedDuration: questionData.expectedDuration
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const respondToInterview = async (req, res) => {
  try {
    const { interviewId, answer } = req.body;

    if (!interviewId || !answer) {
      return res.status(400).json({ message: 'Interview ID and answer are required' });
    }

    const interview = await Interview.findOne({ _id: interviewId, userId: req.user._id });
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    if (interview.status === 'completed') {
      return res.status(400).json({ message: 'Interview is already completed' });
    }

    // Get the last AI question
    const lastAiMessage = [...interview.messages].reverse().find(m => m.role === 'ai');
    if (!lastAiMessage) {
      return res.status(400).json({ message: 'No question to answer' });
    }

    // Add user's answer
    interview.messages.push({
      role: 'user',
      content: answer,
      timestamp: new Date()
    });

    // Evaluate with AI
    const evaluation = await aiService.evaluateAnswer(
      interview.role,
      interview.difficulty,
      lastAiMessage.content,
      answer
    );

    // Add AI feedback
    interview.messages.push({
      role: 'ai',
      content: evaluation.followUpQuestion,
      score: evaluation.score,
      feedback: {
        strengths: evaluation.strengths,
        weaknesses: evaluation.weaknesses,
        missingPoints: evaluation.missingPoints,
        improvedAnswer: evaluation.improvedAnswer
      },
      timestamp: new Date()
    });

    // Update running average score
    const scores = interview.messages.filter(m => m.score !== null && m.score !== undefined).map(m => m.score);
    interview.overallScore = scores.length > 0 ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10 : 0;

    await interview.save();

    res.json({
      score: evaluation.score,
      feedback: {
        strengths: evaluation.strengths,
        weaknesses: evaluation.weaknesses,
        missingPoints: evaluation.missingPoints,
        improvedAnswer: evaluation.improvedAnswer
      },
      followUpQuestion: evaluation.followUpQuestion,
      overallScore: interview.overallScore,
      questionsAnswered: scores.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const endInterview = async (req, res) => {
  try {
    const { interviewId } = req.body;

    const interview = await Interview.findOne({ _id: interviewId, userId: req.user._id });
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    interview.status = 'completed';
    await interview.save();

    const scores = interview.messages.filter(m => m.score !== null && m.score !== undefined).map(m => m.score);

    res.json({
      overallScore: interview.overallScore,
      totalQuestions: scores.length,
      scores,
      status: 'completed'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getInterviewHistory = async (req, res) => {
  try {
    const interviews = await Interview.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .select('role difficulty overallScore status createdAt messages')
      .limit(50);

    const formatted = interviews.map(i => ({
      id: i._id,
      role: i.role,
      difficulty: i.difficulty,
      overallScore: i.overallScore,
      status: i.status,
      questionsAnswered: i.messages.filter(m => m.score !== null && m.score !== undefined).length,
      createdAt: i.createdAt
    }));

    res.json({ interviews: formatted });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getInterview = async (req, res) => {
  try {
    const interview = await Interview.findOne({ _id: req.params.id, userId: req.user._id });
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }
    res.json({ interview });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
