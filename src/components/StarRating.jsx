import { useState } from 'react'

export default function StarRating({ value, onChange, size = 32 }) {
  const [hover, setHover] = useState(0)
  const stars = [1, 2, 3, 4, 5]

  return (
    <div className="flex items-center gap-1" role="radiogroup" aria-label="Star rating">
      {stars.map((star) => {
        const active = (hover || value) >= star
        return (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={value === star}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            onClick={() => onChange(star)}
            className={`transition-transform ${active ? 'text-yellow-400' : 'text-gray-300'} hover:scale-110 focus:outline-none`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 .587l3.668 7.568L24 9.75l-6 5.85 1.417 8.4L12 19.771 4.583 24l1.417-8.4L0 9.75l8.332-1.595z" />
            </svg>
          </button>
        )
      })}
    </div>
  )
}
