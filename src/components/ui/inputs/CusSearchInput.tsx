import { useEffect, useRef, type InputHTMLAttributes } from 'react'
import { Search } from 'lucide-react'
import { cn } from '@/utils/cn'

interface CusSearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** ⌘K / Ctrl+K bilan fokus qilish va yorliqni ko'rsatish */
  shortcut?: boolean
}

export function CusSearchInput({
  className,
  placeholder = 'Search or type command...',
  shortcut,
  ...props
}: CusSearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!shortcut) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        inputRef.current?.focus()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [shortcut])

  return (
    <label
      className={cn(
        'relative flex h-10 w-full items-center rounded-control border border-border bg-transparent shadow-xs transition-colors',
        'focus-within:border-primary/60 focus-within:shadow-focus dark:bg-white/3',
        className,
      )}
    >
      <Search className="pointer-events-none absolute left-4 size-5 text-muted" strokeWidth={1.8} />
      <input
        ref={inputRef}
        type="search"
        placeholder={placeholder}
        className={cn(
          'h-full w-full bg-transparent pl-12 text-sm text-heading outline-none placeholder:text-subtle',
          shortcut ? 'pr-16' : 'pr-4',
        )}
        {...props}
      />
      {shortcut && (
        <kbd className="pointer-events-none absolute right-2.5 inline-flex items-center gap-0.5 rounded-control border border-border bg-body px-2 py-1 font-sans text-xs text-muted">
          ⌘ K
        </kbd>
      )}
    </label>
  )
}
