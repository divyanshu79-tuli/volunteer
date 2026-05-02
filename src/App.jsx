import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx'
import { AppProvider } from './contexts/AppContext.jsx'
import TopBar from './components/layout/TopBar.jsx'
import BottomNav from './components/layout/BottomNav.jsx'
import SplashScreen from './pages/SplashScreen.jsx'
import Login from './pages/Login.jsx'
import RoleSelection from './pages/RoleSelection.jsx'
import Dashboard from './pages/Dashboard.jsx'
import UploadData from './pages/UploadData.jsx'
import MapView from './pages/MapView.jsx'
import TaskList from './pages/TaskList.jsx'
import VolunteerMatching from './pages/VolunteerMatching.jsx'
import Notifications from './pages/Notifications.jsx'
import Profile from './pages/Profile.jsx'

const HIDDEN_NAV_PATHS = ['/', '/login', '/role-selection']

function ProtectedRoute({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return children
}

function AppShell() {
  const { user, loading } = useAuth()
  const path = window.location.pathname
  const showNav = user && !HIDDEN_NAV_PATHS.includes(path)

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100dvh' }}>
        <div className="spinner spinner-lg" />
      </div>
    )
  }

  return (
    <div className="app-shell">
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#1a1a2e',
            color: '#eef0ff',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            fontSize: '0.875rem',
          },
        }}
      />
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/login" element={<Login />} />
        <Route path="/role-selection" element={<RoleSelection />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/upload" element={<ProtectedRoute><UploadData /></ProtectedRoute>} />
        <Route path="/map" element={<ProtectedRoute><MapView /></ProtectedRoute>} />
        <Route path="/tasks" element={<ProtectedRoute><TaskList /></ProtectedRoute>} />
        <Route path="/matching" element={<ProtectedRoute><VolunteerMatching /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <BrowserRouter>
          <AppShell />
        </BrowserRouter>
      </AppProvider>
    </AuthProvider>
  )
}
