import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { HiOutlineHome, HiOutlineChatBubbleLeftRight, HiOutlineCommandLine, HiOutlineDocumentText, HiOutlineChartBarSquare, HiOutlineUserCircle, HiOutlineArrowRightOnRectangle } from 'react-icons/hi2';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: HiOutlineHome },
  { path: '/interview', label: 'Mock Interview', icon: HiOutlineChatBubbleLeftRight },
  { path: '/coding', label: 'Coding Lab', icon: HiOutlineCommandLine },
  { path: '/resume', label: 'Resume Analyzer', icon: HiOutlineDocumentText },
  { path: '/profile', label: 'Profile', icon: HiOutlineUserCircle },
];

const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.aside
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      style={{
        width: 260,
        minHeight: '100vh',
        background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 16px',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 40
      }}
    >
      {/* Logo */}
      <div style={{ padding: '0 8px 32px', borderBottom: '1px solid var(--border-color)', marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>
          <span className="gradient-text">InterviewYouNeed</span>
        </h1>
      </div>

      {/* Nav Items */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {navItems.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 16px',
              borderRadius: 12,
              textDecoration: 'none',
              color: isActive ? 'var(--accent-blue)' : 'var(--text-secondary)',
              background: isActive ? 'rgba(59,130,246,0.1)' : 'transparent',
              fontWeight: isActive ? 600 : 400,
              fontSize: '0.92rem',
              transition: 'all 0.2s'
            })}
          >
            <Icon size={20} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <button
        onClick={handleLogout}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '12px 16px',
          borderRadius: 12,
          background: 'rgba(239,68,68,0.1)',
          color: 'var(--accent-red)',
          border: 'none',
          cursor: 'pointer',
          fontWeight: 500,
          fontSize: '0.92rem',
          fontFamily: 'inherit',
          transition: 'all 0.2s',
          marginTop: 8
        }}
      >
        <HiOutlineArrowRightOnRectangle size={20} />
        Logout
      </button>
    </motion.aside>
  );
};

export default Sidebar;
