import Interview from '../models/Interview.js';
import ResumeAnalysis from '../models/ResumeAnalysis.js';

export const getStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const [interviews, resumeAnalyses] = await Promise.all([
      Interview.find({ userId }).sort({ createdAt: -1 }).limit(50),
      ResumeAnalysis.find({ userId }).sort({ createdAt: -1 }).limit(10)
    ]);

    const completedInterviews = interviews.filter(i => i.status === 'completed');
    const totalInterviews = completedInterviews.length;
    const avgScore = totalInterviews > 0
      ? Math.round((completedInterviews.reduce((sum, i) => sum + i.overallScore, 0) / totalInterviews) * 10) / 10
      : 0;

    // Role breakdown
    const roleBreakdown = {};
    completedInterviews.forEach(i => {
      if (!roleBreakdown[i.role]) {
        roleBreakdown[i.role] = { count: 0, totalScore: 0 };
      }
      roleBreakdown[i.role].count++;
      roleBreakdown[i.role].totalScore += i.overallScore;
    });

    Object.keys(roleBreakdown).forEach(role => {
      roleBreakdown[role].avgScore = Math.round(
        (roleBreakdown[role].totalScore / roleBreakdown[role].count) * 10
      ) / 10;
    });

    // Difficulty breakdown
    const difficultyBreakdown = {};
    completedInterviews.forEach(i => {
      if (!difficultyBreakdown[i.difficulty]) {
        difficultyBreakdown[i.difficulty] = { count: 0, totalScore: 0 };
      }
      difficultyBreakdown[i.difficulty].count++;
      difficultyBreakdown[i.difficulty].totalScore += i.overallScore;
    });

    Object.keys(difficultyBreakdown).forEach(diff => {
      difficultyBreakdown[diff].avgScore = Math.round(
        (difficultyBreakdown[diff].totalScore / difficultyBreakdown[diff].count) * 10
      ) / 10;
    });

    // Recent scores (last 10)
    const recentScores = completedInterviews.slice(0, 10).map(i => ({
      score: i.overallScore,
      role: i.role,
      difficulty: i.difficulty,
      date: i.createdAt
    }));

    // Latest resume score
    const latestResume = resumeAnalyses.length > 0 ? {
      atsScore: resumeAnalyses[0].atsScore,
      verdict: resumeAnalyses[0].verdict,
      date: resumeAnalyses[0].createdAt
    } : null;

    res.json({
      totalInterviews,
      avgScore,
      roleBreakdown,
      difficultyBreakdown,
      recentScores,
      latestResume,
      totalResumesAnalyzed: resumeAnalyses.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
