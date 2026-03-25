import Groq from 'groq-sdk';
import { PROMPTS } from '../utils/prompts.js';

let groq = null;
let lastKey = null;

const initAI = () => {
  const key = process.env.GROQ_API_KEY;
  if (key && key !== 'your_groq_api_key_here' && key !== lastKey) {
    groq = new Groq({ apiKey: key });
    lastKey = key;
  }
  return groq;
};

const parseAIResponse = (text) => {
  try {
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
};

const generateContent = async (prompt) => {
  const client = initAI();
  if (!client) {
    throw new Error('AI service not configured. Please set GROQ_API_KEY in server/.env');
  }
  try {
    const chatCompletion = await client.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a senior FAANG-level technical interviewer and AI assistant. Always respond with valid JSON only. No markdown, no extra text.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 2048,
      response_format: { type: 'json_object' }
    });

    const text = chatCompletion.choices[0]?.message?.content || '';
    const parsed = parseAIResponse(text);
    if (!parsed) {
      throw new Error('Failed to parse AI response');
    }
    return parsed;
  } catch (err) {
    if (err.message?.includes('API key') || err.status === 401) {
      throw new Error('Invalid Groq API key. Please check your GROQ_API_KEY in server/.env. Get a key from https://console.groq.com/keys');
    }
    throw err;
  }
};

export const askQuestion = async (role, difficulty) => {
  const prompt = PROMPTS.ask_question(role, difficulty);
  return await generateContent(prompt);
};

export const evaluateAnswer = async (role, difficulty, question, answer) => {
  const prompt = PROMPTS.evaluate_answer(role, difficulty, question, answer);
  return await generateContent(prompt);
};

export const getCodingQuestion = async (role, difficulty) => {
  const prompt = PROMPTS.coding_question(role, difficulty);
  return await generateContent(prompt);
};

export const getHRQuestion = async (difficulty) => {
  const prompt = PROMPTS.hr_interview(difficulty);
  return await generateContent(prompt);
};

export const analyzeResume = async (resumeText) => {
  const prompt = PROMPTS.resume_analysis(resumeText);
  return await generateContent(prompt);
};

export const getFollowUp = async (role, difficulty, context) => {
  const prompt = PROMPTS.follow_up(role, difficulty, context);
  return await generateContent(prompt);
};
