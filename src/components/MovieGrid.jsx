import MovieCard from './MovieCard'

export default function MovieGrid({ title, movies, loading, error, onSelectMovie }) {
  if (error) {
    return (
      <div className="p-8 text-center text-ink/60 dark:text-paper/60">
        <p className="font-semibold text-red-500 mb-1">Couldn't load movies.</p>
        <p className="text-sm">{error}</p>
      </div>
    )
  }

  return (
    <section className="px-4 md:px-6 py-6">
      {title && (
        <h2 className="marquee-text text-xl mb-4">{title}</h2>
      )}

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="card-poster rounded-lg bg-ink/5 dark:bg-paper/5 animate-pulse" />
          ))}
        </div>
      ) : movies.length === 0 ? (
        <div className="py-16 text-center text-ink/50 dark:text-paper/50">
          <p className="marquee-text text-xl mb-1">No results</p>
          <p className="text-sm">Try a different genre or search term.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} onSelect={onSelectMovie} />
          ))}
        </div>
      )}
    </section>
  )
}
