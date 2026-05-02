import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { useApp } from '../../contexts/AppContext.jsx'

export default function TopBar({ title, showBack = false, rightAction = null }) {
  const navigate = useNavigate()
  const { userProfile, user } = useAuth()
  const { unreadCount } = useApp()

  const displayName = userProfile?.displayName || user?.displayName || user?.email?.split('@')[0] || 'User'
  const initials = displayName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

  return (
    <header className="topbar">
      <div className="topbar-left">
        {showBack ? (
          <button className="icon-btn" onClick={() => navigate(-1)} id="topbar-back">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
          </button>
        ) : (
          <div className="topbar-logo">
            <div className="logo-icon">🔗</div>
          </div>
        )}
        {title && <h1 className="topbar-title">{title}</h1>}
      </div>

      <div className="topbar-right">
        <button
          className="icon-btn notif-btn"
          onClick={() => navigate('/notifications')}
          id="topbar-notifications"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          {unreadCount > 0 && (
            <span className="notif-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
          )}
        </button>

        <button
          className="avatar-btn"
          onClick={() => navigate('/profile')}
          id="topbar-profile"
        >
          <span className="avatar-initials">{initials}</span>
        </button>
      </div>

      <style>{`
        .topbar {
          position: fixed;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 100%;
          max-width: 480px;
          height: var(--topbar-height);
          background: rgba(7, 7, 20, 0.9);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 16px;
          z-index: 99;
        }
        .topbar-left { display: flex; align-items: center; gap: 10px; }
        .topbar-right { display: flex; align-items: center; gap: 8px; }
        .topbar-logo { display: flex; align-items: center; gap: 8px; }
        .logo-icon { font-size: 1.5rem; }
        .topbar-title { font-size: 1.0625rem; font-weight: 700; color: var(--text-primary); }
        .icon-btn {
          width: 38px; height: 38px;
          display: flex; align-items: center; justify-content: center;
          border-radius: 10px;
          color: var(--text-secondary);
          transition: all 0.2s;
          position: relative;
        }
        .icon-btn:hover { background: var(--bg-card); color: var(--text-primary); }
        .notif-badge {
          position: absolute;
          top: 4px; right: 4px;
          background: var(--critical);
          color: white;
          font-size: 0.6rem;
          font-weight: 700;
          min-width: 16px; height: 16px;
          border-radius: 100px;
          display: flex; align-items: center; justify-content: center;
          padding: 0 3px;
          line-height: 1;
        }
        .avatar-btn {
          width: 36px; height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s;
          box-shadow: 0 2px 10px var(--primary-glow);
        }
        .avatar-btn:hover { transform: scale(1.05); }
        .avatar-initials { font-size: 0.8rem; font-weight: 700; color: white; }
      `}</style>
    </header>
  )
}
