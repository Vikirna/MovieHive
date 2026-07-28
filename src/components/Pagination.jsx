import { ChevronLeft, ChevronRight } from 'lucide-react'

function pageNumbers(current, total) {
  const pages = new Set([1, total, current, current - 1, current + 1])
  return [...pages]
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b)
}

export default function Pagination({ page, totalPages, totalResults, onPageChange }) {
  if (totalPages <= 1) return null

  const pages = pageNumbers(page, totalPages)

  return (
    <div className="flex flex-col items-center gap-2 py-8">
      <p className="text-xs text-ink/50 dark:text-paper/50 font-mono">
        Page {page} of {totalPages} • {totalResults.toLocaleString()} movies total
      </p>
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="w-9 h-9 rounded-md flex items-center justify-center border border-ink-line/60 dark:border-ink-line hover:border-gold disabled:opacity-30 disabled:hover:border-ink-line/60 transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>

        {pages.map((p, i) => (
          <span key={p} className="flex items-center">
            {i > 0 && pages[i - 1] !== p - 1 && (
              <span className="px-1 text-ink/40 dark:text-paper/40">…</span>
            )}
            <button
              onClick={() => onPageChange(p)}
              className={`w-9 h-9 rounded-md text-sm transition-colors ${
                p === page
                  ? 'bg-gold text-white font-semibold'
                  : 'border border-ink-line/60 dark:border-ink-line hover:border-gold'
              }`}
            >
              {p}
            </button>
          </span>
        ))}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="w-9 h-9 rounded-md flex items-center justify-center border border-ink-line/60 dark:border-ink-line hover:border-gold disabled:opacity-30 disabled:hover:border-ink-line/60 transition-colors"
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}
