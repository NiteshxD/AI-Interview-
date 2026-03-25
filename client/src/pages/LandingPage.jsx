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

      {/* How it Works Section */}
      <section style={{ padding: '60px 48px 100px', background: 'var(--bg-secondary)', position: 'relative', zIndex: 10 }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, margin: '0 0 16px' }}>
            How it <span className="gradient-text">Works</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: 600, margin: '0 auto' }}>
            Four simple steps to elevate your interview preparation.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 80, maxWidth: 1000, margin: '0 auto' }}>
          {[
            { step: '01', title: 'AI Mock Interviews', desc: 'Select your target role and difficulty. Practice behavioral and technical questions with realistic AI.', icon: HiOutlineChatBubbleLeftRight, color: '#3b82f6', image: '/mock-interview.png' },
            { step: '02', title: 'Coding Challenges', desc: 'Solve real-world coding problems. Write, run, and test your code natively in our built-in Lab.', icon: HiOutlineCommandLine, color: '#8b5cf6', image: '/coding-lab.png' },
            { step: '03', title: 'Resume Analyzer', desc: 'Drop your resume to get an instant ATS score and tailored AI suggestions to bypass filters.', icon: HiOutlineDocumentText, color: '#ec4899', image: '/resume-analyzer.png' },
            { step: '04', title: 'Track Progress', desc: 'Monitor your performance over time. View average scores, history by role, and improvement areas.', icon: HiOutlineChartBarSquare, color: '#10b981', image: '/dashboard.png' }
          ].map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: 0.1, duration: 0.6 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 50,
                flexDirection: i % 2 !== 0 ? 'row-reverse' : 'row',
                flexWrap: 'wrap'
              }}
            >
              {/* Text Area */}
              <div style={{ flex: '1 1 300px', position: 'relative' }}>
                <div style={{ position: 'absolute', top: -40, left: -20, fontSize: '10rem', fontWeight: 900, color: 'rgba(255,255,255,0.02)', pointerEvents: 'none', lineHeight: 1 }}>
                  {item.step}
                </div>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: `${item.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, position: 'relative' }}>
                  <item.icon size={28} color={item.color} />
                </div>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 16 }}>{item.title}</h3>
                <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>{item.desc}</p>
              </div>

              {/* Image Area */}
              <div style={{ flex: '1 1 400px' }}>
                <div className="glass-card" style={{ padding: 8, overflow: 'hidden', background: 'rgba(255,255,255,0.02)' }}>
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{
                      width: '100%',
                      height: 'auto',
                      display: 'block',
                      borderRadius: 8,
                      border: '1px solid rgba(255,255,255,0.05)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                      backgroundColor: 'var(--bg-primary)',
                      aspectRatio: '16/9',
                      objectFit: 'cover'
                    }}
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 800 450"><rect fill="%231e1e2d" width="800" height="450"/><text fill="%236e6e80" font-family="sans-serif" font-size="24" font-weight="bold" x="50%" y="50%" text-anchor="middle">Image Placeholder: ' + item.image.replace('/', '') + '</text></svg>';
                    }}
                  />
                </div>
              </div>
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
