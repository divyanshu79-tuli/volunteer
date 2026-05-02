import { useLocation, useNavigate } from 'react-router-dom'
import { useApp } from '../../contexts/AppContext.jsx'

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Home',  icon: '🏠', activeIcon: '🏠' },
  { path: '/map',       label: 'Map',   icon: '🗺️', activeIcon: '🗺️' },
  { path: '/tasks',     label: 'Tasks', icon: '✅', activeIcon: '✅' },
  { path: '/profile',   label: 'Me',    icon: '👤', activeIcon: '👤' },
]

export default function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()
  const { unreadCount } = useApp()

  return (
    <nav className="bottom-nav">
      {NAV_ITEMS.map((item) => {
        const active = location.pathname === item.path
        return (
          <button
            key={item.path}
            className={`nav-item ${active ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
            id={`nav-${item.label.toLowerCase()}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
            {active && <span className="nav-indicator" />}
          </button>
        )
      })}

      <style>{`
        .bottom-nav {
          position: fixed;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 100%;
          max-width: 480px;
          height: var(--nav-height);
          background: rgba(10, 10, 26, 0.85);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-top: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-around;
          z-index: 100;
          padding: 0 8px;
          padding-bottom: env(safe-area-inset-bottom, 0);
        }
        .nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
          padding: 8px 20px;
          border-radius: 12px;
          transition: all 0.2s ease;
          position: relative;
          flex: 1;
          color: var(--text-muted);
        }
        .nav-item.active { color: var(--primary); }
        .nav-item:hover { background: var(--bg-card); }
        .nav-icon { font-size: 1.375rem; line-height: 1; transition: transform 0.2s; }
        .nav-item.active .nav-icon { transform: scale(1.1); }
        .nav-label { font-size: 0.6875rem; font-weight: 500; }
        .nav-item.active .nav-label { font-weight: 700; color: var(--primary); }
        .nav-indicator {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 28px;
          height: 3px;
          background: var(--primary);
          border-radius: 0 0 4px 4px;
          box-shadow: 0 0 8px var(--primary-glow);
        }
      `}</style>
    </nav>
  )
}
