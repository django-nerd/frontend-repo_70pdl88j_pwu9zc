import { useEffect, useState } from 'react'

export default function CRM() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const load = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${baseUrl}/api/feedback`)
      if (!res.ok) throw new Error('Failed to fetch feedback')
      const data = await res.json()
      setItems(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">CRM Inbox</h2>
        <button onClick={load} className="bg-gray-900 text-white px-3 py-2 rounded">Refresh</button>
      </div>
      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}
      <div className="grid gap-3">
        {items.length === 0 && !loading && (
          <p className="text-gray-500">No feedback yet.</p>
        )}
        {items.map(item => (
          <div key={item.id} className="border rounded-lg p-4 bg-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-yellow-500">{'★'.repeat(item.rating)}{'☆'.repeat(5-item.rating)}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${item.status === 'new' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>{item.status}</span>
              </div>
              <span className="text-xs text-gray-400">{new Date(item.created_at || Date.now()).toLocaleString()}</span>
            </div>
            <div className="mt-2">
              <p className="font-medium">{item.name || 'Anonymous'}</p>
              <p className="text-sm text-gray-600">{item.email || '-'}</p>
            </div>
            {item.comments && <p className="mt-3 text-gray-700">{item.comments}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}
