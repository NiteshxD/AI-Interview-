import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import toast from 'react-hot-toast';
import { HiOutlineUserCircle, HiOutlineEnvelope, HiOutlineCalendar } from 'react-icons/hi2';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await API.put('/auth/profile', { name });
      toast.success('Profile updated!');
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ maxWidth: 600, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          background: 'var(--gradient-primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '2rem', fontWeight: 800, color: 'white',
          margin: '0 auto 16px',
          boxShadow: 'var(--shadow-glow)'
        }}>
          {user?.name?.charAt(0)?.toUpperCase() || '?'}
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 4px' }}>
          <span className="gradient-text">{user?.name}</span>
        </h2>
        <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem' }}>{user?.email}</p>
      </div>

      <div className="glass-card" style={{ padding: 32 }}>
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>
            <HiOutlineUserCircle size={16} /> Full Name
          </label>
          <input
            type="text"
            className="input-field"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>
            <HiOutlineEnvelope size={16} /> Email
          </label>
          <input
            type="email"
            className="input-field"
            value={user?.email || ''}
            disabled
            style={{ opacity: 0.6 }}
          />
        </div>

        <div style={{ marginBottom: 28 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>
            <HiOutlineCalendar size={16} /> Member Since
          </label>
          <input
            type="text"
            className="input-field"
            value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
            disabled
            style={{ opacity: 0.6 }}
          />
        </div>

        <motion.button
          whileTap={{ scale: 0.98 }}
          className="btn-primary"
          onClick={handleSave}
          disabled={saving}
          style={{ width: '100%', padding: 14, opacity: saving ? 0.7 : 1 }}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ProfilePage;
