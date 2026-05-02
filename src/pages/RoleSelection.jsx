import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'
import toast from 'react-hot-toast'

const ROLES = [
  {
    id: 'ngo_admin',
    title: 'NGO Admin',
    icon: '🏛️',
    description: 'Manage organization, upload reports, create tasks, view full analytics',
    color: '#6366f1',
    glow: 'rgba(99,102,241,0.3)',
    powers: ['Upload Data', 'Create Tasks', 'Full Dashboard', 'Volunteer Management'],
  },
  {
    id: 'volunteer',
    title: 'Volunteer',
    icon: '🙋',
    description: 'Accept tasks, update progress, view your impact stats',
    color: '#22c55e',
    glow: 'rgba(34,197,94,0.25)',
    powers: ['Accept Tasks', 'Map View', 'Task Tracking', 'AI Matching'],
  },
  {
    id: 'field_worker',
    title: 'Field Worker',
    icon: '🌾',
    description: 'Submit field reports, capture voice notes, work offline',
    color: '#f59e0b',
    glow: 'rgba(245,158,11,0.25)',
    powers: ['Submit Reports', 'Voice Notes', 'Offline Mode', 'Photo Upload'],
  },
  {
    id: 'public_viewer',
    title: 'Public Viewer',
    icon: '👁️',
    description: 'View community needs dashboard and map — no account needed',
    color: '#38bdf8',
    glow: 'rgba(56,189,248,0.25)',
    powers: ['View Dashboard', 'Public Map', 'Issue Stats', 'News Feed'],
  },
]

export default function RoleSelection() {
  const navigate = useNavigate()
  const { updateUserRole, userProfile } = useAuth()
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleContinue() {
    if (!selected) { toast.error('Please select a role'); return }
    setLoading(true)
    try {
      await updateUserRole(selected)
      navigate('/dashboard', { replace: true })
      toast.success(`Welcome as ${ROLES.find(r => r.id === selected)?.title}! 🎉`)
    } catch {
      toast.error('Failed to save role')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="role-page">
      <div className="role-header animate-fadeup">
        <h1 className="role-title">Choose Your Role</h1>
        <p className="role-subtitle">
          Hi {userProfile?.displayName?.split(' ')[0] || 'there'}! How will you contribute to the community?
        </p>
      </div>

      <div className="role-grid">
        {ROLES.map((role, i) => (
          <button
            key={role.id}
            id={`role-${role.id}`}
            className={`role-card animate-fadeup delay-${i + 1} ${selected === role.id ? 'selected' : ''}`}
            style={{ '--role-color': role.color, '--role-glow': role.glow }}
            onClick={() => setSelected(role.id)}
          >
            <div className="role-icon-wrap">
              <span className="role-icon">{role.icon}</span>
            </div>
            <h3 className="role-card-title">{role.title}</h3>
            <p className="role-card-desc">{role.description}</p>
            <div className="role-powers">
              {role.powers.map(p => (
                <span key={p} className="role-power-tag">✓ {p}</span>
              ))}
            </div>
            {selected === role.id && <div className="role-selected-check">✓</div>}
          </button>
        ))}
      </div>

      <div className="role-footer animate-fadeup">
        <button
          className="btn btn-primary btn-full"
          onClick={handleContinue}
          disabled={loading || !selected}
          id="btn-confirm-role"
        >
          {loading ? <span className="spinner" /> : `Continue as ${selected ? ROLES.find(r => r.id === selected)?.title : '...'} →`}
        </button>
        <p className="role-note">You can change your role anytime from Profile settings</p>
      </div>

      <style>{`
        .role-page {
          min-height: 100dvh;
          background: var(--bg-primary);
          padding: 40px 16px 24px;
          display: flex; flex-direction: column; gap: 24px;
          max-width: 480px; margin: 0 auto;
        }
        .role-header { text-align: center; }
        .role-title { font-size: 1.75rem; font-weight: 800; margin-bottom: 8px; }
        .role-subtitle { font-size: 0.9375rem; color: var(--text-secondary); line-height: 1.5; }

        .role-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 12px;
          flex: 1;
        }
        .role-card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 16px;
          display: flex; flex-direction: column; gap: 8px;
          text-align: left; cursor: pointer;
          transition: all 0.25s ease;
          position: relative; overflow: hidden;
        }
        .role-card:hover {
          border-color: var(--role-color);
          background: var(--bg-card-hover);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px var(--role-glow);
        }
        .role-card.selected {
          border-color: var(--role-color);
          background: color-mix(in srgb, var(--role-color) 8%, var(--bg-card));
          box-shadow: 0 0 0 2px var(--role-color), 0 8px 32px var(--role-glow);
        }
        .role-icon-wrap {
          width: 44px; height: 44px;
          background: color-mix(in srgb, var(--role-color) 15%, transparent);
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          border: 1px solid color-mix(in srgb, var(--role-color) 30%, transparent);
        }
        .role-icon { font-size: 1.5rem; }
        .role-card-title { font-size: 0.9375rem; font-weight: 700; color: var(--text-primary); }
        .role-card-desc { font-size: 0.75rem; color: var(--text-muted); line-height: 1.45; }
        .role-powers { display: flex; flex-direction: column; gap: 3px; margin-top: 4px; }
        .role-power-tag { font-size: 0.7rem; color: color-mix(in srgb, var(--role-color) 90%, white); font-weight: 500; }
        .role-selected-check {
          position: absolute; top: 10px; right: 10px;
          width: 22px; height: 22px;
          background: var(--role-color);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.75rem; color: white; font-weight: 700;
          animation: fadeIn 0.2s ease;
        }
        .role-footer { display: flex; flex-direction: column; gap: 10px; }
        .role-note { font-size: 0.75rem; color: var(--text-muted); text-align: center; }
      `}</style>
    </div>
  )
}
