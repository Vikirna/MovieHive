import { useState } from 'react'
import { Search, Bookmark, Heart, Sun, Moon, User, X } from 'lucide-react'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react'
import { useTheme } from '../context/ThemeContext'
import { useLibrary } from '../context/LibraryContext'
import { CLERK_ENABLED } from '../lib/clerk'

export default function Navbar({ query, onQueryChange, onOpenWatchlist, onOpenFavorites }) {
  const { theme, toggleTheme } = useTheme()
  const { watchlist, favorites } = useLibrary()
  const [focused, setFocused] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-ink-line/60 dark:border-ink-line bg-paper dark:bg-ink">
      <div className="flex items-center gap-4 px-4 md:px-6 h-16">
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-md bg-gold flex items-center justify-center marquee-text text-ink text-lg">
            H
          </div>
          <span className="marquee-text text-xl tracking-widest2 hidden sm:block">MOVIEHIVE</span>
        </div>

        <div className="flex-1 flex justify-center px-2">
          <div
            className={`relative w-full max-w-md transition-all ${focused ? 'max-w-lg' : ''}`}
          >
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40 dark:text-paper/40"
            />
            <input
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="Search movies..."
              className="w-full bg-ink/5 dark:bg-paper/10 rounded-full pl-9 pr-9 py-2 text-sm outline-none border border-transparent focus:border-gold transition-colors placeholder:text-ink/40 dark:placeholder:text-paper/40"
            />
            {query && (
              <button
                onClick={() => onQueryChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 dark:text-paper/40 hover:text-gold"
                aria-label="Clear Search"
              >
                <X size={15} />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 md:gap-3 shrink-0">
          <button
            onClick={onOpenWatchlist}
            className="relative flex items-center gap-1.5 px-2 py-2 rounded-md hover:bg-ink/5 dark:hover:bg-paper/10 transition-colors"
            title="Watchlist"
          >
            <Bookmark size={19} />
            {watchlist.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-gold text-ink text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {watchlist.length}
              </span>
            )}
          </button>

          <button
            onClick={onOpenFavorites}
            className="relative flex items-center gap-1.5 px-2 py-2 rounded-md hover:bg-ink/5 dark:hover:bg-paper/10 transition-colors"
            title="Favorites"
          >
            <Heart size={19} />
            {favorites.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-teal text-ink text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {favorites.length}
              </span>
            )}
          </button>

          <button
            onClick={toggleTheme}
            className="px-2 py-2 rounded-md hover:bg-ink/5 dark:hover:bg-paper/10 transition-colors"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
          </button>

          {CLERK_ENABLED ? (
            <>
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-gold text-white text-sm font-semibold hover:bg-gold-deep transition-colors">
                    <User size={16} />
                    <span>Login</span>
                  </button>
                </SignInButton>
              </SignedOut>
            </>
          ) : (
            <button
              disabled
              title="Add a real VITE_CLERK_PUBLISHABLE_KEY to .env to enable login"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-ink/10 dark:bg-paper/10 text-ink/40 dark:text-paper/40 text-sm font-semibold cursor-not-allowed"
            >
              <User size={16} />
              <span>Login</span>
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
