import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import API from '../api/axios';
import toast from 'react-hot-toast';
import { HiOutlineDocumentArrowUp, HiOutlineSparkles, HiOutlineCheckCircle, HiOutlineExclamationTriangle, HiOutlineXCircle } from 'react-icons/hi2';

const ScoreMeter = ({ score }) => {
  const circumference = 2 * Math.PI * 56;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 71 ? '#10b981' : score >= 51 ? '#f59e0b' : '#ef4444';

  return (
    <div style={{ position: 'relative', width: 140, height: 140 }}>
      <svg width="140" height="140" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="56" fill="none" stroke="var(--border-color)" strokeWidth="8" />
        <motion.circle
          cx="60" cy="60" r="56" fill="none" stroke={color} strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          transform="rotate(-90 60 60)"
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center'
      }}>
        <span style={{ fontSize: '2rem', fontWeight: 900, color }}>{score}</span>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>ATS Score</span>
      </div>
    </div>
  );
};

const ResumePage = () => {
  const [file, setFile] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('upload'); // 'upload' or 'paste'

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'], 'text/plain': ['.txt'] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024
  });

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      let res;
      if (mode === 'upload' && file) {
        const formData = new FormData();
        formData.append('resume', file);
        res = await API.post('/resume/analyze', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else if (mode === 'paste' && resumeText.trim()) {
        res = await API.post('/resume/analyze', { resumeText });
      } else {
        toast.error('Please upload a file or paste your resume');
        setLoading(false);
        return;
      }
      setAnalysis(res.data);
      toast.success('Resume analyzed successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ maxWidth: 900, margin: '0 auto' }}>
      {!analysis ? (
        <>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 8px' }}>
              <span className="gradient-text">AI Resume Analyzer</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Get your ATS score and AI-powered improvement suggestions</p>
          </div>

          {/* Mode toggle */}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 24 }}>
            <button onClick={() => setMode('upload')} style={{
              padding: '8px 20px', borderRadius: 10, fontWeight: 600, fontSize: '0.85rem',
              border: mode === 'upload' ? '2px solid var(--accent-blue)' : '1px solid var(--border-color)',
              background: mode === 'upload' ? 'rgba(59,130,246,0.1)' : 'var(--bg-card)',
              color: mode === 'upload' ? 'var(--accent-blue)' : 'var(--text-secondary)',
              cursor: 'pointer', fontFamily: 'inherit'
            }}>Upload PDF</button>
            <button onClick={() => setMode('paste')} style={{
              padding: '8px 20px', borderRadius: 10, fontWeight: 600, fontSize: '0.85rem',
              border: mode === 'paste' ? '2px solid var(--accent-purple)' : '1px solid var(--border-color)',
              background: mode === 'paste' ? 'rgba(139,92,246,0.1)' : 'var(--bg-card)',
              color: mode === 'paste' ? 'var(--accent-purple)' : 'var(--text-secondary)',
              cursor: 'pointer', fontFamily: 'inherit'
            }}>Paste Text</button>
          </div>

          {mode === 'upload' ? (
            <div {...getRootProps()} className="glass-card" style={{
              padding: 48, textAlign: 'center', cursor: 'pointer',
              border: isDragActive ? '2px dashed var(--accent-blue)' : '2px dashed var(--border-color)',
              transition: 'all 0.3s'
            }}>
              <input {...getInputProps()} />
              <HiOutlineDocumentArrowUp size={48} color={isDragActive ? 'var(--accent-blue)' : 'var(--text-muted)'} style={{ marginBottom: 16 }} />
              {file ? (
                <p style={{ color: 'var(--accent-green)', fontWeight: 600, margin: 0 }}>📄 {file.name}</p>
              ) : (
                <>
                  <p style={{ color: 'var(--text-secondary)', margin: '0 0 6px', fontWeight: 600 }}>
                    {isDragActive ? 'Drop it here!' : 'Drag & drop your resume here'}
                  </p>
                  <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.85rem' }}>PDF or TXT (max 5MB)</p>
                </>
              )}
            </div>
          ) : (
            <textarea
              className="input-field"
              value={resumeText}
              onChange={e => setResumeText(e.target.value)}
              placeholder="Paste your resume content here..."
              style={{ minHeight: 250, resize: 'vertical', fontFamily: 'inherit' }}
            />
          )}

          <motion.button
            whileTap={{ scale: 0.98 }}
            className="btn-primary"
            onClick={handleAnalyze}
            disabled={loading}
            style={{ width: '100%', marginTop: 20, padding: 16, fontSize: '1rem', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? '🔍 Analyzing...' : '🚀 Analyze Resume'}
          </motion.button>
        </>
      ) : (
        /* Results */
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Score header */}
          <div className="glass-card" style={{ padding: 32, display: 'flex', alignItems: 'center', gap: 32, marginBottom: 20 }}>
            <ScoreMeter score={analysis.atsScore} />
            <div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: 8 }}>
                {analysis.atsScore >= 71 ? '🎉 Great Resume!' : analysis.atsScore >= 51 ? '👍 Good, But Can Improve' : '⚠️ Needs Work'}
              </h3>
              <p style={{ color: 'var(--text-secondary)', margin: 0, lineHeight: 1.7 }}>{analysis.verdict}</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 16 }}>
            {/* Strengths */}
            <div className="glass-card" style={{ padding: 24 }}>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--accent-green)', marginBottom: 14, fontSize: '0.95rem' }}>
                <HiOutlineCheckCircle size={20} /> Strengths
              </h4>
              <ul style={{ paddingLeft: 18, margin: 0 }}>
                {analysis.strengths?.map((s, i) => <li key={i} style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 6 }}>{s}</li>)}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="glass-card" style={{ padding: 24 }}>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--accent-yellow)', marginBottom: 14, fontSize: '0.95rem' }}>
                <HiOutlineExclamationTriangle size={20} /> Weaknesses
              </h4>
              <ul style={{ paddingLeft: 18, margin: 0 }}>
                {analysis.weaknesses?.map((w, i) => <li key={i} style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 6 }}>{w}</li>)}
              </ul>
            </div>

            {/* Missing Keywords */}
            <div className="glass-card" style={{ padding: 24 }}>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--accent-red)', marginBottom: 14, fontSize: '0.95rem' }}>
                <HiOutlineXCircle size={20} /> Missing Keywords
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {analysis.missingKeywords?.map((k, i) => (
                  <span key={i} style={{
                    padding: '4px 12px', borderRadius: 20, background: 'rgba(239,68,68,0.1)',
                    color: 'var(--accent-red)', fontSize: '0.82rem', fontWeight: 600
                  }}>{k}</span>
                ))}
              </div>
            </div>

            {/* Suggestions */}
            <div className="glass-card" style={{ padding: 24 }}>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--accent-blue)', marginBottom: 14, fontSize: '0.95rem' }}>
                <HiOutlineSparkles size={20} /> Suggestions
              </h4>
              <ul style={{ paddingLeft: 18, margin: 0 }}>
                {analysis.suggestions?.map((s, i) => <li key={i} style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 6 }}>{s}</li>)}
              </ul>
            </div>
          </div>

          <button onClick={() => setAnalysis(null)} className="btn-secondary" style={{ marginTop: 24, width: '100%', textAlign: 'center' }}>
            Analyze Another Resume
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ResumePage;
