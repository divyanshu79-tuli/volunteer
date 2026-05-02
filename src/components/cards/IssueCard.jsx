function timeAgo(date) {
  const diff = Date.now() - new Date(date).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

const CATEGORY_ICONS = {
  Water: '💧', Disaster: '🌊', Education: '📚', Health: '🏥',
  Sanitation: '🚿', Employment: '💼', Other: '📌',
}

export default function IssueCard({ issue, onClick, compact = false }) {
  const { urgency, category, title, description, aiSummary, location, peopleAffected, timestamp, status } = issue

  return (
    <div
      className={`issue-card urgency-left-${urgency} ${compact ? 'compact' : ''}`}
      onClick={() => onClick?.(issue)}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      id={`issue-card-${issue.id}`}
    >
      <div className="ic-header">
        <div className="ic-meta">
          <span className="ic-category-icon">{CATEGORY_ICONS[category] || '📌'}</span>
          <span className="ic-category">{category}</span>
          <span className={`urgency-badge urgency-${urgency}`}>
            <span className={`urgency-dot ${urgency}`} />
            {urgency}
          </span>
        </div>
        <span className="ic-time">{timeAgo(timestamp)}</span>
      </div>

      <h3 className="ic-title">{title}</h3>

      {!compact && (
        <p className="ic-desc">{aiSummary || description}</p>
      )}

      <div className="ic-footer">
        <div className="ic-location">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          {location?.area || 'Unknown'}
        </div>
        {peopleAffected > 0 && (
          <div className="ic-affected">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            {peopleAffected} affected
          </div>
        )}
      </div>

      <style>{`
        .issue-card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          transition: all 0.2s ease;
          border-left-width: 3px;
        }
        .issue-card:hover { background: var(--bg-card-hover); transform: translateY(-1px); }
        .issue-card.compact { padding: 11px 12px; gap: 6px; }

        .urgency-left-critical { border-left-color: var(--critical); }
        .urgency-left-high { border-left-color: var(--high); }
        .urgency-left-medium { border-left-color: var(--medium); }
        .urgency-left-low { border-left-color: var(--low); }

        .ic-header { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
        .ic-meta { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
        .ic-category-icon { font-size: 1rem; }
        .ic-category { font-size: 0.75rem; color: var(--text-muted); font-weight: 500; }
        .ic-time { font-size: 0.7rem; color: var(--text-muted); white-space: nowrap; }

        .ic-title { font-size: 0.9375rem; font-weight: 600; color: var(--text-primary); line-height: 1.35; }
        .issue-card.compact .ic-title { font-size: 0.875rem; }
        .ic-desc { font-size: 0.8125rem; color: var(--text-secondary); line-height: 1.5;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

        .ic-footer { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
        .ic-location, .ic-affected {
          display: flex; align-items: center; gap: 4px;
          font-size: 0.75rem; color: var(--text-muted);
        }
      `}</style>
    </div>
  )
}
