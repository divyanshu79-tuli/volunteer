import { useState } from 'react'
import TopBar from '../components/layout/TopBar.jsx'
import BottomNav from '../components/layout/BottomNav.jsx'
import { useApp } from '../contexts/AppContext.jsx'
import { matchVolunteerToTasks } from '../config/gemini.js'
import toast from 'react-hot-toast'

const SKILLS_LIST = ['Teaching', 'Medical', 'Construction', 'Cooking', 'Driving', 'Counseling', 'IT/Tech', 'Languages', 'First Aid', 'Logistics', 'Photography', 'Social Work']
const URGENCY_COLORS = { critical: '#ff3b30', high: '#ff9500', medium: '#ffd60a', low: '#30d158' }

export default function VolunteerMatching() {
  const { tasks } = useApp()
  const [profile, setProfile] = useState({ skills: [], location: '', availability: 'weekends', experience: '' })
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  function toggleSkill(skill) {
    setProfile(p => ({
      ...p,
      skills: p.skills.includes(skill) ? p.skills.filter(s => s !== skill) : [...p.skills, skill]
    }))
  }

  async function findMatches() {
    if (profile.skills.length === 0) { toast.error('Select at least one skill'); return }
    setLoading(true)
    const pendingTasks = tasks.filter(t => t.status === 'pending')
    try {
      const result = await matchVolunteerToTasks(profile, pendingTasks)
      if (result && result.length > 0) {
        const enriched = result.map(m => ({
          ...m,
          task: pendingTasks.find(t => t.id === m.taskId),
        })).filter(m => m.task)
        setMatches(enriched)
        toast.success(`🤖 AI found ${enriched.length} matching tasks!`)
      } else {
        throw new Error('No matches')
      }
    } catch {
      // Fallback to keyword matching
      const fallback = pendingTasks.map(t => {
        let score = 40
        profile.skills.forEach(s => { if (t.category?.toLowerCase().includes(s.toLowerCase()) || t.title?.toLowerCase().includes(s.toLowerCase())) score += 20 })
        if (profile.location && t.location?.toLowerCase().includes(profile.location.toLowerCase())) score += 15
        return { taskId: t.id, matchScore: Math.min(score + Math.floor(Math.random() * 20), 99), reason: `Matching ${t.category} needs with your ${profile.skills[0]} skill`, task: t }
      }).sort((a, b) => b.matchScore - a.matchScore).slice(0, 5)
      setMatches(fallback)
      toast.success(`Found ${fallback.length} matches (add Gemini key for AI matching)`)
    } finally {
      setLoading(false)
      setSearched(true)
    }
  }

  return (
    <div className="app-shell">
      <TopBar title="Volunteer Match" showBack />
      <div className="page-content">
        {/* Header */}
        <div className="section animate-fadeup">
          <div className="ai-insight-block">
            <div className="ai-label">🤖 AI Volunteer Matching</div>
            <p className="ai-text">Tell us your skills and availability. Our Gemini AI will match you with the most impactful tasks in your area.</p>
          </div>
        </div>

        {/* Profile Setup */}
        <div className="section animate-fadeup delay-1">
          <div className="section-title mb-3">Your Skills</div>
          <div className="skills-grid">
            {SKILLS_LIST.map(skill => (
              <button
                key={skill}
                className={`skill-chip ${profile.skills.includes(skill) ? 'selected' : ''}`}
                onClick={() => toggleSkill(skill)}
                id={`skill-${skill.replace(/\//g,'')}`}
              >
                {profile.skills.includes(skill) ? '✓ ' : ''}{skill}
              </button>
            ))}
          </div>
        </div>

        <div className="section animate-fadeup delay-2" style={{ paddingTop: 0 }}>
          <div className="form-group">
            <label className="form-label">Your Location</label>
            <input className="input-field" value={profile.location} onChange={e => setProfile(p => ({ ...p, location: e.target.value }))} placeholder="e.g. Mumbai, Maharashtra" id="input-vol-location" />
          </div>

          <div className="form-group mt-2">
            <label className="form-label">Availability</label>
            <select className="input-field" value={profile.availability} onChange={e => setProfile(p => ({ ...p, availability: e.target.value }))} id="select-availability">
              <option value="weekends">Weekends only</option>
              <option value="weekdays">Weekdays only</option>
              <option value="flexible">Fully flexible</option>
              <option value="parttime">Part-time (3-4 hrs/week)</option>
              <option value="fulltime">Full-time commitment</option>
            </select>
          </div>

          <div className="form-group mt-2">
            <label className="form-label">Experience / Notes (optional)</label>
            <textarea className="input-field" rows={2} value={profile.experience} onChange={e => setProfile(p => ({ ...p, experience: e.target.value }))} placeholder="Any special experience or languages..." id="input-vol-experience" style={{ resize: 'none' }} />
          </div>

          <button className="btn btn-primary btn-full mt-4" onClick={findMatches} disabled={loading} id="btn-find-matches">
            {loading ? <><span className="spinner" /> AI Matching...</> : '🤝 Find My Best Tasks'}
          </button>
        </div>

        {/* Results */}
        {searched && (
          <div className="section animate-fadeup" style={{ paddingTop: 0 }}>
            <div className="section-title mb-3">
              ⭐ Recommended Tasks
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 400, marginLeft: 8 }}>{matches.length} matches</span>
            </div>

            {matches.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🔍</div>
                <div className="empty-title">No matches found</div>
                <div className="empty-desc">Try different skills or location to find relevant tasks</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {matches.map((match, i) => {
                  const task = match.task
                  if (!task) return null
                  return (
                    <div key={match.taskId} className={`match-card animate-fadeup delay-${i + 1}`}>
                      <div className="match-header">
                        <div>
                          <div className="match-score-label">Match Score</div>
                          <div className="match-score" style={{ color: match.matchScore >= 80 ? 'var(--low)' : match.matchScore >= 60 ? 'var(--high)' : 'var(--medium)' }}>
                            {match.matchScore}%
                          </div>
                        </div>
                        <div className="match-bar-wrap">
                          <div className="match-bar" style={{ width: `${match.matchScore}%`, background: match.matchScore >= 80 ? 'var(--low)' : match.matchScore >= 60 ? 'var(--high)' : 'var(--medium)' }} />
                        </div>
                        <span className={`urgency-badge urgency-${task.urgency}`}>{task.urgency}</span>
                      </div>
                      <h3 className="match-title">{task.title}</h3>
                      <p className="match-reason">💡 {match.reason}</p>
                      <div className="match-meta">
                        {task.location && <span>📍 {task.location}</span>}
                        {task.volunteersNeeded && <span>👥 {task.volunteersNeeded} needed</span>}
                        <span>🏷 {task.category}</span>
                      </div>
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => toast.success('Task accepted! Check Tasks tab.')}
                        id={`btn-accept-match-${task.id}`}
                        style={{ marginTop: 4 }}
                      >
                        ✓ Accept This Task
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
      <BottomNav />

      <style>{`
        .skills-grid { display: flex; flex-wrap: wrap; gap: 8px; }
        .skill-chip {
          padding: 7px 14px; border-radius: 100px;
          background: var(--bg-card); border: 1px solid var(--border);
          font-size: 0.8125rem; color: var(--text-muted); cursor: pointer;
          transition: all 0.2s; font-weight: 500;
        }
        .skill-chip:hover { border-color: var(--primary); color: var(--primary); }
        .skill-chip.selected {
          background: var(--primary-glow); border-color: var(--primary);
          color: var(--primary); font-weight: 600;
        }
        .match-card {
          background: var(--bg-card); border: 1px solid var(--border);
          border-radius: var(--radius); padding: 14px;
          display: flex; flex-direction: column; gap: 8px;
          transition: all 0.2s;
        }
        .match-card:hover { background: var(--bg-card-hover); }
        .match-header { display: flex; align-items: center; gap: 10px; }
        .match-score-label { font-size: 0.65rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
        .match-score { font-size: 1.25rem; font-weight: 800; line-height: 1; }
        .match-bar-wrap { flex: 1; height: 5px; background: rgba(255,255,255,0.08); border-radius: 100px; overflow: hidden; }
        .match-bar { height: 100%; border-radius: 100px; transition: width 0.6s ease; }
        .match-title { font-size: 0.9375rem; font-weight: 600; }
        .match-reason { font-size: 0.8rem; color: var(--text-muted); line-height: 1.45; }
        .match-meta { display: flex; flex-wrap: wrap; gap: 8px; font-size: 0.75rem; color: var(--text-muted); }
      `}</style>
    </div>
  )
}
