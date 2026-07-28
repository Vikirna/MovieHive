import { createContext, useContext, useEffect, useState } from 'react'
import { useUser, useClerk } from '@clerk/clerk-react'
import { CLERK_ENABLED } from '../lib/clerk'

const LibraryContext = createContext(null)

function loadGuestList(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || []
  } catch {
    return []
  }
}

function trimMovie(movie) {
  return {
    id: movie.id,
    title: movie.title,
    poster_path: movie.poster_path,
    vote_average: movie.vote_average,
    release_date: movie.release_date,
  }
}

export function LibraryProvider({ children }) {
  const clerkUser = CLERK_ENABLED ? useUser() : null
  const clerk = CLERK_ENABLED ? useClerk() : null
  const isLoaded = CLERK_ENABLED ? (clerkUser?.isLoaded ?? false) : true
  const isSignedIn = clerkUser?.isSignedIn ?? false
  const user = clerkUser?.user ?? null

  const [watchlist, setWatchlistState] = useState([])
  const [favorites, setFavoritesState] = useState([])
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!isLoaded) return

    if (isSignedIn && user) {
      setWatchlistState(user.unsafeMetadata?.watchlist || [])
      setFavoritesState(user.unsafeMetadata?.favorites || [])
    } else {
      setWatchlistState(loadGuestList('moviehive-watchlist-guest'))
      setFavoritesState(loadGuestList('moviehive-favorites-guest'))
    }
    setReady(true)
  }, [isLoaded, isSignedIn, user?.id])

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return

    const guestWatchlist = loadGuestList('moviehive-watchlist-guest')
    const guestFavorites = loadGuestList('moviehive-favorites-guest')
    if (guestWatchlist.length === 0 && guestFavorites.length === 0) return

    const merge = (existing, incoming) => {
      const merged = [...existing]
      incoming.forEach((m) => {
        if (!merged.some((x) => x.id === m.id)) merged.push(m)
      })
      return merged
    }

    const mergedWatchlist = merge(user.unsafeMetadata?.watchlist || [], guestWatchlist)
    const mergedFavorites = merge(user.unsafeMetadata?.favorites || [], guestFavorites)

    user
      .update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          watchlist: mergedWatchlist,
          favorites: mergedFavorites,
        },
      })
      .then(() => {
        setWatchlistState(mergedWatchlist)
        setFavoritesState(mergedFavorites)
        localStorage.removeItem('moviehive-watchlist-guest')
        localStorage.removeItem('moviehive-favorites-guest')
      })
      .catch((err) => console.error('Failed to merge guest library:', err))
  }, [isLoaded, isSignedIn, user?.id])

  const persist = async (nextWatchlist, nextFavorites) => {
    if (isSignedIn && user) {
      setSaving(true)
      setSaveError(null)
      try {
        await user.update({
          unsafeMetadata: {
            ...user.unsafeMetadata,
            watchlist: nextWatchlist,
            favorites: nextFavorites,
          },
        })
      } catch (err) {
        console.error('Failed to save library to Clerk:', err)
        setSaveError('Could not save changes. Your list may not persist after reload.')
      } finally {
        setSaving(false)
      }
    } else {
      localStorage.setItem('moviehive-watchlist-guest', JSON.stringify(nextWatchlist))
      localStorage.setItem('moviehive-favorites-guest', JSON.stringify(nextFavorites))
    }
  }

  const toggleInList = (list, movie) => {
    const exists = list.some((m) => m.id === movie.id)
    return exists ? list.filter((m) => m.id !== movie.id) : [...list, movie]
  }

  const requireSignIn = () => {
    if (!CLERK_ENABLED || isSignedIn) return true
    clerk.openSignIn({
      afterSignInUrl: window.location.href,
      afterSignUpUrl: window.location.href,
    })
    return false
  }

  const toggleWatchlist = (movie) => {
    const alreadyIn = isInWatchlist(movie.id)
    if (!alreadyIn && !requireSignIn()) return
    const next = toggleInList(watchlist, trimMovie(movie))
    setWatchlistState(next)
    persist(next, favorites)
  }

  const toggleFavorite = (movie) => {
    const alreadyIn = isInFavorites(movie.id)
    if (!alreadyIn && !requireSignIn()) return
    const next = toggleInList(favorites, trimMovie(movie))
    setFavoritesState(next)
    persist(watchlist, next)
  }

  const isInWatchlist = (id) => watchlist.some((m) => m.id === id)
  const isInFavorites = (id) => favorites.some((m) => m.id === id)

  return (
    <LibraryContext.Provider
      value={{
        watchlist,
        favorites,
        toggleWatchlist,
        toggleFavorite,
        isInWatchlist,
        isInFavorites,
        isSignedIn,
        requireSignIn,
        saving,
        saveError,
        ready,
      }}
    >
      {children}
    </LibraryContext.Provider>
  )
}

export function useLibrary() {
  const ctx = useContext(LibraryContext)
  if (!ctx) throw new Error('useLibrary must be used within LibraryProvider')
  return ctx
}