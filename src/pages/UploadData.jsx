import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import TopBar from '../components/layout/TopBar.jsx'
import BottomNav from '../components/layout/BottomNav.jsx'
import { useApp } from '../contexts/AppContext.jsx'
import { useAuth } from '../contexts/AuthContext.jsx'
import { analyzeReport } from '../config/gemini.js'
import toast from 'react-hot-toast'

const CATEGORIES = ['Water', 'Disaster', 'Education', 'Health', 'Sanitation', 'Employment', 'Other']
const URGENCIES = ['low', 'medium', 'high', 'critical']

export default function UploadData() {
  const navigate = useNavigate()
  const { addIssue } = useApp()
  const { user } = useAuth()
  const [form, setForm] = useState({ title: '', description: '', category: '', urgency: 'medium', location: '', peopleAffected: '' })
  const [aiAnalysis, setAiAnalysis] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [recording, setRecording] = useState(false)
  const [transcript, setTranscript] = useState('')
  const mediaRef = useRef(null)
  const recognitionRef = useRef(null)

  function onChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function analyzeWithAI() {
    const text = form.description || transcript
    if (!text.trim()) { toast.error('Add a description first'); return }
    setAnalyzing(true)
    try {
      const result = await analyzeReport(text)
      setAiAnalysis(result)
      setForm(f => ({
        ...f,
        category: result.category ? result.category.charAt(0).toUpperCase() + result.category.slice(1) : f.category,
        urgency: result.urgency || f.urgency,
        location: result.location !== 'Unknown' ? result.location : f.location,
        peopleAffected: result.peopleAffected || f.peopleAffected,
      }))
      toast.success('🤖 AI analysis complete!')
    } catch (err) {
      toast.error('AI analysis failed — add Gemini API key in .env')
    } finally {
      setAnalyzing(false)
    }
  }

  function startVoice() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) { toast.error('Voice recognition not supported in this browser'); return }
    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-IN'
    recognition.onresult = (e) => {
      const text = Array.from(e.results).map(r => r[0].transcript).join(' ')
      setTranscript(text)
      setForm(f => ({ ...f, description: text }))
    }
    recognition.onerror = () => { setRecording(false); toast.error('Voice recording stopped') }
    recognition.onend = () => setRecording(false)
    recognition.start()
    recognitionRef.current = recognition
    setRecording(true)
    toast.success('🎙️ Listening... speak now')
  }

  function stopVoice() {
    recognitionRef.current?.stop()
    setRecording(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.title || !form.description) { toast.error('Title and description are required'); return }
    setSubmitting(true)
    try {
      const issue = {
        title: form.title,
        description: form.description,
        category: form.category || 'Other',
        urgency: form.urgency,
        location: { lat: 20.5937, lng: 78.9629, area: form.location || 'India' },
        created_by: user?.displayName || user?.email || 'Anonymous',
        peopleAffected: parseInt(form.peopleAffected) || 0,
        aiSummary: aiAnalysis?.summary || '',
        tags: aiAnalysis?.tags || [],
      }
      addIssue(issue)
      toast.success('✅ Report submitted successfully!')
      navigate('/dashboard')
    } catch (err) {
      toast.error('Failed to submit report')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="app-shell">
      <TopBar title="Report Issue" showBack />
      <div className="page-content">
        <div className="section animate-fadeup">
          <p className="text-secondary text-sm mb-4">Submit a community need report. Our AI will analyze and categorize it automatically.</p>

          {/* AI Analysis Result */}
          {aiAnalysis && (
            <div className="ai-result animate-fadeup mb-4">
              <div className="ai-label">🤖 AI Analysis Results</div>
              <div className="ai-result-grid">
                <div className="ai-result-item">
                  <span className="ai-result-label">Category</span>
                  <span className="ai-result-val">{aiAnalysis.category}</span>
                </div>
                <div className="ai-result-item">
                  <span className="ai-result-label">Urgency</span>
                  <span className={`urgency-badge urgency-${aiAnalysis.urgency}`}>{aiAnalysis.urgency}</span>
                </div>
                <div className="ai-result-item">
                  <span className="ai-result-label">Location</span>
                  <span className="ai-result-val">{aiAnalysis.location}</span>
                </div>
                <div className="ai-result-item">
                  <span className="ai-result-label">Affected</span>
                  <span className="ai-result-val">{aiAnalysis.peopleAffected || 'Unknown'}</span>
                </div>
              </div>
              {aiAnalysis.summary && <p className="ai-text mt-2" style={{ fontSize: '0.8rem' }}>{aiAnalysis.summary}</p>}
            </div>
          )}

          <form onSubmit={handleSubmit} className="upload-form">
            {/* Voice Recording */}
            <div className="voice-section">
              <p className="form-label">🎙️ Voice Report</p>
              <button
                type="button"
                className={`voice-btn ${recording ? 'recording' : ''}`}
                onClick={recording ? stopVoice : startVoice}
                id="btn-voice-record"
              >
                {recording ? (
                  <><span className="voice-pulse" />Stop Recording</>
                ) : (
                  <><span>🎤</span> Start Voice Recording</>
                )}
              </button>
              {transcript && (
                <p className="voice-transcript">"{transcript.slice(0, 200)}{transcript.length > 200 ? '...' : ''}"</p>
              )}
            </div>

            <div className="divider" />

            <div className="form-group">
              <label className="form-label">Issue Title *</label>
              <input id="input-title" className="input-field" name="title" value={form.title} onChange={onChange} placeholder="Brief title for the issue" required />
            </div>

            <div className="form-group">
              <label className="form-label">Description *</label>
              <textarea
                id="input-desc"
                className="input-field"
                name="description"
                value={form.description}
                onChange={onChange}
                placeholder="Describe the community need in detail..."
                rows={4}
                required
                style={{ resize: 'vertical', minHeight: 100 }}
              />
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={analyzeWithAI}
                disabled={analyzing}
                id="btn-ai-analyze"
                style={{ alignSelf: 'flex-end', marginTop: -4 }}
              >
                {analyzing ? <><span className="spinner" style={{ width: 14, height: 14 }} /> Analyzing...</> : '🤖 Analyze with AI'}
              </button>
            </div>

            <div className="form-row">
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Category</label>
                <select id="select-category" className="input-field" name="category" value={form.category} onChange={onChange}>
                  <option value="">Auto-detect</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Urgency</label>
                <select id="select-urgency" className="input-field" name="urgency" value={form.urgency} onChange={onChange}>
                  {URGENCIES.map(u => <option key={u} value={u}>{u.charAt(0).toUpperCase() + u.slice(1)}</option>)}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Location / Area</label>
              <input id="input-location" className="input-field" name="location" value={form.location} onChange={onChange} placeholder="e.g. Dharavi, Mumbai" />
            </div>

            <div className="form-group">
              <label className="form-label">People Affected (estimated)</label>
              <input id="input-affected" className="input-field" type="number" name="peopleAffected" value={form.peopleAffected} onChange={onChange} placeholder="0" min="0" />
            </div>

            <button type="submit" className="btn btn-primary btn-full" disabled={submitting} id="btn-submit-report">
              {submitting ? <span className="spinner" /> : '📤 Submit Report'}
            </button>
          </form>
        </div>
      </div>
      <BottomNav />

      <style>{`
        .upload-form { display: flex; flex-direction: column; gap: 14px; }
        .form-row { display: flex; gap: 10px; }
        .voice-section { display: flex; flex-direction: column; gap: 8px; }
        .voice-btn {
          display: flex; align-items: center; gap: 8px;
          padding: 12px 16px; border-radius: var(--radius-sm);
          background: var(--bg-input); border: 1px solid var(--border);
          color: var(--text-primary); font-size: 0.875rem; font-weight: 500;
          cursor: pointer; transition: all 0.2s;
        }
        .voice-btn:hover { border-color: var(--primary); }
        .voice-btn.recording {
          border-color: var(--critical); background: var(--critical-bg);
          color: var(--critical);
          animation: pulse-glow 1.5s infinite;
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 0 0 var(--critical-border); }
          50% { box-shadow: 0 0 0 6px transparent; }
        }
        .voice-pulse {
          width: 10px; height: 10px; border-radius: 50%;
          background: var(--critical);
          animation: pulse-dot 1s infinite;
        }
        .voice-transcript {
          font-size: 0.8125rem; color: var(--text-muted);
          font-style: italic; line-height: 1.5;
          padding: 8px 12px; background: var(--bg-input); border-radius: 8px;
        }
        .ai-result {
          background: linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.08));
          border: 1px solid rgba(99,102,241,0.25); border-radius: var(--radius);
          padding: 14px; display: flex; flex-direction: column; gap: 10px;
        }
        .ai-result-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        .ai-result-item { display: flex; flex-direction: column; gap: 2px; }
        .ai-result-label { font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
        .ai-result-val { font-size: 0.875rem; color: var(--text-primary); font-weight: 500; }
      `}</style>
    </div>
  )
}
