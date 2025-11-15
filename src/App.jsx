import { useState } from 'react'
import StarRating from './components/StarRating'

function App() {
  const [rating, setRating] = useState(0)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [comments, setComments] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const GOOGLE_REVIEW_URL = import.meta.env.VITE_GOOGLE_REVIEW_URL || 'https://search.google.com/local/writereview?placeid='

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!rating) return

    // If rating is >= 4 redirect to Google Reviews
    if (rating >= 4) {
      // Optionally send a lightweight event to backend (not required)
      window.location.href = GOOGLE_REVIEW_URL
      return
    }

    // Otherwise, capture feedback into CRM
    try {
      setSubmitting(true)
      const res = await fetch(`${backendUrl}/api/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, comments, rating, source: 'landing' })
      })
      if (!res.ok) throw new Error('Failed to submit feedback')
      setSubmitted(true)
      setName('')
      setEmail('')
      setComments('')
      setRating(0)
    } catch (err) {
      alert(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-6">
      <div className="bg-white/80 backdrop-blur rounded-2xl shadow-xl w-full max-w-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Share Your Experience</h1>
          <p className="text-gray-600 mt-2">How would you rate your recent experience with us?</p>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center gap-3">
              <StarRating value={rating} onChange={setRating} />
              <p className="text-sm text-gray-500">Select 1-5 stars</p>
            </div>

            {rating > 0 && rating < 4 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input value={name} onChange={(e) => setName(e.target.value)} className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Your name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="you@example.com" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tell us more</label>
                  <textarea value={comments} onChange={(e) => setComments(e.target.value)} rows={4} className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="What could we improve?" />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || rating === 0}
              className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              {rating >= 4 ? 'Leave a Google Review' : 'Send Feedback'}
            </button>

            <div className="text-xs text-gray-400">For 4-5 star ratings, you'll be redirected to Google to post your review. Lower ratings are shared privately with our team.</div>
          </form>
        ) : (
          <div className="text-center space-y-3">
            <h2 className="text-2xl font-semibold text-green-600">Thanks for your feedback!</h2>
            <p className="text-gray-600">Our team will review it and get back to you if needed.</p>
            <button onClick={() => setSubmitted(false)} className="mt-4 bg-gray-800 text-white px-4 py-2 rounded">Leave another</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
