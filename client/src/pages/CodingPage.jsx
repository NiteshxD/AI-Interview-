import { useState } from 'react';
import { motion } from 'framer-motion';
import Editor from '@monaco-editor/react';
import API from '../api/axios';
import toast from 'react-hot-toast';
import { HiOutlinePlay, HiOutlineSparkles, HiOutlineLightBulb, HiOutlineArrowPath } from 'react-icons/hi2';

const languages = [
  { name: 'JavaScript', value: 'javascript', template: '// Write your solution here\nfunction solution(input) {\n  \n}\n\nconsole.log(solution());' },
  { name: 'Python', value: 'python', template: '# Write your solution here\ndef solution(input):\n    pass\n\nprint(solution())' },
  { name: 'Java', value: 'java', template: 'public class Main {\n    public static void main(String[] args) {\n        // Write your solution here\n    }\n}' },
  { name: 'C++', value: 'cpp', template: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your solution here\n    return 0;\n}' }
];

const difficultyColors = { Easy: '#10b981', Medium: '#f59e0b', Hard: '#ef4444' };

const CodingPage = () => {
  const [code, setCode] = useState(languages[0].template);
  const [language, setLanguage] = useState('javascript');
  const [output, setOutput] = useState('');
  const [problem, setProblem] = useState(null);
  const [loadingProblem, setLoadingProblem] = useState(false);
  const [running, setRunning] = useState(false);
  const [difficulty, setDifficulty] = useState('Medium');
  const [showHints, setShowHints] = useState(false);

  const fetchProblem = async () => {
    setLoadingProblem(true);
    try {
      const res = await API.post('/coding/problem', { role: 'Full Stack', difficulty });
      setProblem(res.data.problem);
      setShowHints(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch problem');
    } finally {
      setLoadingProblem(false);
    }
  };

  const runCode = async () => {
    setRunning(true);
    setOutput('Running...');
    try {
      const res = await API.post('/coding/execute', { code, language });
      const result = res.data.result;
      let outputText = '';
      if (result.stdout) outputText += result.stdout;
      if (result.stderr) outputText += '\n⚠️ STDERR:\n' + result.stderr;
      if (result.compile_output) outputText += '\n❌ Compile Error:\n' + result.compile_output;
      if (result.status) outputText += `\n\n📊 Status: ${result.status.description} | Time: ${result.time}s | Memory: ${result.memory}KB`;
      setOutput(outputText.trim() || 'No output');
    } catch (err) {
      setOutput('Error: ' + (err.response?.data?.message || 'Failed to run code'));
    } finally {
      setRunning(false);
    }
  };

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    const langObj = languages.find(l => l.value === newLang);
    if (langObj) setCode(langObj.template);
  };

  return (
    <div style={{ display: 'flex', gap: 20, height: 'calc(100vh - 140px)' }}>
      {/* Left panel - Problem */}
      <div style={{ width: '40%', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Problem controls */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {['Easy', 'Medium', 'Hard'].map(d => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              style={{
                padding: '6px 14px', borderRadius: 8, fontSize: '0.8rem', fontWeight: 600,
                border: difficulty === d ? `2px solid ${difficultyColors[d]}` : '1px solid var(--border-color)',
                background: difficulty === d ? `${difficultyColors[d]}15` : 'var(--bg-card)',
                color: difficulty === d ? difficultyColors[d] : 'var(--text-secondary)',
                cursor: 'pointer', fontFamily: 'inherit'
              }}
            >{d}</button>
          ))}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={fetchProblem}
            disabled={loadingProblem}
            className="btn-primary"
            style={{ marginLeft: 'auto', padding: '8px 16px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 6 }}
          >
            {loadingProblem ? <HiOutlineArrowPath size={16} className="animate-spin" /> : <HiOutlineSparkles size={16} />}
            {loadingProblem ? 'Generating...' : 'Get Problem'}
          </motion.button>
        </div>

        {/* Problem display */}
        <div className="glass-card" style={{ flex: 1, overflow: 'auto', padding: 24 }}>
          {problem ? (
            <>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 4 }}>{problem.title}</h3>
              <span style={{
                display: 'inline-block', padding: '2px 10px', borderRadius: 6, fontSize: '0.75rem',
                fontWeight: 700, background: `${difficultyColors[problem.difficulty || difficulty]}15`,
                color: difficultyColors[problem.difficulty || difficulty], marginBottom: 16
              }}>{problem.difficulty || difficulty}</span>

              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 20, fontSize: '0.92rem', whiteSpace: 'pre-wrap' }}>{problem.description}</p>

              {problem.constraints?.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: 8 }}>Constraints</h4>
                  <ul style={{ paddingLeft: 18, margin: 0 }}>
                    {problem.constraints.map((c, i) => <li key={i} style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: 4 }}>{c}</li>)}
                  </ul>
                </div>
              )}

              {problem.examples?.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: 8 }}>Examples</h4>
                  {problem.examples.map((ex, i) => (
                    <div key={i} style={{ background: 'var(--bg-input)', borderRadius: 10, padding: 14, marginBottom: 10 }}>
                      <div style={{ fontSize: '0.85rem' }}>
                        <strong>Input:</strong> <code style={{ color: 'var(--accent-blue)' }}>{ex.input}</code>
                      </div>
                      <div style={{ fontSize: '0.85rem', marginTop: 4 }}>
                        <strong>Output:</strong> <code style={{ color: 'var(--accent-green)' }}>{ex.output}</code>
                      </div>
                      {ex.explanation && (
                        <div style={{ fontSize: '0.83rem', marginTop: 4, color: 'var(--text-muted)' }}>
                          <em>{ex.explanation}</em>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {problem.hints?.length > 0 && (
                <div>
                  <button
                    onClick={() => setShowHints(!showHints)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8,
                      background: 'rgba(245,158,11,0.1)', color: 'var(--accent-yellow)',
                      border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', fontFamily: 'inherit'
                    }}
                  >
                    <HiOutlineLightBulb size={16} /> {showHints ? 'Hide Hints' : 'Show Hints'}
                  </button>
                  {showHints && (
                    <ul style={{ paddingLeft: 18, marginTop: 10 }}>
                      {problem.hints.map((h, i) => <li key={i} style={{ color: 'var(--accent-yellow)', fontSize: '0.88rem', marginBottom: 4 }}>{h}</li>)}
                    </ul>
                  )}
                </div>
              )}
            </>
          ) : (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, color: 'var(--text-muted)' }}>
              <HiOutlineSparkles size={48} />
              <p style={{ margin: 0, fontSize: '0.95rem' }}>Click "Get Problem" to generate a coding challenge</p>
            </div>
          )}
        </div>
      </div>

      {/* Right panel - Editor & Output */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Language selector & run button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 6 }}>
            {languages.map(l => (
              <button
                key={l.value}
                onClick={() => handleLanguageChange(l.value)}
                style={{
                  padding: '6px 14px', borderRadius: 8, fontSize: '0.8rem', fontWeight: 600,
                  border: language === l.value ? '2px solid var(--accent-blue)' : '1px solid var(--border-color)',
                  background: language === l.value ? 'rgba(59,130,246,0.1)' : 'var(--bg-card)',
                  color: language === l.value ? 'var(--accent-blue)' : 'var(--text-secondary)',
                  cursor: 'pointer', fontFamily: 'inherit'
                }}
              >{l.name}</button>
            ))}
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={runCode}
            disabled={running}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '8px 20px', borderRadius: 10,
              background: 'rgba(16,185,129,0.15)', color: 'var(--accent-green)',
              border: '1px solid rgba(16,185,129,0.3)', cursor: 'pointer',
              fontWeight: 600, fontSize: '0.85rem', fontFamily: 'inherit'
            }}
          >
            <HiOutlinePlay size={16} /> {running ? 'Running...' : 'Run Code'}
          </motion.button>
        </div>

        {/* Monaco Editor */}
        <div style={{ flex: 1, borderRadius: 16, overflow: 'hidden', border: '1px solid var(--border-color)' }}>
          <Editor
            height="100%"
            language={language}
            value={code}
            onChange={val => setCode(val || '')}
            theme="vs-dark"
            options={{
              fontSize: 14,
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              minimap: { enabled: false },
              padding: { top: 16 },
              scrollBeyondLastLine: false,
              smoothScrolling: true,
              cursorBlinking: 'smooth',
              wordWrap: 'on'
            }}
          />
        </div>

        {/* Output */}
        <div className="glass-card" style={{ padding: 16, maxHeight: 200, overflow: 'auto' }}>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: 8, color: 'var(--text-muted)' }}>Output</h4>
          <pre style={{
            margin: 0, fontFamily: "'JetBrains Mono', monospace", fontSize: '0.85rem',
            color: output.includes('Error') || output.includes('❌') ? 'var(--accent-red)' : 'var(--accent-green)',
            whiteSpace: 'pre-wrap', wordBreak: 'break-word'
          }}>
            {output || 'Run your code to see output here...' }
          </pre>
        </div>
      </div>
    </div>
  );
};

export default CodingPage;
