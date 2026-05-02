const STATUS_CONFIG = {
  pending: { label: 'Pending', color: 'var(--medium)', bg: 'var(--medium-bg)', icon: '⏳' },
  'in-progress': { label: 'In Progress', color: 'var(--primary)', bg: 'var(--primary-glow)', icon: '🔄' },
  completed: { label: 'Completed', color: 'var(--low)', bg: 'var(--low-bg)', icon: '✅' },
}

const CATEGORY_ICONS = {
  Water: '💧', Disaster: '🌊', Education: '📚', Health: '🏥',
  Sanitation: '🚿', Employment: '💼', Other: '📌',
}

function timeLeft(deadline) {
  if (!deadline) return null
  const diff = new Date(deadline).getTime() - Date.now()
  if (diff < 0) return 'Overdue'
  const h = Math.floor(diff / 3600000)
  if (h < 24) return `${h}h left`
  return `${Math.floor(h / 24)}d left`
}

export default function TaskCard({ task, onAccept, onReject, onComplete, showActions = true }) {
  const { id, title, description, category, urgency, status, location, volunteersNeeded, deadline } = task
  const statusConf = STATUS_CONFIG[status] || STATUS_CONFIG.pending
  const remaining = timeLeft(deadline)
  const isOverdue = remaining === 'Overdue'

  return (
    <div className={`task-card tc-${urgency}`} id={`task-card-${id}`}>
      <div className="tc-header">
        <div className="tc-category">
          <span>{CATEGORY_ICONS[category] || '📌'}</span>
          <span className="tc-cat-name">{category}</span>
        </div>
        <span
          className="tc-status"
          style={{ background: statusConf.bg, color: statusConf.color }}
        >
          {statusConf.icon} {statusConf.label}
        </span>
      </div>

      <h3 className="tc-title">{title}</h3>
      <p className="tc-desc">{description}</p>

      <div className="tc-meta-row">
        {location && (
          <span className="tc-meta-item">
            📍 {location}
          </span>
        )}
        {volunteersNeeded && (
          <span className="tc-meta-item">
            👥 {volunteersNeeded} volunteers
          </span>
        )}
        {remaining && (
          <span className={`tc-meta-item ${isOverdue ? 'tc-overdue' : ''}`}>
            ⏱ {remaining}
          </span>
        )}
      </div>

      {showActions && status === 'pending' && (
        <div className="tc-actions">
          {onAccept && (
            <button className="btn btn-success btn-sm" onClick={() => onAccept(task)} id={`accept-task-${id}`}>
              ✓ Accept
            </button>
          )}
          {onReject && (
            <button className="btn btn-outline btn-sm" onClick={() => onReject(task)} id={`reject-task-${id}`}>
              ✕ Decline
            </button>
          )}
        </div>
      )}
      {showActions && status === 'in-progress' && onComplete && (
        <div className="tc-actions">
          <button className="btn btn-primary btn-sm" onClick={() => onComplete(task)} id={`complete-task-${id}`}>
            🎯 Mark Complete
          </button>
        </div>
      )}

      <style>{`
        .task-card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          transition: all 0.2s ease;
        }
        .task-card:hover { background: var(--bg-card-hover); }

        .tc-header { display: flex; align-items: center; justify-content: space-between; }
        .tc-category { display: flex; align-items: center; gap: 5px; }
        .tc-cat-name { font-size: 0.75rem; color: var(--text-muted); font-weight: 500; }
        .tc-status {
          display: inline-flex; align-items: center; gap: 3px;
          padding: 3px 10px; border-radius: 100px;
          font-size: 0.725rem; font-weight: 600;
        }

        .tc-title { font-size: 0.9375rem; font-weight: 600; color: var(--text-primary); line-height: 1.35; }
        .tc-desc { font-size: 0.8125rem; color: var(--text-secondary); line-height: 1.5;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

        .tc-meta-row { display: flex; flex-wrap: wrap; gap: 8px; }
        .tc-meta-item { font-size: 0.75rem; color: var(--text-muted); }
        .tc-overdue { color: var(--critical) !important; }

        .tc-actions { display: flex; gap: 8px; margin-top: 4px; }
      `}</style>
    </div>
  )
}
