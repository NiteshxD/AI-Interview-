import jwt from 'jsonwebtoken';
import * as aiService from '../services/aiService.js';
import Interview from '../models/Interview.js';

const socketHandler = (io) => {
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next(new Error('Authentication required'));
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.userId;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.userId}`);
    socket.join(`user:${socket.userId}`);

    socket.on('interview:start', async ({ role, difficulty }) => {
      try {
        socket.emit('interview:thinking', { status: true });

        let questionData;
        if (role === 'HR') {
          questionData = await aiService.getHRQuestion(difficulty);
        } else {
          questionData = await aiService.askQuestion(role, difficulty);
        }

        const interview = await Interview.create({
          userId: socket.userId,
          role,
          difficulty,
          messages: [{
            role: 'ai',
            content: questionData.question,
            timestamp: new Date()
          }]
        });

        socket.emit('interview:thinking', { status: false });
        socket.emit('interview:question', {
          interviewId: interview._id,
          question: questionData.question,
          topic: questionData.topic,
          questionNum: 1
        });
      } catch (error) {
        socket.emit('interview:thinking', { status: false });
        socket.emit('interview:error', { message: error.message });
      }
    });

    socket.on('interview:answer', async ({ interviewId, answer }) => {
      try {
        socket.emit('interview:thinking', { status: true });

        const interview = await Interview.findOne({ _id: interviewId, userId: socket.userId });
        if (!interview) {
          socket.emit('interview:error', { message: 'Interview not found' });
          return;
        }

        const lastAiMessage = [...interview.messages].reverse().find(m => m.role === 'ai');

        interview.messages.push({
          role: 'user',
          content: answer,
          timestamp: new Date()
        });

        const evaluation = await aiService.evaluateAnswer(
          interview.role,
          interview.difficulty,
          lastAiMessage.content,
          answer
        );

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

        const scores = interview.messages.filter(m => m.score != null).map(m => m.score);
        interview.overallScore = scores.length > 0
          ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10
          : 0;

        await interview.save();

        socket.emit('interview:thinking', { status: false });
        socket.emit('interview:feedback', {
          interviewId,
          score: evaluation.score,
          feedback: {
            strengths: evaluation.strengths,
            weaknesses: evaluation.weaknesses,
            missingPoints: evaluation.missingPoints,
            improvedAnswer: evaluation.improvedAnswer
          },
          followUpQuestion: evaluation.followUpQuestion,
          overallScore: interview.overallScore,
          questionNum: scores.length
        });
      } catch (error) {
        socket.emit('interview:thinking', { status: false });
        socket.emit('interview:error', { message: error.message });
      }
    });

    socket.on('interview:end', async ({ interviewId }) => {
      try {
        const interview = await Interview.findOne({ _id: interviewId, userId: socket.userId });
        if (interview) {
          interview.status = 'completed';
          await interview.save();

          socket.emit('interview:ended', {
            overallScore: interview.overallScore,
            totalQuestions: interview.messages.filter(m => m.score != null).length
          });
        }
      } catch (error) {
        socket.emit('interview:error', { message: error.message });
      }
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.userId}`);
    });
  });
};

export default socketHandler;
