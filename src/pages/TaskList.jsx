import { useState } from 'react'
import TopBar from '../components/layout/TopBar.jsx'
import BottomNav from '../components/layout/BottomNav.jsx'
import TaskCard from '../components/cards/TaskCard.jsx'
import { useApp } from '../contexts/AppContext.jsx'
import { useAuth } from '../contexts/AuthContext.jsx'
import toast from 'react-hot-toast'

const FILTERS = ['all', 'pending', 'in-progress', 'completed']

export default function TaskList() {
  const { tasks, updateTaskStatus, stats } = useApp()
  const { currentRole } = useAuth()
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all' ? tasks : tasks.filter(t => t.status === filter)

  function handleAccept(task) {
    updateTaskStatus(task.id, 'in-progress')
    toast.success(`✅ You accepted: "${task.title}"`)
  }

  function handleReject(task) {
    toast('Task declined', { icon: '↩️' })
  }

  function handleComplete(task) {
    updateTaskStatus(task.id, 'completed')
    toast.success('🎉 Task marked as completed! Great work!')
  }

  const counts = {
    all: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    'in-progress': tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  }

  return (
    <div className="app-shell">
      <TopBar title="Tasks" />
      <div className="page-content">
        {/* Stats Row */}
        <div className="section animate-fadeup">
          <div className="task-stats-row">
            <div className="task-stat-mini">
              <span className="tsm-val" style={{ color: 'var(--medium)' }}>{stats.pendingTasks}</span>
              <span className="tsm-label">Pending</span>
            </div>
            <div className="task-stat-mini">
              <span className="tsm-val" style={{ color: 'var(--primary)' }}>{tasks.filter(t=>t.status==='in-progress').length}</span>
              <span className="tsm-label">In Progress</span>
            </div>
            <div className="task-stat-mini">
              <span className="tsm-val" style={{ color: 'var(--low)' }}>{stats.completedTasks}</span>
              <span className="tsm-label">Completed</span>
            </div>
            <div className="task-stat-mini">
              <span className="tsm-val" style={{ color: 'var(--text-secondary)' }}>{tasks.length}</span>
              <span className="tsm-label">Total</span>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="section animate-fadeup delay-1" style={{ paddingTop: 0 }}>
          <div className="tab-row">
            {FILTERS.map(f => (
              <button
                key={f}
                className={`tab-btn ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
                id={`task-filter-${f}`}
              >
                {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1).replace('-', ' ')}
                <span className="tab-count">{counts[f]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Task List */}
        <div className="section animate-fadeup delay-2" style={{ paddingTop: 0 }}>
          {filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <div className="empty-title">No {filter === 'all' ? '' : filter} tasks</div>
              <div className="empty-desc">All caught up! Check back later for new tasks.</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {filtered.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onAccept={currentRole === 'volunteer' || currentRole === 'field_worker' ? handleAccept : undefined}
                  onReject={currentRole === 'volunteer' || currentRole === 'field_worker' ? handleReject : undefined}
                  onComplete={task.status === 'in-progress' ? handleComplete : undefined}
                  showActions={true}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      <BottomNav />

      <style>{`
        .task-stats-row {
          display: grid; grid-template-columns: repeat(4, 1fr);
          gap: 8px;
        }
        .task-stat-mini {
          background: var(--bg-card); border: 1px solid var(--border);
          border-radius: var(--radius-sm); padding: 12px 8px;
          display: flex; flex-direction: column; align-items: center; gap: 3px;
        }
        .tsm-val { font-size: 1.5rem; font-weight: 800; line-height: 1; }
        .tsm-label { font-size: 0.65rem; color: var(--text-muted); font-weight: 500; text-align: center; }
        .tab-count {
          display: inline-flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,0.1); border-radius: 100px;
          padding: 1px 6px; font-size: 0.65rem; min-width: 18px;
          margin-left: 4px;
        }
      `}</style>
    </div>
  )
}
