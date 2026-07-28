import { X } from 'lucide-react'
import MovieCard from './MovieCard'

export default function ListDrawer({ title, movies, onClose, onSelectMovie }) {
  return (
    <div className="fixed inset-0 z-50 bg-ink/70 flex justify-end" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm h-full bg-paper-surface dark:bg-ink-soft p-5 overflow-y-auto scrollbar-thin"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="marquee-text text-2xl tracking-wide">{title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-ink/10 dark:hover:bg-paper/10"
          >
            <X size={18} />
          </button>
        </div>

        {movies.length === 0 ? (
          <p className="text-sm text-ink/50 dark:text-paper/50">
            Nothing here yet. Open a movie and add it from its details.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} onSelect={onSelectMovie} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
