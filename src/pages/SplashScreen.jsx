import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'

export default function SplashScreen() {
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(user ? '/dashboard' : '/login', { replace: true })
    }, 2800)
    return () => clearTimeout(timer)
  }, [user, navigate])

  return (
    <div className="splash">
      {/* Animated background rings */}
      <div className="splash-ring r1" />
      <div className="splash-ring r2" />
      <div className="splash-ring r3" />

      <div className="splash-content">
        <div className="splash-logo-wrap">
          <div className="splash-logo">
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
              <circle cx="28" cy="28" r="28" fill="rgba(99,102,241,0.15)" />
              <circle cx="20" cy="20" r="6" fill="#818cf8" opacity="0.9" />
              <circle cx="36" cy="20" r="6" fill="#a78bfa" opacity="0.9" />
              <circle cx="28" cy="36" r="6" fill="#6366f1" opacity="0.9" />
              <line x1="20" y1="20" x2="36" y2="20" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
              <line x1="20" y1="20" x2="28" y2="36" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
              <line x1="36" y1="20" x2="28" y2="36" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
            </svg>
          </div>
        </div>

        <h1 className="splash-title">
          Seva<span className="splash-title-accent">Link</span> AI
        </h1>
        <p className="splash-tagline">Community Needs Intelligence Platform</p>

        <div className="splash-badges">
          <span className="splash-badge">🤖 AI-Powered</span>
          <span className="splash-badge">🌍 Social Impact</span>
          <span className="splash-badge">🔗 Connected</span>
        </div>

        <div className="splash-progress">
          <div className="splash-bar" />
        </div>
        <p className="splash-loading">Initializing platform...</p>
      </div>

      <div className="splash-footer">
        <p>Powered by Google Gemini AI</p>
        <div className="splash-footer-dots">
          <span />
          <span />
          <span />
        </div>
      </div>

      <style>{`
        .splash {
          min-height: 100dvh;
          background: radial-gradient(ellipse at 30% 20%, rgba(99,102,241,0.2) 0%, transparent 50%),
                      radial-gradient(ellipse at 70% 80%, rgba(167,139,250,0.15) 0%, transparent 50%),
                      var(--bg-primary);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }
        .splash-ring {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(99,102,241,0.15);
          animation: ring-expand 3s ease-out infinite;
        }
        .r1 { width: 200px; height: 200px; animation-delay: 0s; }
        .r2 { width: 400px; height: 400px; animation-delay: 0.5s; }
        .r3 { width: 600px; height: 600px; animation-delay: 1s; }
        @keyframes ring-expand {
          0% { opacity: 0.6; transform: scale(0.8); }
          100% { opacity: 0; transform: scale(1.2); }
        }
        .splash-content {
          display: flex; flex-direction: column; align-items: center;
          gap: 16px; z-index: 1; padding: 0 32px; text-align: center;
          animation: fadeIn 0.8s ease;
        }
        .splash-logo-wrap {
          animation: float 3s ease-in-out infinite, glow-pulse 2s ease infinite;
        }
        .splash-logo {
          width: 96px; height: 96px;
          background: linear-gradient(135deg, rgba(99,102,241,0.2), rgba(167,139,250,0.2));
          border-radius: 28px;
          border: 1px solid rgba(99,102,241,0.3);
          display: flex; align-items: center; justify-content: center;
        }
        .splash-title {
          font-size: 2.5rem; font-weight: 900;
          color: var(--text-primary); line-height: 1;
          letter-spacing: -0.02em;
        }
        .splash-title-accent {
          background: linear-gradient(135deg, #818cf8, #a78bfa);
          -webkit-background-clip: text; background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .splash-tagline {
          font-size: 0.9375rem; color: var(--text-secondary); font-weight: 400;
          max-width: 260px; line-height: 1.5;
        }
        .splash-badges {
          display: flex; gap: 8px; flex-wrap: wrap; justify-content: center;
          margin-top: 8px;
        }
        .splash-badge {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 100px;
          padding: 5px 12px;
          font-size: 0.75rem; font-weight: 500;
          color: var(--text-secondary);
        }
        .splash-progress {
          width: 200px; height: 3px;
          background: rgba(255,255,255,0.08);
          border-radius: 100px; overflow: hidden;
          margin-top: 24px;
        }
        .splash-bar {
          height: 100%;
          background: linear-gradient(90deg, #6366f1, #a78bfa);
          border-radius: 100px;
          animation: progress-fill 2.5s ease forwards;
        }
        @keyframes progress-fill {
          from { width: 0%; }
          to { width: 100%; }
        }
        .splash-loading {
          font-size: 0.8125rem; color: var(--text-muted);
          animation: dots 1.5s infinite;
        }
        @keyframes dots {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        .splash-footer {
          position: absolute; bottom: 32px;
          display: flex; flex-direction: column; align-items: center; gap: 8px;
          color: var(--text-muted); font-size: 0.75rem;
        }
        .splash-footer-dots { display: flex; gap: 5px; }
        .splash-footer-dots span {
          width: 5px; height: 5px; border-radius: 50%;
          background: var(--primary); opacity: 0.4;
          animation: bounce-dot 1.2s infinite;
        }
        .splash-footer-dots span:nth-child(2) { animation-delay: 0.2s; }
        .splash-footer-dots span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes bounce-dot {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.4); }
        }
      `}</style>
    </div>
  )
}
