import { createContext, useContext, useState, useEffect } from 'react'

const AppContext = createContext(null)

// ─── Rich Mock Data ────────────────────────────────────────────────────────────
const MOCK_ISSUES = [
  {
    id: 'issue-1',
    title: '15 families lack clean water access',
    description: 'Residents of Block C have had no access to clean drinking water for 18 days. Municipal supply cut due to pipe damage.',
    category: 'Water',
    urgency: 'critical',
    location: { lat: 19.0368, lng: 72.8549, area: 'Dharavi, Mumbai' },
    created_by: 'Priya Sharma',
    timestamp: new Date(Date.now() - 2 * 86400000),
    status: 'open',
    peopleAffected: 75,
    aiSummary: '15 families (75 people) urgently need clean drinking water in Dharavi Block C — supply cut for 18 days.',
    tags: ['water', 'urgent', 'drinking'],
  },
  {
    id: 'issue-2',
    title: 'Flood damage displaces 200+ residents',
    description: 'Heavy rains caused flooding across 3 villages. Over 200 residents displaced. Immediate food, shelter, and medical aid needed.',
    category: 'Disaster',
    urgency: 'critical',
    location: { lat: 22.5726, lng: 88.3639, area: 'Kolkata Eastern Suburbs' },
    created_by: 'Relief Field Worker',
    timestamp: new Date(Date.now() - 1 * 86400000),
    status: 'open',
    peopleAffected: 230,
    aiSummary: '230+ residents displaced by flooding in Kolkata suburbs. Need immediate shelter, food, and medical care.',
    tags: ['flood', 'shelter', 'disaster', 'food'],
  },
  {
    id: 'issue-3',
    title: 'Primary school without teachers for 2 months',
    description: 'Government school in rural area has been without teachers since September. 120 children are missing education.',
    category: 'Education',
    urgency: 'high',
    location: { lat: 28.5355, lng: 77.3910, area: 'Outer Delhi Rural' },
    created_by: 'Community Leader',
    timestamp: new Date(Date.now() - 5 * 86400000),
    status: 'in-progress',
    peopleAffected: 120,
    aiSummary: '120 children have missed 2 months of education in rural Delhi. Volunteer teachers needed urgently.',
    tags: ['education', 'children', 'teachers'],
  },
  {
    id: 'issue-4',
    title: 'Malnutrition among elderly residents',
    description: 'Survey shows 40% of elderly residents in old city slum areas are suffering from malnutrition. Regular nutrition support needed.',
    category: 'Health',
    urgency: 'high',
    location: { lat: 17.3616, lng: 78.4747, area: 'Hyderabad Old City' },
    created_by: 'Health NGO Workers',
    timestamp: new Date(Date.now() - 3 * 86400000),
    status: 'open',
    peopleAffected: 85,
    aiSummary: '85+ elderly people suffering from malnutrition in Hyderabad slums need regular nutritional support.',
    tags: ['health', 'elderly', 'malnutrition'],
  },
  {
    id: 'issue-5',
    title: 'Women need safe sanitation facilities',
    description: 'Women in 5 localities around Bangalore outskirts lack access to safe public toilets, creating health and safety risks.',
    category: 'Sanitation',
    urgency: 'medium',
    location: { lat: 12.9716, lng: 77.5946, area: 'Bangalore Outskirts' },
    created_by: 'Women Welfare NGO',
    timestamp: new Date(Date.now() - 7 * 86400000),
    status: 'open',
    peopleAffected: 300,
    aiSummary: '300 women in Bangalore outskirts need access to safe sanitation facilities across 5 localities.',
    tags: ['sanitation', 'women', 'health'],
  },
  {
    id: 'issue-6',
    title: 'Skill training needed for unemployed youth',
    description: 'Local youth in Chennai north lack employable vocational skills. A training program could help 50+ find employment.',
    category: 'Education',
    urgency: 'low',
    location: { lat: 13.1067, lng: 80.1989, area: 'Chennai North' },
    created_by: 'Youth Empowerment NGO',
    timestamp: new Date(Date.now() - 10 * 86400000),
    status: 'open',
    peopleAffected: 50,
    aiSummary: '50+ unemployed youth in Chennai North community need vocational skill training program.',
    tags: ['employment', 'youth', 'skills'],
  },
]

const MOCK_TASKS = [
  {
    id: 'task-1',
    title: 'Water distribution drive in Dharavi',
    description: 'Organize and distribute 20L water cans to 15 affected families in Block C, Dharavi.',
    issueId: 'issue-1',
    category: 'Water',
    urgency: 'critical',
    assignedTo: null,
    status: 'pending',
    created_by: 'NGO Admin',
    deadline: new Date(Date.now() + 1 * 86400000),
    timestamp: new Date(Date.now() - 1 * 86400000),
    location: 'Dharavi, Mumbai',
    volunteersNeeded: 3,
  },
  {
    id: 'task-2',
    title: 'Flood relief camp setup',
    description: 'Help set up emergency relief camp for 230+ displaced residents — tents, food distribution, first aid.',
    issueId: 'issue-2',
    category: 'Disaster',
    urgency: 'critical',
    assignedTo: null,
    status: 'pending',
    created_by: 'Relief NGO',
    deadline: new Date(Date.now() + 0.5 * 86400000),
    timestamp: new Date(Date.now() - 0.5 * 86400000),
    location: 'Kolkata Eastern Suburbs',
    volunteersNeeded: 10,
  },
  {
    id: 'task-3',
    title: 'Teach primary classes for 2 weeks',
    description: 'Volunteer teacher needed for grades 1-5. Mon-Fri, 9am-1pm. Transport will be arranged.',
    issueId: 'issue-3',
    category: 'Education',
    urgency: 'high',
    assignedTo: 'vol-user-123',
    status: 'in-progress',
    created_by: 'Education NGO',
    deadline: new Date(Date.now() + 14 * 86400000),
    timestamp: new Date(Date.now() - 2 * 86400000),
    location: 'Outer Delhi Rural',
    volunteersNeeded: 2,
  },
  {
    id: 'task-4',
    title: 'Nutrition survey and meal delivery',
    description: 'Conduct door-to-door nutritional assessment and assist in weekly meal delivery for elderly residents.',
    issueId: 'issue-4',
    category: 'Health',
    urgency: 'high',
    assignedTo: null,
    status: 'pending',
    created_by: 'Health NGO',
    deadline: new Date(Date.now() + 3 * 86400000),
    timestamp: new Date(Date.now() - 1 * 86400000),
    location: 'Hyderabad Old City',
    volunteersNeeded: 4,
  },
  {
    id: 'task-5',
    title: 'Sanitation awareness drive',
    description: 'Lead awareness workshops on sanitation, hygiene, and advocate for facility construction.',
    issueId: 'issue-5',
    category: 'Sanitation',
    urgency: 'medium',
    assignedTo: null,
    status: 'pending',
    created_by: 'Women Welfare NGO',
    deadline: new Date(Date.now() + 7 * 86400000),
    timestamp: new Date(Date.now() - 3 * 86400000),
    location: 'Bangalore Outskirts',
    volunteersNeeded: 2,
  },
  {
    id: 'task-6',
    title: 'Completed: Medical camp in Pune',
    description: 'Free health check-up camp for 500 residents. Medicines and diagnosis provided.',
    issueId: null,
    category: 'Health',
    urgency: 'low',
    assignedTo: 'vol-user-456',
    status: 'completed',
    created_by: 'Medical NGO',
    deadline: new Date(Date.now() - 2 * 86400000),
    timestamp: new Date(Date.now() - 10 * 86400000),
    location: 'Pune',
    volunteersNeeded: 5,
  },
]

const MOCK_NOTIFICATIONS = [
  {
    id: 'notif-1',
    type: 'critical',
    title: '🚨 Critical: Flood relief needed NOW',
    message: '230+ people displaced by flooding in Kolkata. All available volunteers needed immediately.',
    timestamp: new Date(Date.now() - 30 * 60000),
    read: false,
    taskId: 'task-2',
  },
  {
    id: 'notif-2',
    type: 'assignment',
    title: '✅ Task Assigned to You',
    message: 'You have been assigned to "Teach primary classes for 2 weeks" in Outer Delhi Rural.',
    timestamp: new Date(Date.now() - 2 * 3600000),
    read: false,
    taskId: 'task-3',
  },
  {
    id: 'notif-3',
    type: 'ai',
    title: '🤖 AI Detected Critical Issue',
    message: 'Gemini AI analyzed a new report: 15 families need urgent water supply in Dharavi.',
    timestamp: new Date(Date.now() - 5 * 3600000),
    read: true,
    issueId: 'issue-1',
  },
  {
    id: 'notif-4',
    type: 'info',
    title: '📊 Weekly Impact Report Ready',
    message: 'Your team helped 415 people this week. View your dashboard for the full report.',
    timestamp: new Date(Date.now() - 1 * 86400000),
    read: true,
  },
  {
    id: 'notif-5',
    type: 'success',
    title: '🎉 Task Completed',
    message: 'Medical camp in Pune successfully completed — 500 residents served!',
    timestamp: new Date(Date.now() - 2 * 86400000),
    read: true,
    taskId: 'task-6',
  },
]

// ─── Context ──────────────────────────────────────────────────────────────────
export function AppProvider({ children }) {
  const [issues, setIssues] = useState(MOCK_ISSUES)
  const [tasks, setTasks] = useState(MOCK_TASKS)
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS)
  const [aiSummary, setAiSummary] = useState(
    'There are 2 critical issues across Mumbai and Kolkata requiring immediate attention. 860+ community members across 6 active issues need support. Volunteer response is needed urgently for water distribution and flood relief.'
  )

  const unreadCount = notifications.filter(n => !n.read).length

  function addIssue(issue) {
    const newIssue = { ...issue, id: `issue-${Date.now()}`, timestamp: new Date(), status: 'open' }
    setIssues(prev => [newIssue, ...prev])
    // Add notification
    setNotifications(prev => [{
      id: `notif-${Date.now()}`,
      type: issue.urgency === 'critical' ? 'critical' : 'ai',
      title: issue.urgency === 'critical' ? '🚨 Critical Issue Reported' : '📌 New Issue Added',
      message: issue.aiSummary || issue.title,
      timestamp: new Date(),
      read: false,
      issueId: newIssue.id,
    }, ...prev])
  }

  function addTask(task) {
    setTasks(prev => [{ ...task, id: `task-${Date.now()}`, timestamp: new Date() }, ...prev])
  }

  function updateTaskStatus(taskId, status) {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status } : t))
  }

  function markNotificationRead(id) {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  function markAllRead() {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const stats = {
    totalIssues: issues.length,
    criticalIssues: issues.filter(i => i.urgency === 'critical').length,
    highIssues: issues.filter(i => i.urgency === 'high').length,
    activeVolunteers: 24,
    totalAffected: issues.reduce((s, i) => s + (i.peopleAffected || 0), 0),
    completedTasks: tasks.filter(t => t.status === 'completed').length,
    pendingTasks: tasks.filter(t => t.status === 'pending').length,
  }

  const categoryStats = ['Water', 'Disaster', 'Education', 'Health', 'Sanitation', 'Employment', 'Other'].map(cat => ({
    name: cat,
    count: issues.filter(i => i.category === cat).length,
    affected: issues.filter(i => i.category === cat).reduce((s, i) => s + (i.peopleAffected || 0), 0),
  })).filter(c => c.count > 0)

  const value = {
    issues, tasks, notifications, aiSummary, stats, categoryStats,
    unreadCount, setAiSummary,
    addIssue, addTask, updateTaskStatus,
    markNotificationRead, markAllRead,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}
