'use client'

import { useRouter } from 'next/router'
import { useCallback, useState } from 'react'

// Import meta files to derive ordering
import rootMeta from '../pages/_meta'
import introductionMeta from '../pages/introduction/_meta'
import mechanicsMeta from '../pages/mechanics/_meta'
import tokenomicsMeta from '../pages/tokenomics/_meta'
import usersMeta from '../pages/users/_meta'

const RAW_BASE =
  'https://raw.githubusercontent.com/twentyOne2x/attnmarkets-docs/main/pages'
const DEFAULT_LABEL = 'Copy page'

// Build the list of all .md files in the order defined by _meta.js
const buildAllPageFiles = () => {
  const files = []

  const rootOrder = Object.keys(rootMeta)

  rootOrder.forEach((key) => {
    if (key === 'index') {
      files.push('/index.md')
      return
    }

    if (key === 'introduction') {
      Object.keys(introductionMeta).forEach((slug) => {
        files.push(`/introduction/${slug}.md`)
      })
      return
    }

    if (key === 'users') {
      Object.keys(usersMeta).forEach((slug) => {
        files.push(`/users/${slug}.md`)
      })
      return
    }

    if (key === 'mechanics') {
      Object.keys(mechanicsMeta).forEach((slug) => {
        files.push(`/mechanics/${slug}.md`)
      })
      return
    }

    if (key === 'tokenomics') {
      Object.keys(tokenomicsMeta).forEach((slug) => {
        files.push(`/tokenomics/${slug}.md`)
      })
      return
    }

    if (key === 'roadmap') {
      files.push('/roadmap.md')
      return
    }
  })

  return files
}

const ALL_PAGE_FILES = buildAllPageFiles()

// Format the combined clipboard text with a tree + per-file delimiters + ``` blocks
const formatAllPagesClipboard = (fileEntries) => {
  const treeSectionLines = [
    'DOC TREE',
    '========',
    ...fileEntries.map(({ filePath }) => filePath),
    '========',
    '',
  ]

  const fileSections = fileEntries.map(({ filePath, text }) => {
    return [
      `----- FILE START: ${filePath} -----`,
      '',
      '```markdown',
      text.trim(),
      '```',
      '',
      `----- FILE END: ${filePath} -----`,
      '',
    ].join('\n')
  })

  return [...treeSectionLines, ...fileSections].join('\n')
}

const normalizePath = (path) => {
  if (!path || path === '/') {
    return '/index'
  }
  const cleaned = path.replace(/\/$/, '')
  return cleaned.length ? cleaned : '/index'
}

export default function CopyPageButton() {
  const router = useRouter()
  const [label, setLabel] = useState(DEFAULT_LABEL)
  const [busy, setBusy] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const copyPage = useCallback(
    async () => {
      if (busy) return

      const currentPath =
        router.asPath?.split('#')[0].split('?')[0] || '/'
      const filePath = `${normalizePath(currentPath)}.md`
      const rawUrl = `${RAW_BASE}${filePath}`

      try {
        setBusy(true)
        setLabel('Copying…')

        const res = await fetch(rawUrl)
        if (!res.ok) throw new Error(`Failed to fetch ${rawUrl}`)

        const text = await res.text()
        if (!navigator?.clipboard) {
          throw new Error('Clipboard API unavailable')
        }

        await navigator.clipboard.writeText(text)
        setLabel('Copied!')
      } catch (error) {
        console.error('[CopyPageButton]', error)
        setLabel('Copy failed')
      } finally {
        setBusy(false)
        setTimeout(() => setLabel(DEFAULT_LABEL), 2000)
      }
    },
    [busy, router.asPath]
  )

  const copyAllPages = useCallback(
    async () => {
      if (busy) return

      if (!ALL_PAGE_FILES.length) {
        setLabel('No pages to copy')
        setTimeout(() => setLabel(DEFAULT_LABEL), 2000)
        return
      }

      try {
        setBusy(true)
        setLabel('Copying all…')

        const fileEntries = await Promise.all(
          ALL_PAGE_FILES.map(async (filePath) => {
            const rawUrl = `${RAW_BASE}${filePath}`
            const res = await fetch(rawUrl)
            if (!res.ok) {
              throw new Error(`Failed to fetch ${rawUrl}`)
            }
            const text = await res.text()
            return { filePath, text }
          })
        )

        const combined = formatAllPagesClipboard(fileEntries)

        if (!navigator?.clipboard) {
          throw new Error('Clipboard API unavailable')
        }

        await navigator.clipboard.writeText(combined)
        setLabel('Copied all!')
      } catch (error) {
        console.error('[CopyPageButton:copyAllPages]', error)
        setLabel('Copy all failed')
      } finally {
        setBusy(false)
        setTimeout(() => setLabel(DEFAULT_LABEL), 2000)
      }
    },
    [busy]
  )

  const handleCopyPageClick = async () => {
    setMenuOpen(false)
    await copyPage()
  }

  const handleArrowClick = (event) => {
    event.stopPropagation()
    event.preventDefault()
    setMenuOpen((open) => !open)
  }

  const handleCopyAllClick = async () => {
    setMenuOpen(false)
    await copyAllPages()
  }

  return (
    <div className="_relative _inline-block">
      {/* Main pill button (slightly smaller) */}
      <button
        type="button"
        onClick={handleCopyPageClick}
        disabled={busy}
        title="Copy this page's markdown"
        className="_inline-flex _items-center _gap-2 _rounded-full _border _border-white/10 _bg-black/40 _px-3 _py-1 _text-xs _font-medium _text-white/90 hover:_bg-white/10 focus:_outline-none focus:_ring-2 focus:_ring-white/50 disabled:_opacity-60"
      >
        <span aria-live="polite" className="_mr-1">
          {label}
        </span>

        {/* Arrow pill: circle + arrow glyph, arrow nudged up slightly */}
        <span
          role="button"
          aria-label="Copy options"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          onClick={handleArrowClick}
          className="_inline-flex _items-center _justify-center _ml-1"
        >
          <span className="_inline-flex _items-center _justify-center _h-7 _px-3 _rounded-full _border _border-white/20 _bg-white/0 _text-2xl _font-semibold _text-white/90 hover:_bg-white/10">
            <span
              style={{ position: 'relative', top: '-1px' }}
              className="leading-none"
            >
              {menuOpen ? '▾' : '▸'}
            </span>
          </span>
        </span>
      </button>

      {/* Dropdown: wider + more padded items */}
      {menuOpen && (
        <div className="_absolute _right-0 _z-20 _mt-1 _w-56 _overflow-hidden _rounded-lg _border _border-white/10 _bg-black/95 _shadow-xl">
          <button
            type="button"
            onClick={handleCopyPageClick}
            disabled={busy}
            className="_block _w-full _px-5 _py-3.5 _text-left _text-base _text-white/90 hover:_bg-white/10 disabled:_opacity-60"
          >
            Copy this page
          </button>
          <button
            type="button"
            onClick={handleCopyAllClick}
            disabled={busy}
            className="_block _w-full _px-5 _py-3.5 _text-left _text-base _text-white/90 hover:_bg-white/10 disabled:_opacity-60"
          >
            Copy all pages
          </button>
        </div>
      )}
    </div>
  )
}
