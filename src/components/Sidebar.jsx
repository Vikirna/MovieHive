import {
  Film,
  Swords,
  Compass,
  Sparkles,
  Laugh,
  Siren,
  Camera,
  Users,
  Baby,
  Wand2,
  Landmark,
  Ghost,
  Music,
  Search,
  Heart,
  Rocket,
  Tv,
  Zap,
  Shield,
  Flag,
} from 'lucide-react'

const GENRE_ICONS = {
  Action: Swords,
  Adventure: Compass,
  Animation: Sparkles,
  Comedy: Laugh,
  Crime: Siren,
  Documentary: Camera,
  Drama: Users,
  Family: Baby,
  Fantasy: Wand2,
  History: Landmark,
  Horror: Ghost,
  Music: Music,
  Mystery: Search,
  Romance: Heart,
  'Science Fiction': Rocket,
  'TV Movie': Tv,
  Thriller: Zap,
  War: Shield,
  Western: Flag,
}

function getGenreIcon(name) {
  return GENRE_ICONS[name] || Film
}

export default function Sidebar({ genres, activeGenre, onSelectGenre, isOpen, onToggle }) {
  return (
    <aside
      className={`shrink-0 h-full border-r border-ink-line/60 dark:border-ink-line bg-paper-surface dark:bg-ink-soft transition-all duration-300 ${
        isOpen ? 'w-64' : 'w-16'
      }`}
    >
      <div className="px-2.5 py-4 h-full flex flex-col">
        <button
          onClick={onToggle}
          aria-label={isOpen ? 'Collapse genre panel' : 'Expand genre panel'}
          className={`flex items-center mb-6 w-full pr-1.5 ${isOpen ? 'gap-2' : 'justify-center'}`}
        >
          <span className="flex flex-col gap-[3px] p-2 rounded-md border border-ink-line/60 dark:border-ink-line">
            <span className="block w-4 h-[2px] bg-current" />
            <span className="block w-4 h-[2px] bg-current" />
            <span className="block w-4 h-[2px] bg-current" />
          </span>
          {isOpen && (
            <span className="text-sm font-medium text-ink/60 dark:text-paper/60">Genres</span>
          )}
        </button>

        <nav
          className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin flex flex-col gap-1 pr-1.5"
          style={{ scrollbarGutter: 'stable' }}
        >
          <button
            onClick={() => onSelectGenre(null)}
            title="Trending"
            className={`flex items-center rounded-md py-2.5 text-sm transition-colors ${
              isOpen ? 'gap-3 px-2.5' : 'justify-center'
            } ${
              activeGenre === null
                ? 'bg-gold text-white font-medium'
                : 'hover:bg-ink/5 dark:hover:bg-paper/5 text-ink/70 dark:text-paper/70'
            }`}
          >
            <Film size={18} className="shrink-0" />
            {isOpen && <span>Trending Now</span>}
          </button>

          {genres.map((genre) => {
            const GenreIcon = getGenreIcon(genre.name)
            return (
              <button
                key={genre.id}
                onClick={() => onSelectGenre(genre.id)}
                title={genre.name}
                className={`flex items-center rounded-md py-2.5 text-sm transition-colors ${
                  isOpen ? 'gap-3 px-2.5' : 'justify-center'
                } ${
                  activeGenre === genre.id
                    ? 'bg-gold text-white font-medium'
                    : 'hover:bg-ink/5 dark:hover:bg-paper/5 text-ink/70 dark:text-paper/70'
                }`}
              >
                <GenreIcon size={18} className="shrink-0" />
                {isOpen && <span className="truncate">{genre.name}</span>}
              </button>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}