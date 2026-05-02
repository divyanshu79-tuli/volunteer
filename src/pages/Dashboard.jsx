import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import TopBar from '../components/layout/TopBar.jsx'
import BottomNav from '../components/layout/BottomNav.jsx'
import IssueCard from '../components/cards/IssueCard.jsx'
import { useApp } from '../contexts/AppContext.jsx'
import { useAuth } from '../contexts/AuthContext.jsx'
import { generateDashboardSummary } from '../config/gemini.js'
import toast from 'react-hot-toast'

const URGENCY_COLORS = { critical: '#ff3b30', high: '#ff9500', medium: '#ffd60a', low: '#30d158' }
const CATEGORY_COLORS = ['#6366f1','#a78bfa','#38bdf8','#22c55e','#f59e0b','#ef4444','#8b5cf6']

export default function Dashboard() {
  const navigate = useNavigate()
  const { issues, stats, categoryStats, aiSummary, setAiSummary } = useApp()
  const { userProfile, currentRole } = useAuth()
  const [aiLoading, setAiLoading] = useState(false)

  const urgencyData = [
    { name: 'Critical', value: stats.criticalIssues, color: URGENCY_COLORS.critical },
    { name: 'High', value: stats.highIssues, color: URGENCY_COLORS.high },
    { name: 'Medium', value: issues.filter(i => i.urgency === 'medium').length, color: URGENCY_COLORS.medium },
    { name: 'Low', value: issues.filter(i => i.urgency === 'low').length, color: URGENCY_COLORS.low },
  ].filter(d => d.value > 0)

  async function refreshAI() {
    setAiLoading(true)
    try {
      const summary = await generateDashboardSummary(issues)
      setAiSummary(summary)
      toast.success('AI summary refreshed!')
    } catch (err) {
      toast.error('Add Gemini API key to enable AI features')
    } finally {
      setAiLoading(false)
    }
  }

  const sortedIssues = [...issues].sort((a, b) => {
    const order = { critical: 0, high: 1, medium: 2, low: 3 }
    return (order[a.urgency] ?? 4) - (order[b.urgency] ?? 4)
  })

  const firstName = userProfile?.displayName?.split(' ')[0] || 'Friend'
  const roleLabel = { ngo_admin: 'NGO Admin', volunteer: 'Volunteer', field_worker: 'Field Worker', public_viewer: 'Viewer' }[currentRole] || 'User'

  return (
    <div className="app-shell">
      <TopBar title="" />
      <div className="page-content">
        {/* Greeting */}
        <div className="section animate-fadeup">
          <div className="dash-greeting">
            <div>
              <p className="dash-hello">Good morning, {firstName} 👋</p>
              <h2 className="dash-headline">Community Dashboard</h2>
              <span className="chip chip-primary">{roleLabel}</span>
            </div>
            {(currentRole === 'ngo_admin' || currentRole === 'field_worker') && (
              <button
                className="btn btn-primary btn-sm"
                onClick={() => navigate('/upload')}
                id="btn-upload-report"
              >
                + Report
              </button>
            )}
          </div>
        </div>

        {/* Stats Row */}
        <div className="section">
          <div className="stats-grid animate-fadeup delay-1">
            <div className="stat-card">
              <div className="stat-icon">📋</div>
              <div className="stat-value" style={{ color: 'var(--primary)' }}>{stats.totalIssues}</div>
              <div className="stat-label">Total Issues</div>
            </div>
            <div className="stat-card" style={{ borderColor: 'var(--critical-border)' }}>
              <div className="stat-icon">🚨</div>
              <div className="stat-value" style={{ color: 'var(--critical)' }}>{stats.criticalIssues}</div>
              <div className="stat-label">Critical</div>
            </div>
            <div className="stat-card" style={{ borderColor: 'var(--low-border)' }}>
              <div className="stat-icon">🙋</div>
              <div className="stat-value" style={{ color: 'var(--low)' }}>{stats.activeVolunteers}</div>
              <div className="stat-label">Active Volunteers</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">❤️</div>
              <div className="stat-value" style={{ color: '#f472b6' }}>{stats.totalAffected}</div>
              <div className="stat-label">People Helped</div>
            </div>
          </div>
        </div>

        {/* AI Summary */}
        <div className="section animate-fadeup delay-2">
          <div className="ai-insight-block">
            <div className="ai-header-row">
              <div className="ai-label">🤖 Gemini AI Insights</div>
              <button
                className="btn btn-ghost btn-sm"
                onClick={refreshAI}
                disabled={aiLoading}
                id="btn-refresh-ai"
              >
                {aiLoading ? <span className="spinner" style={{ width: 14, height: 14 }} /> : '↻ Refresh'}
              </button>
            </div>
            <p className="ai-text">{aiSummary}</p>
          </div>
        </div>

        {/* Charts */}
        <div className="section animate-fadeup delay-2">
          <div className="section-header">
            <span className="section-title">📊 Needs by Category</span>
          </div>
          <div className="glass-card" style={{ padding: '12px 4px 12px 0' }}>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={categoryStats} margin={{ left: -20, right: 8 }}>
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'rgba(238,240,255,0.4)' }} />
                <YAxis tick={{ fontSize: 10, fill: 'rgba(238,240,255,0.4)' }} />
                <Tooltip
                  contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#eef0ff' }}
                  formatter={(v) => [v, 'Issues']}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {categoryStats.map((_, i) => (
                    <Cell key={i} fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="section animate-fadeup delay-3">
          <div className="section-header">
            <span className="section-title">🎯 Urgency Distribution</span>
          </div>
          <div className="glass-card" style={{ padding: '12px 0' }}>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={urgencyData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {urgencyData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Legend
                  formatter={(v) => <span style={{ color: 'rgba(238,240,255,0.7)', fontSize: 11 }}>{v}</span>}
                />
                <Tooltip
                  contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#eef0ff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Issues List */}
        <div className="section animate-fadeup delay-3">
          <div className="section-header">
            <span className="section-title">⚠️ Priority Issues</span>
            <button className="section-action" onClick={() => navigate('/map')}>View Map →</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {sortedIssues.slice(0, 5).map((issue) => (
              <IssueCard key={issue.id} issue={issue} onClick={() => navigate('/map')} />
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="section animate-fadeup delay-4">
          <div className="section-title mb-3">⚡ Quick Actions</div>
          <div className="quick-actions-grid">
            <button className="quick-action-btn" onClick={() => navigate('/tasks')} id="qa-tasks">
              <span className="qa-icon">✅</span>
              <span>View Tasks</span>
            </button>
            <button className="quick-action-btn" onClick={() => navigate('/matching')} id="qa-match">
              <span className="qa-icon">🤝</span>
              <span>Get Matched</span>
            </button>
            <button className="quick-action-btn" onClick={() => navigate('/map')} id="qa-map">
              <span className="qa-icon">🗺️</span>
              <span>Issue Map</span>
            </button>
            <button className="quick-action-btn" onClick={() => navigate('/notifications')} id="qa-alerts">
              <span className="qa-icon">🔔</span>
              <span>Alerts</span>
            </button>
          </div>
        </div>
      </div>
      <BottomNav />

      <style>{`
        .dash-greeting {
          display: flex; align-items: center; justify-content: space-between; gap: 12px;
        }
        .dash-hello { font-size: 0.875rem; color: var(--text-muted); margin-bottom: 4px; }
        .dash-headline { font-size: 1.4rem; font-weight: 800; margin-bottom: 8px; }
        .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .stat-icon { font-size: 1.25rem; }
        .ai-header-row { display: flex; align-items: center; justify-content: space-between; }
        .quick-actions-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
        .quick-action-btn {
          background: var(--bg-card); border: 1px solid var(--border);
          border-radius: var(--radius-sm); padding: 12px 8px;
          display: flex; flex-direction: column; align-items: center; gap: 6px;
          font-size: 0.72rem; font-weight: 500; color: var(--text-secondary);
          transition: all 0.2s; cursor: pointer;
        }
        .quick-action-btn:hover {
          background: var(--bg-card-hover); border-color: var(--primary); color: var(--primary);
        }
        .qa-icon { font-size: 1.35rem; }
      `}</style>
    </div>
  )
}
