import { useEffect, useRef, useState } from 'react'
import { X, Star, Bookmark, Heart, Clock, Calendar, Globe } from 'lucide-react'
import { getMovieDetails, getSimilarMovies, posterUrl } from '../api/tmdb'
import { useLibrary } from '../context/LibraryContext'
import MovieCard from './MovieCard'

const languageNames = new Intl.DisplayNames(['en'], { type: 'language' })

const CAST_FALLBACK =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="96" viewBox="0 0 80 96">
      <rect width="80" height="96" fill="#242938"/>
      <circle cx="40" cy="38" r="16" fill="#3a4155"/>
      <path d="M12 88c4-18 20-26 28-26s24 8 28 26" fill="#3a4155"/>
    </svg>`
  )

const POSTER_FALLBACK =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="342" height="513" viewBox="0 0 342 513">
      <rect width="342" height="513" fill="#242938"/>
      <text x="171" y="265" font-family="sans-serif" font-size="16" fill="#5b6478" text-anchor="middle">No poster</text>
    </svg>`
  )

function safeLanguageName(code) {
  try {
    return languageNames.of(code)
  } catch {
    return code
  }
}

export default function MovieDetailModal({ movieId, onClose }) {
  const [currentId, setCurrentId] = useState(movieId)
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [similar, setSimilar] = useState([])
  const scrollRef = useRef(null)
  const { toggleWatchlist, toggleFavorite, isInWatchlist, isInFavorites, isSignedIn } = useLibrary()

  const handleSelectSimilar = (m) => {
    setCurrentId(m.id)
    scrollRef.current?.scrollTo({ top: 0, behavior: 'auto' })
  }

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    setMovie(null)

    Promise.all([getMovieDetails(currentId), getSimilarMovies(currentId)])
      .then(([details, similarRes]) => {
        if (!cancelled) {
          setMovie(details)
          setSimilar((similarRes.results || []).slice(0, 12))
        }
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
  }, [currentId])

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const director = movie?.credits?.crew?.find((c) => c.job === 'Director')
  const cast = movie?.credits?.cast?.slice(0, 6) || []

  return (
    <div
      ref={scrollRef}
      className="fixed inset-0 z-50 bg-ink/70 flex items-start justify-center p-0 md:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full md:max-w-2xl md:my-auto bg-paper-surface dark:bg-ink-soft md:rounded-md min-h-full md:min-h-0"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 px-4 md:px-6 py-3 bg-paper-surface dark:bg-ink-soft border-b border-ink-line/40 dark:border-ink-line md:rounded-t-md">
          <h2 className="font-semibold truncate">{movie?.title || 'Movie details'}</h2>
          <button
            onClick={onClose}
            aria-label="Close movie details"
            className="w-8 h-8 shrink-0 rounded-md flex items-center justify-center hover:bg-ink/10 dark:hover:bg-paper/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {loading && (
          <div className="p-16 text-center text-ink/50 dark:text-paper/50">Loading...</div>
        )}

        {error && (
          <div className="p-16 text-center">
            <p className="font-semibold text-red-500">Couldn't load this title.</p>
            <p className="text-sm text-ink/60 dark:text-paper/60 mt-1">{error}</p>
          </div>
        )}

        {!loading && !error && movie && (
          <div className="px-4 md:px-6 py-5">
            <div className="flex gap-4 md:gap-6">
              <img
                src={posterUrl(movie.poster_path, 'w342') || POSTER_FALLBACK}
                alt={movie.title}
                onError={(e) => {
                  e.currentTarget.onerror = null
                  e.currentTarget.src = POSTER_FALLBACK
                }}
                className="w-24 md:w-32 rounded-md shrink-0 border border-ink-line/40 bg-ink-line/40"
              />
              <div className="min-w-0">
                {movie.tagline && (
                  <p className="text-sm italic text-ink/60 dark:text-paper/60">{movie.tagline}</p>
                )}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-ink/70 dark:text-paper/70">
                  <span className="flex items-center gap-1">
                    <Star size={14} className="text-gold fill-gold" />
                    {movie.vote_average > 0 ? `${movie.vote_average.toFixed(1)} / 10` : 'Not yet rated'}
                  </span>
                  {movie.runtime > 0 && (
                    <span className="flex items-center gap-1">
                      <Clock size={14} /> {movie.runtime} min
                    </span>
                  )}
                  {movie.release_date && (
                    <span className="flex items-center gap-1">
                      <Calendar size={14} /> {movie.release_date}
                    </span>
                  )}
                </div>

                {movie.genres?.length > 0 && (
                  <p className="text-sm text-ink/60 dark:text-paper/60 mt-2">
                    {movie.genres.slice(0, 4).map((g) => g.name).join(', ')}
                  </p>
                )}

                <div className="flex flex-wrap gap-2 mt-3">
                  <button
                    onClick={() => toggleWatchlist(movie)}
                    title={isSignedIn ? undefined : 'Log in to add to your watchlist'}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium border transition-colors ${
                      isInWatchlist(movie.id)
                        ? 'bg-gold border-gold text-white'
                        : 'border-ink-line/60 dark:border-ink-line hover:border-gold'
                    }`}
                  >
                    <Bookmark size={15} />
                    {isInWatchlist(movie.id) ? 'In Watchlist' : 'Add to Watchlist'}
                  </button>
                  <button
                    onClick={() => toggleFavorite(movie)}
                    title={isSignedIn ? undefined : 'Log in to add to your favorites'}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium border transition-colors ${
                      isInFavorites(movie.id)
                        ? 'bg-gold border-gold text-white'
                        : 'border-ink-line/60 dark:border-ink-line hover:border-gold'
                    }`}
                  >
                    <Heart size={15} />
                    {isInFavorites(movie.id) ? 'Favorited' : 'Add to Favorites'}
                  </button>
                </div>
              </div>
            </div>

            <h3 className="font-semibold mt-6 mb-1">Overview</h3>
            <p className="text-sm leading-relaxed text-ink/80 dark:text-paper/80">
              {movie.overview || 'No summary available for this title.'}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6 text-sm">
              <div>
                <p className="text-ink/50 dark:text-paper/50 text-xs mb-1">Original Language</p>
                <p className="flex items-center gap-1.5">
                  <Globe size={13} /> {safeLanguageName(movie.original_language)}
                </p>
              </div>
              {movie.spoken_languages?.length > 0 && (
                <div>
                  <p className="text-ink/50 dark:text-paper/50 text-xs mb-1">Spoken Languages</p>
                  <p>{movie.spoken_languages.map((l) => l.english_name).join(', ')}</p>
                </div>
              )}
              {director && (
                <div>
                  <p className="text-ink/50 dark:text-paper/50 text-xs mb-1">Director</p>
                  <p>{director.name}</p>
                </div>
              )}
              {movie.status && (
                <div>
                  <p className="text-ink/50 dark:text-paper/50 text-xs mb-1">Status</p>
                  <p>{movie.status}</p>
                </div>
              )}
              {movie.budget > 0 && (
                <div>
                  <p className="text-ink/50 dark:text-paper/50 text-xs mb-1">Budget</p>
                  <p>${movie.budget.toLocaleString()}</p>
                </div>
              )}
              {movie.revenue > 0 && (
                <div>
                  <p className="text-ink/50 dark:text-paper/50 text-xs mb-1">Revenue</p>
                  <p>${movie.revenue.toLocaleString()}</p>
                </div>
              )}
            </div>

            {cast.length > 0 && (
              <>
                <h3 className="font-semibold mt-6 mb-2">Top Cast</h3>
                <div className="flex gap-3 overflow-x-auto scrollbar-thin pb-1">
                  {cast.map((actor) => (
                    <div key={actor.cast_id ?? actor.id} className="shrink-0 w-20 text-center">
                      <img
                        src={posterUrl(actor.profile_path, 'w185') || CAST_FALLBACK}
                        alt={actor.name}
                        className="w-20 h-24 object-cover rounded-md bg-ink-line/40 mb-1"
                      />
                      <p className="text-xs font-medium truncate">{actor.name}</p>
                      <p className="text-[11px] text-ink/50 dark:text-paper/50 truncate">{actor.character}</p>
                    </div>
                  ))}
                </div>
              </>
            )}

            {similar.length > 0 && (
              <>
                <h3 className="font-semibold mt-8 mb-2">More Like This</h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {similar.map((m) => (
                    <MovieCard key={m.id} movie={m} onSelect={handleSelectSimilar} />
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
