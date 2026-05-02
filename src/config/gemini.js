// Google Gemini AI Integration
// Get your free API key: https://aistudio.google.com/app/apikey

let genAI = null
let model = null

async function getModel() {
  if (model) return model
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    throw new Error('Gemini API key not configured. Add VITE_GEMINI_API_KEY to your .env file.')
  }
  const { GoogleGenerativeAI } = await import('@google/generative-ai')
  genAI = new GoogleGenerativeAI(apiKey)
  model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
  return model
}

function extractJSON(text) {
  const match = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/(\{[\s\S]*\}|\[[\s\S]*\])/)
  if (match) {
    try { return JSON.parse(match[1] || match[0]) } catch { return null }
  }
  return null
}

/**
 * Analyze a community report text and extract structured data
 */
export async function analyzeReport(reportText) {
  const m = await getModel()
  const prompt = `
You are an AI assistant for a community needs platform. Analyze this field report and extract:
1. category: one of (health, food, water, education, shelter, disaster, sanitation, employment, other)
2. urgency: one of (low, medium, high, critical)
3. location: place name mentioned, or "Unknown"
4. summary: 1-2 sentence human-readable summary starting with number of people affected if mentioned
5. peopleAffected: estimated number (integer), or 0 if unknown
6. tags: array of 2-4 keyword tags

Respond ONLY with valid JSON like:
{"category":"water","urgency":"critical","location":"Dharavi, Mumbai","summary":"15 families urgently need clean drinking water...","peopleAffected":75,"tags":["water","drinking","urgent"]}

Report:
"""${reportText}"""
`
  const result = await m.generateContent(prompt)
  const text = result.response.text()
  const parsed = extractJSON(text)
  return parsed || {
    category: 'other', urgency: 'medium', location: 'Unknown',
    summary: reportText.slice(0, 120), peopleAffected: 0, tags: []
  }
}

/**
 * Match a volunteer profile to available tasks
 */
export async function matchVolunteerToTasks(volunteerProfile, tasks) {
  if (!tasks || tasks.length === 0) return []
  const m = await getModel()
  const prompt = `
You are a volunteer-task matching AI. Match the volunteer to the best tasks.

Volunteer Profile:
${JSON.stringify(volunteerProfile, null, 2)}

Available Tasks (id, title, category, urgency, description):
${JSON.stringify(tasks.map(t => ({ id: t.id, title: t.title, category: t.category, urgency: t.urgency, description: t.description })), null, 2)}

Return top matches as JSON array (max 5):
[{"taskId":"task-id","matchScore":85,"reason":"Short reason why this matches"}]

Only return JSON, no other text.
`
  const result = await m.generateContent(prompt)
  const text = result.response.text()
  return extractJSON(text) || []
}

/**
 * Generate an AI summary of community needs dashboard
 */
export async function generateDashboardSummary(issues) {
  const m = await getModel()
  const stats = {
    total: issues.length,
    critical: issues.filter(i => i.urgency === 'critical').length,
    high: issues.filter(i => i.urgency === 'high').length,
    categories: [...new Set(issues.map(i => i.category))],
    topAreas: issues.slice(0, 3).map(i => i.location?.area || 'Unknown'),
  }
  const prompt = `
Summarize these community needs statistics in 2-3 sentences for an NGO dashboard.
Be empathetic, urgent where needed, and highlight the most critical issues.
Stats: ${JSON.stringify(stats)}
Issues (urgency + area): ${JSON.stringify(issues.slice(0, 5).map(i => ({ u: i.urgency, a: i.location?.area, c: i.category })))}
Return ONLY the summary text, no JSON.
`
  const result = await m.generateContent(prompt)
  return result.response.text().trim()
}

/**
 * Convert voice transcript to structured report
 */
export async function processVoiceTranscript(transcript) {
  return analyzeReport(transcript)
}
