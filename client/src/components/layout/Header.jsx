import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { HiOutlineWifi, HiOutlineSignal } from 'react-icons/hi2';

const Header = ({ title }) => {
  const { user } = useAuth();
  const { connected } = useSocket();

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 32px',
      background: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border-color)',
      position: 'sticky',
      top: 0,
      zIndex: 30
    }}>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
        {title}
      </h2>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {/* Connection status */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '6px 12px', borderRadius: 20,
          background: connected ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
          fontSize: '0.8rem', fontWeight: 500,
          color: connected ? 'var(--accent-green)' : 'var(--accent-red)'
        }}>
          {connected ? <HiOutlineSignal size={14} /> : <HiOutlineWifi size={14} />}
          {connected ? 'Live' : 'Offline'}
        </div>

        {/* User avatar */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10
        }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
            {user?.name}
          </span>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'var(--gradient-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: '0.85rem', color: 'white'
          }}>
            {user?.name?.charAt(0)?.toUpperCase() || '?'}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
