import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TopBar from '../components/layout/TopBar.jsx'
import BottomNav from '../components/layout/BottomNav.jsx'
import { useAuth } from '../contexts/AuthContext.jsx'
import { useApp } from '../contexts/AppContext.jsx'
import toast from 'react-hot-toast'

const ROLE_COLORS = {
  ngo_admin: '#6366f1', volunteer: '#22c55e', field_worker: '#f59e0b', public_viewer: '#38bdf8',
}
const ROLE_LABELS = {
  ngo_admin: 'NGO Admin', volunteer: 'Volunteer', field_worker: 'Field Worker', public_viewer: 'Public Viewer',
}
const ROLE_ICONS = {
  ngo_admin: '🏛️', volunteer: '🙋', field_worker: '🌾', public_viewer: '👁️',
}

export default function Profile() {
  const navigate = useNavigate()
  const { user, userProfile, logout, currentRole } = useAuth()
  const { stats, tasks } = useApp()
  const [loggingOut, setLoggingOut] = useState(false)

  const displayName = userProfile?.displayName || user?.displayName || 'User'
  const email = user?.email || 'demo@sevalink.ai'
  const initials = displayName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
  const roleColor = ROLE_COLORS[currentRole] || '#6366f1'
  const roleLabel = ROLE_LABELS[currentRole] || 'User'
  const roleIcon = ROLE_ICONS[currentRole] || '👤'

  const myCompletedTasks = tasks.filter(t => t.status === 'completed').length

  async function handleLogout() {
    setLoggingOut(true)
    try {
      await logout()
      navigate('/login', { replace: true })
      toast.success('Logged out successfully')
    } catch {
      toast.error('Logout failed')
      setLoggingOut(false)
    }
  }

  const menuItems = [
    { icon: '🤝', label: 'Volunteer Matching', desc: 'Find tasks that match your skills', action: () => navigate('/matching'), id: 'menu-matching' },
    { icon: '📤', label: 'Upload Report', desc: 'Submit a new community issue', action: () => navigate('/upload'), id: 'menu-upload' },
    { icon: '🗺️', label: 'Issue Map', desc: 'View all community issues on map', action: () => navigate('/map'), id: 'menu-map' },
    { icon: '🔔', label: 'Notifications', desc: 'Alerts and task updates', action: () => navigate('/notifications'), id: 'menu-notifs' },
  ]

  return (
    <div className="app-shell">
      <TopBar title="Profile" />
      <div className="page-content">

        {/* Profile Card */}
        <div className="section animate-fadeup">
          <div className="profile-hero">
            <div className="profile-avatar-large" style={{ background: `linear-gradient(135deg, ${roleColor}44, ${roleColor}22)`, borderColor: `${roleColor}55` }}>
              <span className="profile-initials">{initials}</span>
            </div>
            <div className="profile-info">
              <h2 className="profile-name">{displayName}</h2>
              <p className="profile-email">{email}</p>
              <div className="profile-role-badge" style={{ background: `${roleColor}22`, color: roleColor, borderColor: `${roleColor}44` }}>
                {roleIcon} {roleLabel}
              </div>
            </div>
          </div>

          {/* Impact Stats */}
          <div className="impact-stats">
            <div className="impact-stat">
              <div className="is-val" style={{ color: 'var(--low)' }}>{myCompletedTasks}</div>
              <div className="is-label">Tasks Done</div>
            </div>
            <div className="impact-divider" />
            <div className="impact-stat">
              <div className="is-val" style={{ color: 'var(--primary)' }}>{stats.activeVolunteers}</div>
              <div className="is-label">Team Size</div>
            </div>
            <div className="impact-divider" />
            <div className="impact-stat">
              <div className="is-val" style={{ color: '#f472b6' }}>{stats.totalAffected}</div>
              <div className="is-label">Lives Touched</div>
            </div>
            <div className="impact-divider" />
            <div className="impact-stat">
              <div className="is-val" style={{ color: 'var(--high)' }}>{stats.totalIssues}</div>
              <div className="is-label">Issues Tracked</div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="section animate-fadeup delay-1" style={{ paddingTop: 0 }}>
          <div className="section-title mb-3">Quick Links</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {menuItems.map(item => (
              <button key={item.id} className="menu-item" onClick={item.action} id={item.id}>
                <span className="menu-item-icon">{item.icon}</span>
                <div className="menu-item-text">
                  <span className="menu-item-label">{item.label}</span>
                  <span className="menu-item-desc">{item.desc}</span>
                </div>
                <span className="menu-item-arrow">›</span>
              </button>
            ))}
          </div>
        </div>

        {/* App Info */}
        <div className="section animate-fadeup delay-2" style={{ paddingTop: 0 }}>
          <div className="app-info-card glass-card-sm p-4">
            <div className="app-info-row">
              <span className="text-muted text-xs">App Version</span>
              <span className="text-xs" style={{ color: 'var(--primary)' }}>SevaLink AI v1.0.0</span>
            </div>
            <div className="app-info-row">
              <span className="text-muted text-xs">AI Engine</span>
              <span className="text-xs" style={{ color: 'var(--primary)' }}>Google Gemini 1.5 Flash</span>
            </div>
            <div className="app-info-row">
              <span className="text-muted text-xs">Database</span>
              <span className="text-xs" style={{ color: 'var(--primary)' }}>Firebase (volunteer-6dca7)</span>
            </div>
            <div className="app-info-row">
              <span className="text-muted text-xs">Mode</span>
              <span className="text-xs" style={{ color: 'var(--low)' }}>Demo Mode (add API keys to activate)</span>
            </div>
          </div>
        </div>

        {/* Logout */}
        <div className="section animate-fadeup delay-3" style={{ paddingTop: 0 }}>
          <button
            className="btn btn-outline btn-full"
            style={{ borderColor: 'var(--critical-border)', color: 'var(--critical)' }}
            onClick={handleLogout}
            disabled={loggingOut}
            id="btn-logout"
          >
            {loggingOut ? <span className="spinner" /> : '→ Sign Out'}
          </button>
        </div>

        <div style={{ padding: '0 16px 8px', textAlign: 'center' }}>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            SevaLink AI — Connecting communities with care 💙
          </p>
        </div>
      </div>
      <BottomNav />

      <style>{`
        .profile-hero {
          display: flex; align-items: center; gap: 16px; margin-bottom: 20px;
        }
        .profile-avatar-large {
          width: 76px; height: 76px; border-radius: 22px; border: 2px solid;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .profile-initials { font-size: 1.75rem; font-weight: 800; }
        .profile-info { display: flex; flex-direction: column; gap: 4px; }
        .profile-name { font-size: 1.25rem; font-weight: 800; }
        .profile-email { font-size: 0.8125rem; color: var(--text-muted); }
        .profile-role-badge {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 4px 12px; border-radius: 100px;
          font-size: 0.75rem; font-weight: 600; border: 1px solid;
          align-self: flex-start; margin-top: 2px;
        }
        .impact-stats {
          background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius);
          display: flex; align-items: center; padding: 16px 12px;
        }
        .impact-stat { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 3px; }
        .is-val { font-size: 1.375rem; font-weight: 800; line-height: 1; }
        .is-label { font-size: 0.625rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; text-align: center; }
        .impact-divider { width: 1px; height: 36px; background: var(--border); }
        .menu-item {
          display: flex; align-items: center; gap: 12px;
          padding: 13px 14px; background: var(--bg-card);
          border: 1px solid var(--border); border-radius: var(--radius-sm);
          cursor: pointer; transition: all 0.2s; text-align: left; width: 100%;
        }
        .menu-item:hover { background: var(--bg-card-hover); border-color: var(--border-bright); transform: translateX(3px); }
        .menu-item-icon { font-size: 1.25rem; flex-shrink: 0; }
        .menu-item-text { flex: 1; display: flex; flex-direction: column; gap: 1px; }
        .menu-item-label { font-size: 0.9rem; font-weight: 600; color: var(--text-primary); }
        .menu-item-desc { font-size: 0.75rem; color: var(--text-muted); }
        .menu-item-arrow { font-size: 1.25rem; color: var(--text-muted); }
        .app-info-card { display: flex; flex-direction: column; gap: 10px; }
        .app-info-row { display: flex; justify-content: space-between; align-items: center; }
      `}</style>
    </div>
  )
}
