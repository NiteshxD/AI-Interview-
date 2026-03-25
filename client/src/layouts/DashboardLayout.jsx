import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/interview': 'AI Mock Interview',
  '/coding': 'Coding Lab',
  '/resume': 'Resume Analyzer',
  '/profile': 'Profile',
};

const DashboardLayout = () => {
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'AI Interviewer Pro';

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ flex: 1, marginLeft: 260, display: 'flex', flexDirection: 'column' }}>
        <Header title={title} />
        <div style={{ flex: 1, padding: '24px 32px', overflow: 'auto' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
