import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'
import toast from 'react-hot-toast'

export default function Login() {
  const navigate = useNavigate()
  const { loginWithEmail, registerWithEmail, loginWithGoogle, isDemoMode } = useAuth()
  const [isRegister, setIsRegister] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')

  function onChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      if (isRegister) {
        await registerWithEmail(form.email, form.password, form.name || form.email.split('@')[0])
      } else {
        await loginWithEmail(form.email, form.password)
      }
      navigate('/role-selection', { replace: true })
      toast.success(isRegister ? 'Account created! 🎉' : 'Welcome back! 👋')
    } catch (err) {
      setError(err.message?.replace('Firebase: ', '').replace(/\(auth.*\)/, '').trim() || 'Auth failed')
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    setGoogleLoading(true)
    try {
      await loginWithGoogle()
      navigate('/role-selection', { replace: true })
      toast.success('Signed in with Google! 🚀')
    } catch (err) {
      toast.error('Google sign-in failed')
    } finally {
      setGoogleLoading(false)
    }
  }

  async function handleDemo() {
    setLoading(true)
    try {
      await loginWithEmail('demo@sevalink.ai', 'demo123')
      navigate('/dashboard', { replace: true })
      toast.success('Welcome to Demo Mode! 🎯')
    } catch {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-bg-orb" />
      <div className="login-content">
        {/* Logo */}
        <div className="login-logo animate-fadeup">
          <div className="login-logo-icon">🔗</div>
          <div>
            <h1 className="login-app-name">SevaLink <span className="text-primary-color">AI</span></h1>
            <p className="login-app-sub">Community Needs Intelligence</p>
          </div>
        </div>

        {/* Card */}
        <div className="glass-card login-card animate-fadeup delay-1">
          {isDemoMode && (
            <div className="alert-banner alert-info mb-4">
              <span>ℹ️</span>
              <span>Running in Demo Mode — Firebase not yet configured. <a onClick={handleDemo} style={{ cursor:'pointer', textDecoration:'underline' }}>Quick Demo Login →</a></span>
            </div>
          )}

          <div className="login-toggle">
            <button className={`login-toggle-btn ${!isRegister ? 'active' : ''}`} onClick={() => setIsRegister(false)} id="btn-signin">Sign In</button>
            <button className={`login-toggle-btn ${isRegister ? 'active' : ''}`} onClick={() => setIsRegister(true)} id="btn-signup">Sign Up</button>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {isRegister && (
              <div className="form-group animate-fadeup">
                <label className="form-label">Full Name</label>
                <input
                  id="input-name"
                  className="input-field"
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  placeholder="Your full name"
                  autoComplete="name"
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                id="input-email"
                className="input-field"
                type="email"
                name="email"
                value={form.email}
                onChange={onChange}
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                id="input-password"
                className="input-field"
                type="password"
                name="password"
                value={form.password}
                onChange={onChange}
                placeholder="••••••••"
                required
                minLength={6}
                autoComplete={isRegister ? 'new-password' : 'current-password'}
              />
            </div>

            {error && <div className="form-error alert-banner alert-error">{error}</div>}

            <button
              type="submit"
              className="btn btn-primary btn-full"
              id="btn-submit-auth"
              disabled={loading}
            >
              {loading ? <span className="spinner" /> : isRegister ? '🚀 Create Account' : '→ Sign In'}
            </button>
          </form>

          <div className="divider-text">or continue with</div>

          <button
            className="btn btn-outline btn-full google-btn"
            onClick={handleGoogle}
            id="btn-google"
            disabled={googleLoading}
          >
            {googleLoading ? <span className="spinner" /> : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign in with Google
              </>
            )}
          </button>
        </div>

        <p className="login-footer">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>

      <style>{`
        .login-page {
          min-height: 100dvh;
          background: var(--bg-primary);
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: 24px 20px;
          position: relative; overflow: hidden;
        }
        .login-bg-orb {
          position: absolute; top: -150px; right: -100px;
          width: 500px; height: 500px; border-radius: 50%;
          background: radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%);
          pointer-events: none;
        }
        .login-content {
          width: 100%; max-width: 400px;
          display: flex; flex-direction: column; gap: 24px;
          position: relative; z-index: 1;
        }
        .login-logo {
          display: flex; align-items: center; gap: 12px;
        }
        .login-logo-icon {
          font-size: 2.5rem;
          width: 60px; height: 60px;
          background: linear-gradient(135deg, rgba(99,102,241,0.2), rgba(167,139,250,0.2));
          border: 1px solid rgba(99,102,241,0.3);
          border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
        }
        .login-app-name { font-size: 1.75rem; font-weight: 900; }
        .login-app-sub { font-size: 0.8125rem; color: var(--text-muted); margin-top: 2px; }
        .login-card { padding: 24px; display: flex; flex-direction: column; gap: 16px; }
        .login-toggle {
          display: grid; grid-template-columns: 1fr 1fr;
          background: var(--bg-input); border-radius: var(--radius-sm);
          padding: 3px; gap: 3px;
        }
        .login-toggle-btn {
          padding: 10px; border-radius: 8px;
          font-size: 0.9rem; font-weight: 600;
          color: var(--text-muted);
          transition: all 0.2s; cursor: pointer;
        }
        .login-toggle-btn.active {
          background: var(--primary-dark); color: white;
          box-shadow: 0 2px 8px var(--primary-glow);
        }
        .login-form { display: flex; flex-direction: column; gap: 12px; }
        .google-btn { display: flex; align-items: center; gap: 10px; }
        .login-footer {
          font-size: 0.75rem; color: var(--text-muted);
          text-align: center; line-height: 1.5; max-width: 280px; margin: 0 auto;
        }
      `}</style>
    </div>
  )
}
