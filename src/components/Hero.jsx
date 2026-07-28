import { Info, Star, Lock } from 'lucide-react'
import { backdropUrl } from '../api/tmdb'
import { useLibrary } from '../context/LibraryContext'
import { CLERK_ENABLED } from '../lib/clerk'

export default function Hero({ movie, onSelectMovie }) {
  const { isSignedIn, requireSignIn } = useLibrary()
  const hideDetails = CLERK_ENABLED && !isSignedIn

  if (!movie) return null

  const handleMoreInfo = () => {
    if (!requireSignIn()) return
    onSelectMovie(movie)
  }

  return (
    <section className="relative w-full h-[46vh] md:h-[62vh] min-h-[320px] overflow-hidden">
      {movie.backdrop_path ? (
        <img
          src={backdropUrl(movie.backdrop_path, 'original')}
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
      ) : (
        <div className="absolute inset-0 bg-ink-line/40" />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-paper via-paper/60 dark:from-ink dark:via-ink/50 to-transparent" />

      <div className="absolute left-0 right-0 bottom-0 px-4 md:px-8 pb-8 md:pb-10 max-w-2xl">
        <span className="inline-flex items-center bg-amber-400 text-ink text-xs font-bold uppercase tracking-wide px-2.5 py-1 rounded mb-2 shadow-[0_0_12px_rgba(251,191,36,0.8)]">
          Trending Now
        </span>

        {hideDetails ? (
          <>
            <h1 className="marquee-text text-3xl md:text-5xl text-ink dark:text-paper leading-tight">
              Sign in to see what's trending
            </h1>
            <p className="text-ink/80 dark:text-paper/80 text-sm md:text-base mt-3 max-w-xl">
              Create a free account to view titles, ratings, and details.
            </p>
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => requireSignIn()}
                className="flex items-center gap-2 bg-gold text-white font-semibold px-5 py-2.5 rounded-md text-sm hover:bg-gold-deep transition-colors"
              >
                <Lock size={16} />
                Sign In
              </button>
            </div>
          </>
        ) : (
          <>
            <h1
              className={`marquee-text text-ink dark:text-paper leading-tight line-clamp-2 break-words ${
                movie.title.length > 28 ? 'text-2xl md:text-4xl' : 'text-3xl md:text-5xl'
              }`}
            >
              {movie.title}
            </h1>

            <div className="flex items-center gap-4 mt-3 text-ink/90 dark:text-paper/90 text-sm">
              <span className="flex items-center gap-1">
                <Star size={14} className="text-gold fill-gold" />
                {movie.vote_average > 0 ? `${movie.vote_average.toFixed(1)} / 10` : 'Not yet rated'}
              </span>
              {movie.release_date && <span>{movie.release_date.slice(0, 4)}</span>}
            </div>

            <p className="text-ink/80 dark:text-paper/80 text-sm md:text-base mt-3 line-clamp-3 max-w-xl">
              {movie.overview || 'No summary available for this title.'}
            </p>

            <div className="flex gap-3 mt-5">
              <button
                onClick={handleMoreInfo}
                className="flex items-center gap-2 bg-gold text-white font-semibold px-5 py-2.5 rounded-md text-sm hover:bg-gold-deep transition-colors"
              >
                <Info size={16} />
                More Info
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  )
}