import * as aiService from '../services/aiService.js';
import { executeCode, getSupportedLanguages } from '../services/codeRunnerService.js';

export const getProblem = async (req, res) => {
  try {
    const { role, difficulty } = req.body;
    const problem = await aiService.getCodingQuestion(role || 'Full Stack', difficulty || 'Medium');
    res.json({ problem });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const runCode = async (req, res) => {
  try {
    const { code, language, stdin } = req.body;

    if (!code || !language) {
      return res.status(400).json({ message: 'Code and language are required' });
    }

    const result = await executeCode(code, language, stdin);
    res.json({ result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getLanguages = (req, res) => {
  res.json({ languages: getSupportedLanguages() });
};
