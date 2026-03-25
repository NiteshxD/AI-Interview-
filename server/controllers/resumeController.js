import multer from 'multer';
import path from 'path';
import { parseResume } from '../services/resumeParserService.js';
import * as aiService from '../services/aiService.js';
import ResumeAnalysis from '../models/ResumeAnalysis.js';

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, '/tmp'),
  filename: (req, file, cb) => cb(null, `resume-${Date.now()}${path.extname(file.originalname)}`)
});

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.mimetype === 'text/plain') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and TXT files are allowed'), false);
    }
  }
});

export const analyzeResume = async (req, res) => {
  try {
    let resumeText = '';

    if (req.file) {
      if (req.file.mimetype === 'application/pdf') {
        resumeText = await parseResume(req.file.path);
      } else {
        const fs = await import('fs');
        resumeText = fs.readFileSync(req.file.path, 'utf-8');
        fs.unlinkSync(req.file.path);
      }
    } else if (req.body.resumeText) {
      resumeText = req.body.resumeText;
    } else {
      return res.status(400).json({ message: 'Please upload a resume file or provide resume text' });
    }

    const analysis = await aiService.analyzeResume(resumeText);

    const saved = await ResumeAnalysis.create({
      userId: req.user._id,
      atsScore: analysis.atsScore,
      feedback: {
        strengths: analysis.strengths,
        weaknesses: analysis.weaknesses,
        missingKeywords: analysis.missingKeywords,
        suggestions: analysis.suggestions
      },
      resumeText,
      verdict: analysis.verdict
    });

    res.json({
      id: saved._id,
      atsScore: analysis.atsScore,
      strengths: analysis.strengths,
      weaknesses: analysis.weaknesses,
      missingKeywords: analysis.missingKeywords,
      suggestions: analysis.suggestions,
      verdict: analysis.verdict
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getResumeHistory = async (req, res) => {
  try {
    const analyses = await ResumeAnalysis.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .select('atsScore verdict createdAt')
      .limit(20);

    res.json({ analyses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
