import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, LineChart, Line, CartesianGrid } from 'recharts';
import API from '../api/axios';
import { HiOutlineTrophy, HiOutlineAcademicCap, HiOutlineChartBar, HiOutlineClock, HiOutlineDocumentText } from 'react-icons/hi2';

const StatCard = ({ icon: Icon, label, value, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="glass-card"
    style={{ padding: 24 }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <div style={{
        width: 48, height: 48, borderRadius: 12,
        background: `${color}15`,
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <Icon size={24} color={color} />
      </div>
      <div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem', fontWeight: 600, marginBottom: 2 }}>{label}</div>
        <div style={{ fontSize: '1.5rem', fontWeight: 800, color }}>{value}</div>
      </div>
    </div>
  </motion.div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border-color)',
        borderRadius: 10, padding: '10px 14px', fontSize: '0.85rem'
      }}>
        <p style={{ margin: 0, fontWeight: 600 }}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ margin: '4px 0 0', color: p.color }}>
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/dashboard/stats')
      .then(res => setStats(res.data))
      .catch(() => {
        // Use demo data if no stats yet
        setStats({
          totalInterviews: 0,
          avgScore: 0,
          roleBreakdown: {},
          difficultyBreakdown: {},
          recentScores: [],
          latestResume: null,
          totalResumesAnalyzed: 0
        });
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="shimmer" style={{ width: 50, height: 50, borderRadius: '50%', margin: '0 auto 12px', background: 'var(--bg-card)' }} />
          <p style={{ color: 'var(--text-muted)' }}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const roleData = Object.entries(stats.roleBreakdown || {}).map(([role, data]) => ({
    role,
    score: data.avgScore,
    interviews: data.count
  }));

  const recentData = (stats.recentScores || []).map((s, i) => ({
    name: `#${i + 1}`,
    score: s.score,
    role: s.role
  })).reverse();

  const radarData = Object.entries(stats.roleBreakdown || {}).map(([role, data]) => ({
    subject: role,
    score: data.avgScore,
    fullMark: 10
  }));

  return (
    <div>
      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 28 }}>
        <StatCard icon={HiOutlineAcademicCap} label="Total Interviews" value={stats.totalInterviews} color="#3b82f6" delay={0} />
        <StatCard icon={HiOutlineTrophy} label="Average Score" value={`${stats.avgScore}/10`} color="#10b981" delay={0.1} />
        <StatCard icon={HiOutlineDocumentText} label="Resumes Analyzed" value={stats.totalResumesAnalyzed} color="#8b5cf6" delay={0.2} />
        <StatCard icon={HiOutlineClock} label="Latest ATS Score" value={stats.latestResume ? `${stats.latestResume.atsScore}%` : 'N/A'} color="#f59e0b" delay={0.3} />
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 20 }}>
        {/* Score Progress */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 20 }}>
            <HiOutlineChartBar size={18} style={{ verticalAlign: 'middle', marginRight: 8, color: 'var(--accent-blue)' }} />
            Recent Scores
          </h3>
          {recentData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={recentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} />
                <YAxis domain={[0, 10]} stroke="var(--text-muted)" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
              Complete interviews to see your progress
            </div>
          )}
        </motion.div>

        {/* Role Performance */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 20 }}>
            <HiOutlineTrophy size={18} style={{ verticalAlign: 'middle', marginRight: 8, color: 'var(--accent-green)' }} />
            Performance by Role
          </h3>
          {roleData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={roleData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="role" stroke="var(--text-muted)" fontSize={12} />
                <YAxis domain={[0, 10]} stroke="var(--text-muted)" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="score" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
              No role data yet
            </div>
          )}
        </motion.div>

        {/* Radar Chart */}
        {radarData.length >= 3 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass-card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 20 }}>Skill Radar</h3>
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="var(--border-color)" />
                <PolarAngleAxis dataKey="subject" stroke="var(--text-muted)" fontSize={12} />
                <PolarRadiusAxis domain={[0, 10]} stroke="var(--border-color)" fontSize={10} />
                <Radar name="Score" dataKey="score" stroke="#ec4899" fill="#ec489944" strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>
        )}
      </div>

      {/* Interview History */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="glass-card" style={{ padding: 24, marginTop: 20 }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 16 }}>Recent Interview History</h3>
        {(stats.recentScores || []).length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  {['Role', 'Difficulty', 'Score', 'Date'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '10px 12px', fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stats.recentScores.map((s, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '10px 12px', fontSize: '0.9rem' }}>{s.role}</td>
                    <td style={{ padding: '10px 12px', fontSize: '0.9rem' }}>
                      <span style={{
                        padding: '2px 10px', borderRadius: 6, fontSize: '0.78rem', fontWeight: 600,
                        background: s.difficulty === 'Easy' ? '#10b98115' : s.difficulty === 'Medium' ? '#f59e0b15' : '#ef444415',
                        color: s.difficulty === 'Easy' ? '#10b981' : s.difficulty === 'Medium' ? '#f59e0b' : '#ef4444'
                      }}>{s.difficulty}</span>
                    </td>
                    <td style={{ padding: '10px 12px', fontSize: '0.9rem', fontWeight: 700, color: s.score >= 7 ? 'var(--accent-green)' : s.score >= 5 ? 'var(--accent-yellow)' : 'var(--accent-red)' }}>{s.score}/10</td>
                    <td style={{ padding: '10px 12px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{new Date(s.date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 32 }}>No interview history yet. Start your first interview!</p>
        )}
      </motion.div>
    </div>
  );
};

export default DashboardPage;
