import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSocket } from '../context/SocketContext';
import { useVoiceInput } from '../hooks/useVoiceInput';
import API from '../api/axios';
import toast from 'react-hot-toast';
import { HiOutlinePaperAirplane, HiOutlineMicrophone, HiOutlineStopCircle, HiOutlineSparkles, HiOutlineXMark } from 'react-icons/hi2';

const roles = ['Frontend', 'Backend', 'Full Stack', 'HR'];
const difficulties = ['Easy', 'Medium', 'Hard'];

const ThinkingIndicator = () => (
  <div className="chat-bubble ai" style={{ display: 'flex', gap: 6, padding: '16px 24px' }}>
    {[0, 1, 2].map(i => (
      <div key={i} style={{
        width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-blue)',
        animation: `typing-dot 1.4s ${i * 0.2}s infinite`
      }} />
    ))}
  </div>
);

const FeedbackCard = ({ feedback, score }) => {
  const getScoreClass = (s) => s >= 8 ? 'excellent' : s >= 6 ? 'good' : s >= 4 ? 'average' : 'poor';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: 16,
        padding: 20,
        marginTop: 12,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
        <div className={`score-badge ${getScoreClass(score)}`}>{score}</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '1rem' }}>Score: {score}/10</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            {score >= 8 ? 'Excellent!' : score >= 6 ? 'Good job!' : score >= 4 ? 'Needs improvement' : 'Keep practicing'}
          </div>
        </div>
      </div>

      {feedback.strengths?.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <h4 style={{ color: 'var(--accent-green)', fontSize: '0.85rem', fontWeight: 700, marginBottom: 6 }}>✅ Strengths</h4>
          <ul style={{ paddingLeft: 16, margin: 0 }}>
            {feedback.strengths.map((s, i) => <li key={i} style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: 4 }}>{s}</li>)}
          </ul>
        </div>
      )}

      {feedback.weaknesses?.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <h4 style={{ color: 'var(--accent-yellow)', fontSize: '0.85rem', fontWeight: 700, marginBottom: 6 }}>⚠️ Weaknesses</h4>
          <ul style={{ paddingLeft: 16, margin: 0 }}>
            {feedback.weaknesses.map((w, i) => <li key={i} style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: 4 }}>{w}</li>)}
          </ul>
        </div>
      )}

      {feedback.missingPoints?.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <h4 style={{ color: 'var(--accent-red)', fontSize: '0.85rem', fontWeight: 700, marginBottom: 6 }}>❌ Missing Points</h4>
          <ul style={{ paddingLeft: 16, margin: 0 }}>
            {feedback.missingPoints.map((m, i) => <li key={i} style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: 4 }}>{m}</li>)}
          </ul>
        </div>
      )}

      {feedback.improvedAnswer && (
        <div>
          <h4 style={{ color: 'var(--accent-blue)', fontSize: '0.85rem', fontWeight: 700, marginBottom: 6 }}>💡 Ideal Answer</h4>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6, background: 'var(--bg-input)', padding: 12, borderRadius: 10 }}>{feedback.improvedAnswer}</p>
        </div>
      )}
    </motion.div>
  );
};

const InterviewPage = () => {
  const [started, setStarted] = useState(false);
  const [role, setRole] = useState('Frontend');
  const [difficulty, setDifficulty] = useState('Medium');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const [interviewId, setInterviewId] = useState(null);
  const [overallScore, setOverallScore] = useState(null);
  const chatEndRef = useRef(null);
  const { socket } = useSocket();
  const { isListening, transcript, startListening, stopListening, resetTranscript } = useVoiceInput();

  useEffect(() => {
    if (transcript) setInput(prev => prev + ' ' + transcript);
  }, [transcript]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, thinking]);

  useEffect(() => {
    if (!socket) return;

    socket.on('interview:thinking', ({ status }) => setThinking(status));

    socket.on('interview:question', ({ interviewId: id, question, questionNum }) => {
      setInterviewId(id);
      setMessages(prev => [...prev, { role: 'ai', content: question, questionNum }]);
    });

    socket.on('interview:feedback', ({ score, feedback, followUpQuestion, overallScore: os }) => {
      setMessages(prev => [...prev, {
        role: 'ai',
        content: followUpQuestion,
        score,
        feedback
      }]);
      setOverallScore(os);
    });

    socket.on('interview:ended', ({ overallScore: os }) => {
      setOverallScore(os);
      toast.success(`Interview complete! Overall score: ${os}/10`);
    });

    socket.on('interview:error', ({ message }) => {
      toast.error(message);
      setThinking(false);
    });

    return () => {
      socket.off('interview:thinking');
      socket.off('interview:question');
      socket.off('interview:feedback');
      socket.off('interview:ended');
      socket.off('interview:error');
    };
  }, [socket]);

  const handleStart = () => {
    if (socket) {
      socket.emit('interview:start', { role, difficulty });
      setStarted(true);
      setMessages([]);
      setOverallScore(null);
    } else {
      // Fallback to REST API
      handleStartREST();
    }
  };

  const handleStartREST = async () => {
    try {
      setThinking(true);
      setStarted(true);
      setMessages([]);
      const res = await API.post('/interview/start', { role, difficulty });
      setInterviewId(res.data.interviewId);
      setMessages([{ role: 'ai', content: res.data.question }]);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to start interview');
    } finally {
      setThinking(false);
    }
  };

  const handleSend = () => {
    if (!input.trim() || thinking) return;

    const answer = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: answer }]);
    setInput('');
    resetTranscript();

    if (socket?.connected) {
      socket.emit('interview:answer', { interviewId, answer });
    } else {
      handleSendREST(answer);
    }
  };

  const handleSendREST = async (answer) => {
    setThinking(true);
    try {
      const res = await API.post('/interview/respond', { interviewId, answer });
      setMessages(prev => [...prev, {
        role: 'ai',
        content: res.data.followUpQuestion,
        score: res.data.score,
        feedback: res.data.feedback
      }]);
      setOverallScore(res.data.overallScore);
    } catch (err) {
      toast.error('Failed to get AI response');
    } finally {
      setThinking(false);
    }
  };

  const handleEndInterview = () => {
    if (socket?.connected) {
      socket.emit('interview:end', { interviewId });
    } else {
      API.post('/interview/end', { interviewId })
        .then(res => toast.success(`Interview ended! Score: ${res.data.overallScore}/10`))
        .catch(() => toast.error('Failed to end interview'));
    }
    setStarted(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Setup screen
  if (!started) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ maxWidth: 700, margin: '0 auto', padding: '40px 0' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <HiOutlineSparkles size={48} color="var(--accent-blue)" style={{ marginBottom: 16 }} />
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 8px' }}>
            <span className="gradient-text">Start AI Mock Interview</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Choose your role and difficulty to begin</p>
        </div>

        <div className="glass-card" style={{ padding: 32 }}>
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 10, fontSize: '0.9rem' }}>Select Role</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
              {roles.map(r => (
                <motion.button
                  key={r}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setRole(r)}
                  style={{
                    padding: '14px 16px',
                    borderRadius: 12,
                    border: role === r ? '2px solid var(--accent-blue)' : '1px solid var(--border-color)',
                    background: role === r ? 'rgba(59,130,246,0.1)' : 'var(--bg-input)',
                    color: role === r ? 'var(--accent-blue)' : 'var(--text-secondary)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontFamily: 'inherit',
                    transition: 'all 0.2s'
                  }}
                >
                  {r}
                </motion.button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 28 }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 10, fontSize: '0.9rem' }}>Difficulty Level</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              {difficulties.map(d => (
                <motion.button
                  key={d}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setDifficulty(d)}
                  style={{
                    padding: '14px 16px',
                    borderRadius: 12,
                    border: difficulty === d ? '2px solid var(--accent-purple)' : '1px solid var(--border-color)',
                    background: difficulty === d ? 'rgba(139,92,246,0.1)' : 'var(--bg-input)',
                    color: difficulty === d ? 'var(--accent-purple)' : 'var(--text-secondary)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontFamily: 'inherit',
                    transition: 'all 0.2s'
                  }}
                >
                  {d}
                </motion.button>
              ))}
            </div>
          </div>

          <motion.button
            className="btn-primary"
            onClick={handleStart}
            whileTap={{ scale: 0.97 }}
            style={{ width: '100%', padding: '16px', fontSize: '1rem' }}
          >
            🎤 Start Interview
          </motion.button>
        </div>
      </motion.div>
    );
  }

  // Chat screen
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 140px)' }}>
      {/* Top bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 0 16px', borderBottom: '1px solid var(--border-color)', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ padding: '4px 12px', borderRadius: 8, background: 'rgba(59,130,246,0.1)', color: 'var(--accent-blue)', fontSize: '0.8rem', fontWeight: 600 }}>{role}</span>
          <span style={{ padding: '4px 12px', borderRadius: 8, background: 'rgba(139,92,246,0.1)', color: 'var(--accent-purple)', fontSize: '0.8rem', fontWeight: 600 }}>{difficulty}</span>
          {overallScore !== null && (
            <span style={{ padding: '4px 12px', borderRadius: 8, background: 'rgba(16,185,129,0.1)', color: 'var(--accent-green)', fontSize: '0.8rem', fontWeight: 600 }}>
              Score: {overallScore}/10
            </span>
          )}
        </div>
        <button onClick={handleEndInterview} style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 10,
          background: 'rgba(239,68,68,0.1)', color: 'var(--accent-red)', border: 'none',
          cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', fontFamily: 'inherit'
        }}>
          <HiOutlineXMark size={16} /> End Interview
        </button>
      </div>

      {/* Chat messages */}
      <div className="chat-container" style={{ flex: 1, padding: '0' }}>
        <AnimatePresence>
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className={`chat-bubble ${msg.role}`}>
                {msg.content}
              </div>
              {msg.feedback && msg.score !== undefined && (
                <div style={{ maxWidth: '85%' }}>
                  <FeedbackCard feedback={msg.feedback} score={msg.score} />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        {thinking && <ThinkingIndicator />}
        <div ref={chatEndRef} />
      </div>

      {/* Input area */}
      <div style={{
        display: 'flex', gap: 10, alignItems: 'flex-end',
        padding: '16px 0 0',
        borderTop: '1px solid var(--border-color)'
      }}>
        <button
          onClick={isListening ? stopListening : startListening}
          style={{
            width: 44, height: 44, borderRadius: 12,
            background: isListening ? 'rgba(239,68,68,0.15)' : 'var(--bg-card)',
            border: `1px solid ${isListening ? 'var(--accent-red)' : 'var(--border-color)'}`,
            color: isListening ? 'var(--accent-red)' : 'var(--text-secondary)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0
          }}
          title={isListening ? 'Stop recording' : 'Start voice input'}
        >
          {isListening ? <HiOutlineStopCircle size={20} /> : <HiOutlineMicrophone size={20} />}
        </button>

        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your answer... (Shift+Enter for new line)"
          className="input-field"
          style={{ flex: 1, minHeight: 44, maxHeight: 150, resize: 'vertical', lineHeight: 1.5 }}
          disabled={thinking}
        />

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleSend}
          disabled={!input.trim() || thinking}
          style={{
            width: 44, height: 44, borderRadius: 12,
            background: input.trim() ? 'var(--gradient-primary)' : 'var(--bg-card)',
            border: 'none', color: 'white', cursor: input.trim() ? 'pointer' : 'default',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: input.trim() ? 1 : 0.5, flexShrink: 0
          }}
        >
          <HiOutlinePaperAirplane size={18} />
        </motion.button>
      </div>
    </div>
  );
};

export default InterviewPage;
