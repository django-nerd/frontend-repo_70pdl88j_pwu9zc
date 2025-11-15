import { useState, useEffect } from 'react'
import CRM from './components/CRM'

function Test() {
  const [backendStatus, setBackendStatus] = useState('checking...')
  const [backendUrl, setBackendUrl] = useState('')
  const [databaseStatus, setDatabaseStatus] = useState(null)

  useEffect(() => {
    checkBackendConnection()
  }, [])

  const checkBackendConnection = async () => {
    try {
      const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
      setBackendUrl(baseUrl)
      const response = await fetch(`${baseUrl}`)
      if (response.ok) {
        const data = await response.json()
        setBackendStatus(`✅ Connected - ${data.message || 'OK'}`)
        await checkDatabaseConnection(baseUrl)
      } else {
        setBackendStatus(`❌ Failed - ${response.status} ${response.statusText}`)
        setDatabaseStatus({ error: 'Backend not accessible' })
      }
    } catch (error) {
      setBackendStatus(`❌ Error - ${error.message}`)
      setDatabaseStatus({ error: 'Backend not accessible' })
    }
  }

  const checkDatabaseConnection = async (baseUrl) => {
    try {
      const response = await fetch(`${baseUrl}/test`)
      if (response.ok) {
        const dbData = await response.json()
        setDatabaseStatus(dbData)
      } else {
        setDatabaseStatus({ error: `Failed to check database - ${response.status}` })
      }
    } catch (error) {
      setDatabaseStatus({ error: `Database check failed - ${error.message}` })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h1 className="text-2xl font-bold mb-4">System Status</h1>
          <div className="space-y-3">
            <div>
              <div className="text-sm text-gray-500">Backend URL</div>
              <div className="text-sm font-mono bg-gray-100 p-2 rounded break-all">{backendUrl || 'Detecting...'}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Backend</div>
              <div className="text-sm font-mono bg-gray-100 p-2 rounded">{backendStatus}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Database</div>
              <div className="text-sm bg-gray-100 p-2 rounded">
                {databaseStatus ? (
                  databaseStatus.error ? (
                    <p className="text-red-600 font-mono">{databaseStatus.error}</p>
                  ) : (
                    <div className="space-y-1 text-sm">
                      <p><span className="font-semibold">Backend:</span> {databaseStatus.backend}</p>
                      <p><span className="font-semibold">Database:</span> {databaseStatus.database}</p>
                      <p><span className="font-semibold">DB URL:</span> {databaseStatus.database_url}</p>
                      <p><span className="font-semibold">DB Name:</span> {databaseStatus.database_name}</p>
                      <p><span className="font-semibold">Connection:</span> {databaseStatus.connection_status}</p>
                      {databaseStatus.collections?.length > 0 && (
                        <p><span className="font-semibold">Collections:</span> {databaseStatus.collections.join(', ')}</p>
                      )}
                    </div>
                  )
                ) : (
                  <p className="text-gray-500 font-mono">Checking database...</p>
                )}
              </div>
            </div>
            <button onClick={checkBackendConnection} className="w-full bg-blue-600 text-white py-2 rounded">Test Again</button>
            <a href="/" className="w-full inline-block text-center bg-gray-600 text-white py-2 rounded">Back to Landing</a>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <CRM />
        </div>
      </div>
    </div>
  )
}

export default Test
