import { useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet'
import { divIcon } from 'leaflet'
import TopBar from '../components/layout/TopBar.jsx'
import BottomNav from '../components/layout/BottomNav.jsx'
import { useApp } from '../contexts/AppContext.jsx'

const URGENCY_COLORS = { critical: '#ff3b30', high: '#ff9500', medium: '#ffd60a', low: '#30d158' }
const URGENCY_RADIUS = { critical: 28, high: 22, medium: 16, low: 12 }

function createCustomIcon(urgency) {
  const color = URGENCY_COLORS[urgency] || '#6366f1'
  const emoji = { critical: '🚨', high: '⚠️', medium: '🔶', low: '🟢' }[urgency] || '📍'
  return divIcon({
    html: `<div style="
      background:${color}22;border:2px solid ${color};
      border-radius:50%;width:36px;height:36px;
      display:flex;align-items:center;justify-content:center;
      font-size:16px;box-shadow:0 0 12px ${color}66;
      animation:pulse-dot 2s infinite;
    ">${emoji}</div>`,
    className: '',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  })
}

export default function MapView() {
  const { issues } = useApp()
  const [filter, setFilter] = useState('all')
  const [selectedIssue, setSelectedIssue] = useState(null)

  const filtered = filter === 'all' ? issues : issues.filter(i => i.urgency === filter)

  return (
    <div className="app-shell">
      <TopBar title="Issue Map" />
      <div style={{ paddingTop: 'var(--topbar-height)', paddingBottom: 'var(--nav-height)', height: '100dvh', display: 'flex', flexDirection: 'column' }}>

        {/* Filter tabs */}
        <div className="map-filters">
          {['all', 'critical', 'high', 'medium', 'low'].map(f => (
            <button
              key={f}
              className={`tab-btn ${filter === f ? 'active' : ''}`}
              style={filter === f && f !== 'all' ? { background: `${URGENCY_COLORS[f]}33`, borderColor: URGENCY_COLORS[f], color: URGENCY_COLORS[f] } : {}}
              onClick={() => setFilter(f)}
              id={`map-filter-${f}`}
            >
              {f === 'all' ? '🗺 All' : `${f.charAt(0).toUpperCase() + f.slice(1)}`}
            </button>
          ))}
        </div>

        {/* Map */}
        <div style={{ flex: 1, position: 'relative' }}>
          <MapContainer
            center={[20.5937, 78.9629]}
            zoom={5}
            style={{ height: '100%', width: '100%' }}
            zoomControl={true}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="© OpenStreetMap"
            />

            {/* Heatmap circles */}
            {filtered.map(issue => (
              <CircleMarker
                key={`heat-${issue.id}`}
                center={[issue.location.lat, issue.location.lng]}
                radius={URGENCY_RADIUS[issue.urgency]}
                pathOptions={{
                  fillColor: URGENCY_COLORS[issue.urgency],
                  fillOpacity: 0.15,
                  color: URGENCY_COLORS[issue.urgency],
                  weight: 0,
                }}
              />
            ))}

            {/* Markers */}
            {filtered.map(issue => (
              <Marker
                key={issue.id}
                position={[issue.location.lat, issue.location.lng]}
                icon={createCustomIcon(issue.urgency)}
                eventHandlers={{ click: () => setSelectedIssue(issue) }}
              >
                <Popup>
                  <div style={{ minWidth: 200, color: '#eef0ff', fontFamily: 'Inter, sans-serif' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                      <span style={{ fontSize: 10, background: `${URGENCY_COLORS[issue.urgency]}22`, color: URGENCY_COLORS[issue.urgency], padding: '2px 8px', borderRadius: 100, fontWeight: 700, textTransform: 'uppercase', border: `1px solid ${URGENCY_COLORS[issue.urgency]}44` }}>
                        {issue.urgency}
                      </span>
                      <span style={{ fontSize: 10, color: 'rgba(238,240,255,0.5)' }}>{issue.category}</span>
                    </div>
                    <p style={{ fontWeight: 600, fontSize: 13, marginBottom: 4, lineHeight: 1.35 }}>{issue.title}</p>
                    <p style={{ fontSize: 11, color: 'rgba(238,240,255,0.6)', lineHeight: 1.45 }}>{issue.aiSummary || issue.description?.slice(0, 100)}</p>
                    <div style={{ marginTop: 8, display: 'flex', gap: 10, fontSize: 11, color: 'rgba(238,240,255,0.5)' }}>
                      <span>📍 {issue.location?.area}</span>
                      {issue.peopleAffected > 0 && <span>👥 {issue.peopleAffected}</span>}
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Legend */}
          <div className="map-legend">
            {Object.entries(URGENCY_COLORS).map(([u, c]) => (
              <div key={u} className="legend-item">
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: c, display: 'inline-block', boxShadow: `0 0 4px ${c}` }} />
                <span>{u}</span>
              </div>
            ))}
          </div>

          {/* Issue count badge */}
          <div className="map-count-badge">
            📍 {filtered.length} issues
          </div>
        </div>
      </div>
      <BottomNav />

      <style>{`
        .map-filters {
          display: flex; gap: 6px; overflow-x: auto; padding: 10px 12px;
          background: rgba(7,7,20,0.9); border-bottom: 1px solid var(--border);
          scrollbar-width: none;
        }
        .map-filters::-webkit-scrollbar { display: none; }
        .map-legend {
          position: absolute; bottom: 16px; left: 12px;
          background: rgba(10,10,26,0.9);
          backdrop-filter: blur(12px);
          border: 1px solid var(--border);
          border-radius: 10px; padding: 8px 12px;
          display: flex; flex-direction: column; gap: 5px;
          z-index: 999;
        }
        .legend-item { display: flex; align-items: center; gap: 6px; font-size: 0.7rem; color: var(--text-muted); text-transform: capitalize; }
        .map-count-badge {
          position: absolute; top: 12px; right: 12px;
          background: rgba(10,10,26,0.9);
          backdrop-filter: blur(12px);
          border: 1px solid var(--border);
          border-radius: 100px; padding: 5px 12px;
          font-size: 0.75rem; color: var(--text-secondary); font-weight: 500;
          z-index: 999;
        }
      `}</style>
    </div>
  )
}
