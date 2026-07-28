import { Star } from 'lucide-react'
import { posterUrl } from '../api/tmdb'
import { useLibrary } from '../context/LibraryContext'
import { CLERK_ENABLED } from '../lib/clerk'

export default function MovieCard({ movie, onSelect }) {
  const { isSignedIn, requireSignIn } = useLibrary()
  const hideDetails = CLERK_ENABLED && !isSignedIn

  const rating = movie.vote_average > 0 ? movie.vote_average.toFixed(1) : 'NR'
  const year = movie.release_date ? movie.release_date.slice(0, 4) : ''

  const handleClick = () => {
    if (!requireSignIn()) return
    onSelect(movie)
  }

  return (
    <button
      onClick={handleClick}
      className="text-left rounded-md overflow-hidden border border-ink-line/40 dark:border-ink-line bg-paper-surface dark:bg-ink-surface"
    >
      <div className="card-poster">
        {movie.poster_path ? (
          <img
            src={posterUrl(movie.poster_path)}
            alt={hideDetails ? '' : movie.title}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-ink/30 dark:text-paper/30 text-xs px-2 text-center">
            No poster available
          </div>
        )}
      </div>

      {!hideDetails && (
        <div className="p-2">
          <p className="text-sm font-medium leading-snug line-clamp-2">{movie.title}</p>
          <div className="flex items-center gap-1 mt-1">
            <Star size={13} className="text-gold fill-gold" />
            <span className="text-xs text-ink/60 dark:text-paper/60">{rating}</span>
            {year && <span className="text-xs text-ink/40 dark:text-paper/40 ml-auto">{year}</span>}
          </div>
        </div>
      )}
    </button>
  )
}