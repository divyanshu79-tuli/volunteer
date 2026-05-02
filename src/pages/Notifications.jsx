import TopBar from '../components/layout/TopBar.jsx'
import BottomNav from '../components/layout/BottomNav.jsx'
import { useApp } from '../contexts/AppContext.jsx'
import { useNavigate } from 'react-router-dom'

function timeAgo(date) {
  const diff = Date.now() - new Date(date).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

const TYPE_CONFIG = {
  critical: { icon: '🚨', color: 'var(--critical)', bg: 'var(--critical-bg)', border: 'var(--critical-border)', label: 'Critical Alert' },
  assignment: { icon: '✅', color: 'var(--low)', bg: 'var(--low-bg)', border: 'var(--low-border)', label: 'Task Assigned' },
  ai: { icon: '🤖', color: 'var(--primary)', bg: 'rgba(99,102,241,0.1)', border: 'rgba(99,102,241,0.25)', label: 'AI Detected' },
  info: { icon: 'ℹ️', color: 'var(--accent)', bg: 'rgba(56,189,248,0.1)', border: 'rgba(56,189,248,0.2)', label: 'Info' },
  success: { icon: '🎉', color: 'var(--low)', bg: 'var(--low-bg)', border: 'var(--low-border)', label: 'Success' },
}

export default function Notifications() {
  const { notifications, markNotificationRead, markAllRead, unreadCount } = useApp()
  const navigate = useNavigate()

  return (
    <div className="app-shell">
      <TopBar title="Notifications" showBack />
      <div className="page-content">
        {/* Header actions */}
        <div className="section animate-fadeup">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p className="text-secondary text-sm">
                {unreadCount > 0 ? <><span style={{ color: 'var(--critical)', fontWeight: 700 }}>{unreadCount} unread</span> alerts</> : 'All caught up! ✓'}
              </p>
            </div>
            {unreadCount > 0 && (
              <button className="btn btn-ghost btn-sm" onClick={markAllRead} id="btn-mark-all-read">
                Mark all read
              </button>
            )}
          </div>
        </div>

        {/* Notifications list */}
        <div className="section animate-fadeup delay-1" style={{ paddingTop: 0 }}>
          {notifications.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔕</div>
              <div className="empty-title">No notifications</div>
              <div className="empty-desc">You'll be alerted when critical issues arise or tasks are assigned to you.</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {notifications.map((notif, i) => {
                const conf = TYPE_CONFIG[notif.type] || TYPE_CONFIG.info
                return (
                  <div
                    key={notif.id}
                    className={`notif-item animate-fadeup delay-${Math.min(i + 1, 5)} ${notif.read ? 'read' : 'unread'}`}
                    style={{ '--notif-color': conf.color, '--notif-bg': conf.bg, '--notif-border': conf.border }}
                    onClick={() => {
                      markNotificationRead(notif.id)
                      if (notif.taskId) navigate('/tasks')
                      else if (notif.issueId) navigate('/map')
                    }}
                    id={`notif-${notif.id}`}
                  >
                    <div className="notif-icon-wrap">
                      <span className="notif-icon">{conf.icon}</span>
                    </div>
                    <div className="notif-body">
                      <div className="notif-header-row">
                        <span className="notif-type-badge">{conf.label}</span>
                        <span className="notif-time">{timeAgo(notif.timestamp)}</span>
                      </div>
                      <h3 className="notif-title">{notif.title}</h3>
                      <p className="notif-msg">{notif.message}</p>
                    </div>
                    {!notif.read && <div className="notif-unread-dot" />}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
      <BottomNav />

      <style>{`
        .notif-item {
          display: flex; align-items: flex-start; gap: 12px;
          padding: 14px; border-radius: var(--radius);
          border: 1px solid var(--notif-border);
          background: var(--notif-bg);
          cursor: pointer; transition: all 0.2s;
          position: relative;
        }
        .notif-item:hover { opacity: 0.85; transform: translateX(2px); }
        .notif-item.read { opacity: 0.6; border-color: var(--border); background: var(--bg-card); }
        .notif-icon-wrap {
          width: 40px; height: 40px; flex-shrink: 0;
          background: rgba(255,255,255,0.06); border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.25rem;
        }
        .notif-body { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 4px; }
        .notif-header-row { display: flex; align-items: center; justify-content: space-between; }
        .notif-type-badge {
          font-size: 0.65rem; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.06em; color: var(--notif-color);
        }
        .notif-time { font-size: 0.7rem; color: var(--text-muted); }
        .notif-title { font-size: 0.875rem; font-weight: 600; color: var(--text-primary); line-height: 1.35; }
        .notif-msg { font-size: 0.8rem; color: var(--text-secondary); line-height: 1.45;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .notif-unread-dot {
          position: absolute; top: 14px; right: 14px;
          width: 8px; height: 8px; border-radius: 50%;
          background: var(--notif-color);
          box-shadow: 0 0 6px var(--notif-color);
        }
      `}</style>
    </div>
  )
}
