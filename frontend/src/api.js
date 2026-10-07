const API_BASE = import.meta.env.VITE_API_URL || '/api'
async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, { headers: {'Content-Type':'application/json', ...(options.headers || {})}, ...options })
  if (!response.ok) { const text = await response.text(); throw new Error(text || `Request failed: ${response.status}`) }
  return response.json()
}
export const api = {
  health: () => request('/health'),
  equipment: () => request('/equipment'),
  addEquipment: data => request('/equipment', {method:'POST', body:JSON.stringify(data)}),
  borrow: data => request('/borrow-requests', {method:'POST', body:JSON.stringify(data)}),
  borrowRequest: data => request('/borrow-requests', {method:'POST', body:JSON.stringify(data)}),
  resources: () => request('/resources'),
  reminders: () => request('/reminders'),
  addReminder: data => request('/reminders', {method:'POST', body:JSON.stringify(data)}),
  completeReminder: id => request(`/reminders/${id}/complete`, {method:'PATCH'}),
  summary: () => request('/summary'),
  symptomGuidance: symptoms => request('/symptom-guidance', {method:'POST', body:JSON.stringify({symptoms})}),
}
