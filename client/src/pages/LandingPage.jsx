import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineChatBubbleLeftRight, HiOutlineCommandLine, HiOutlineDocumentText, HiOutlineChartBarSquare, HiOutlineBolt, HiOutlineMicrophone } from 'react-icons/hi2';

const features = [
  { icon: HiOutlineChatBubbleLeftRight, title: 'AI Mock Interviews', desc: 'Practice with FAANG-level AI interviewer across multiple roles and difficulty levels', color: '#3b82f6' },
  { icon: HiOutlineCommandLine, title: 'Coding Challenges', desc: 'Solve real coding problems with Monaco Editor and multi-language support', color: '#8b5cf6' },
  { icon: HiOutlineDocumentText, title: 'Resume Analyzer', desc: 'Get your ATS score and AI-powered feedback to perfect your resume', color: '#ec4899' },
  { icon: HiOutlineChartBarSquare, title: 'Performance Dashboard', desc: 'Track your progress with detailed analytics and score tracking', color: '#10b981' },
  { icon: HiOutlineBolt, title: 'Real-time Feedback', desc: 'Instant AI evaluation with strengths, weaknesses, and improved answers', color: '#f59e0b' },
  { icon: HiOutlineMicrophone, title: 'Voice Input', desc: 'Answer interview questions using your voice with Web Speech API', color: '#ef4444' },
];

const LandingPage = () => {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', overflow: 'hidden' }}>
      {/* Ambient glow effects */}
      <div style={{ position: 'fixed', top: '-20%', right: '-10%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.08), transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '-20%', left: '-10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.08), transparent 70%)', pointerEvents: 'none' }} />

      {/* Header */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 48px', position: 'relative', zIndex: 10 }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>
          <span className="gradient-text">InterviewYouNeed</span>
        </h1>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link to="/login" className="btn-secondary" style={{ textDecoration: 'none', padding: '10px 24px' }}>Sign In</Link>
          <Link to="/signup" className="btn-primary" style={{ textDecoration: 'none', padding: '10px 24px' }}>Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{ textAlign: 'center', padding: '80px 24px 60px', position: 'relative', zIndex: 10 }}
      >
        <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, lineHeight: 1.1, margin: '0 0 20px', maxWidth: 800, marginInline: 'auto' }}>
          Ace Your Next <br />
          <span className="gradient-text">Tech Interview</span>
        </h2>

        <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', maxWidth: 600, margin: '0 auto 40px', lineHeight: 1.7 }}>
          Practice with AI-powered mock interviews, solve coding challenges, analyze your resume — all designed to help you land your dream FAANG job.
        </p>

        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/signup" className="btn-primary" style={{ textDecoration: 'none', padding: '14px 36px', fontSize: '1.05rem' }}>
            Start Practicing Free
          </Link>
        </div>
      </motion.section>

      {/* Features Grid */}
      <section style={{ padding: '40px 48px 100px', position: 'relative', zIndex: 10 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 20,
          maxWidth: 1200,
          margin: '0 auto'
        }}>
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i + 0.4 }}
              className="glass-card"
              style={{
                padding: 28,
                cursor: 'default',
                transition: 'all 0.3s'
              }}
              whileHover={{ y: -4, scale: 1.02 }}
            >
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: `${feature.color}15`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 16
              }}>
                <feature.icon size={24} color={feature.color} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 8 }}>{feature.title}</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '24px', borderTop: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        Build By Nitesh Yadav
      </footer>
    </div>
  );
};

export default LandingPage;
