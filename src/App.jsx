import { useEffect, useMemo, useRef, useState } from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Hero from './components/Hero'
import MovieGrid from './components/MovieGrid'
import Pagination from './components/Pagination'
import MovieDetailModal from './components/MovieDetailModal'
import ListDrawer from './components/ListDrawer'
import { getGenres, getMoviesByGenre, getTrending, searchMovies } from './api/tmdb'
import { useDebounce } from './hooks/useDebounce'
import { useLibrary } from './context/LibraryContext'

export default function App() {
  const [genres, setGenres] = useState([])
  const [activeGenre, setActiveGenre] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 450)

  const [page, setPage] = useState(1)
  const [movies, setMovies] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [totalResults, setTotalResults] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [selectedMovieId, setSelectedMovieId] = useState(null)
  const [activeDrawer, setActiveDrawer] = useState(null) 

  const { watchlist, favorites } = useLibrary()
  const mainRef = useRef(null)

  useEffect(() => {
    getGenres()
      .then(setGenres)
      .catch((err) => setError(err.message))
  }, [])

  useEffect(() => {
    setPage(1)
  }, [activeGenre, debouncedQuery])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    const request = debouncedQuery.trim()
      ? searchMovies(debouncedQuery.trim(), page)
      : activeGenre
      ? getMoviesByGenre(activeGenre, page)
      : getTrending(page)

    request
      .then((data) => {
        if (!cancelled) {
          setMovies(data.results || [])
          setTotalPages(Math.min(data.total_pages || 1, 500))
          setTotalResults(data.total_results || 0)
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
  }, [activeGenre, debouncedQuery, page])

  const gridTitle = useMemo(() => {
    if (debouncedQuery.trim()) return `Results for “${debouncedQuery.trim()}”`
    if (activeGenre) {
      const g = genres.find((genre) => genre.id === activeGenre)
      return g ? g.name : 'Movies'
    }
    return 'Trending This Week'
  }, [debouncedQuery, activeGenre, genres])

  const isSearching = Boolean(debouncedQuery.trim())
  const showHero = !isSearching && !loading && movies.length > 0
  const heroMovie = showHero ? movies[0] : null
  const gridMovies = heroMovie ? movies.slice(1) : movies

  const handlePageChange = (p) => {
    setPage(p)
    mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Navbar
        query={query}
        onQueryChange={setQuery}
        onOpenWatchlist={() => setActiveDrawer('watchlist')}
        onOpenFavorites={() => setActiveDrawer('favorites')}
      />

      <div className="flex flex-1 min-h-0 overflow-hidden">
        <Sidebar
          genres={genres}
          activeGenre={activeGenre}
          onSelectGenre={(id) => {
            setActiveGenre(id)
            setQuery('')
            mainRef.current?.scrollTo({ top: 0 })
          }}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen((o) => !o)}
        />

        <main ref={mainRef} className="flex-1 min-w-0 overflow-y-auto">
          {heroMovie && (
            <Hero movie={heroMovie} onSelectMovie={(movie) => setSelectedMovieId(movie.id)} />
          )}

          <MovieGrid
            title={gridTitle}
            movies={gridMovies}
            loading={loading}
            error={error}
            onSelectMovie={(movie) => setSelectedMovieId(movie.id)}
          />

          {!loading && !error && (
            <Pagination
              page={page}
              totalPages={totalPages}
              totalResults={totalResults}
              onPageChange={handlePageChange}
            />
          )}
        </main>
      </div>

      {selectedMovieId && (
        <MovieDetailModal movieId={selectedMovieId} onClose={() => setSelectedMovieId(null)} />
      )}

      {activeDrawer === 'watchlist' && (
        <ListDrawer
          title="Your Watchlist"
          movies={watchlist}
          onClose={() => setActiveDrawer(null)}
          onSelectMovie={(movie) => {
            setActiveDrawer(null)
            setSelectedMovieId(movie.id)
          }}
        />
      )}

      {activeDrawer === 'favorites' && (
        <ListDrawer
          title="Your Favorites"
          movies={favorites}
          onClose={() => setActiveDrawer(null)}
          onSelectMovie={(movie) => {
            setActiveDrawer(null)
            setSelectedMovieId(movie.id)
          }}
        />
      )}
    </div>
  )
}
