const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const BASE_URL = 'https://api.themoviedb.org/3'
const IMG_BASE = 'https://image.tmdb.org/t/p'

async function tmdbFetch(path, params = {}) {
  const url = new URL(`${BASE_URL}${path}`)
  url.searchParams.set('api_key', API_KEY)
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, value)
    }
  })
  const res = await fetch(url.toString())
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.status_message || `TMDB request failed (${res.status})`)
  }
  return res.json()
}

export function posterUrl(path, size = 'w500') {
  return path ? `${IMG_BASE}/${size}${path}` : null
}

export function backdropUrl(path, size = 'w1280') {
  return path ? `${IMG_BASE}/${size}${path}` : null
}

export function getGenres() {
  return tmdbFetch('/genre/movie/list').then((d) => d.genres)
}

export function getMoviesByGenre(genreId, page = 1) {
  return tmdbFetch('/discover/movie', {
    with_genres: genreId,
    page,
    sort_by: 'popularity.desc',
  })
}

export function getTrending(page = 1) {
  return tmdbFetch('/trending/movie/week', { page })
}

export function searchMovies(query, page = 1) {
  return tmdbFetch('/search/movie', { query, page, include_adult: false })
}

export function getMovieDetails(id) {
  return tmdbFetch(`/movie/${id}`, {
    append_to_response: 'credits,videos',
  })
}

export function getSimilarMovies(id, page = 1) {
  return tmdbFetch(`/movie/${id}/similar`, { page })
}

export function getPersonDetails(id) {
  return tmdbFetch(`/person/${id}`, {
    append_to_response: 'combined_credits',
  })
}