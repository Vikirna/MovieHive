
import { useEffect, useState } from 'react'
import { ChevronLeft, Calendar, MapPin, Briefcase } from 'lucide-react'
import { getPersonDetails, posterUrl } from '../api/tmdb'
import MovieCard from './MovieCard'

const PROFILE_FALLBACK =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="185" height="278" viewBox="0 0 185 278">
      <rect width="185" height="278" fill="#242938"/>
      <circle cx="92" cy="105" r="38" fill="#3a4155"/>
      <path d="M20 250c10-45 48-65 72-65s62 20 72 65" fill="#3a4155"/>
    </svg>`
  )

function formatDate(dateStr) {
  if (!dateStr) return null
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function CastDetailModal({ personId, onClose, onSelectMovie }) {
  const [person, setPerson] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    setPerson(null)

    getPersonDetails(personId)
      .then((data) => {
        if (!cancelled) setPerson(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [personId])

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  // Pull their movie credits out of combined_credits (which also
  // includes TV work) and show the most popular ones with a poster.
  const knownFor = (person?.combined_credits?.cast || [])
    .filter((c) => c.media_type === 'movie' && c.poster_path)
    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
    .slice(0, 8)

  return (
    <div
      className="fixed inset-0 z-[60] bg-ink/70 flex items-start justify-center p-0 md:p-6 overflow-y-auto"
      onClick={(e) => {
        e.stopPropagation()
        onClose()
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full md:max-w-xl md:my-auto bg-paper-surface dark:bg-ink-soft md:rounded-md min-h-full md:min-h-0"
      >
        <div className="sticky top-0 z-10 flex items-center gap-2 px-4 md:px-6 py-3 bg-paper-surface dark:bg-ink-soft border-b border-ink-line/40 dark:border-ink-line md:rounded-t-md">
          <button
            onClick={onClose}
            aria-label="Back to movie details"
            className="w-8 h-8 shrink-0 rounded-md flex items-center justify-center hover:bg-ink/10 dark:hover:bg-paper/10 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <h2 className="font-semibold truncate">{person?.name || 'Cast details'}</h2>
        </div>

        {loading && (
          <div className="p-16 text-center text-ink/50 dark:text-paper/50">Loading...</div>
        )}

        {error && (
          <div className="p-16 text-center">
            <p className="font-semibold text-red-500">Couldn't load this person.</p>
            <p className="text-sm text-ink/60 dark:text-paper/60 mt-1">{error}</p>
          </div>
        )}

        {!loading && !error && person && (
          <div className="px-4 md:px-6 py-5">
            <div className="flex gap-4 md:gap-6">
              <img
                src={posterUrl(person.profile_path, 'w185') || PROFILE_FALLBACK}
                alt={person.name}
                onError={(e) => {
                  e.currentTarget.onerror = null
                  e.currentTarget.src = PROFILE_FALLBACK
                }}
                className="w-24 md:w-32 rounded-md shrink-0 border border-ink-line/40 bg-ink-line/40 object-cover"
              />
              <div className="min-w-0 text-sm text-ink/70 dark:text-paper/70 space-y-1.5">
                {person.known_for_department && (
                  <p className="flex items-center gap-1.5">
                    <Briefcase size={14} /> {person.known_for_department}
                  </p>
                )}
                {person.birthday && (
                  <p className="flex items-center gap-1.5">
                    <Calendar size={14} />
                    {formatDate(person.birthday)}
                    {person.deathday ? ` – ${formatDate(person.deathday)}` : ''}
                  </p>
                )}
                {person.place_of_birth && (
                  <p className="flex items-center gap-1.5">
                    <MapPin size={14} /> {person.place_of_birth}
                  </p>
                )}
              </div>
            </div>

            <h3 className="font-semibold mt-6 mb-1">Biography</h3>
            <p className="text-sm leading-relaxed text-ink/80 dark:text-paper/80 whitespace-pre-line">
              {person.biography || 'No biography available.'}
            </p>

            {knownFor.length > 0 && (
              <>
                <h3 className="font-semibold mt-8 mb-2">Known For</h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {knownFor.map((m) => (
                    <MovieCard
                      key={m.id}
                      movie={m}
                      onSelect={(movie) => {
                        onClose()
                        onSelectMovie && onSelectMovie(movie)
                      }}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}