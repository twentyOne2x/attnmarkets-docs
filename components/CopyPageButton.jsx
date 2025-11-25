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

  // Root meta defines section order:
  // website, twitter, telegram, github, index, introduction, users, mechanics, tokenomics, roadmap
  const rootOrder = Object.keys(rootMeta)

  rootOrder.forEach((key) => {
    if (key === 'index') {
      // Top-level overview page
      files.push('/index.md')
      return
    }

    if (key === 'introduction') {
      // Pages under /introduction in introduction/_meta.js order
      Object.keys(introductionMeta).forEach((slug) => {
        files.push(`/introduction/${slug}.md`)
      })
      return
    }

    if (key === 'users') {
      // Pages under /users in users/_meta.js order
      Object.keys(usersMeta).forEach((slug) => {
        files.push(`/users/${slug}.md`)
      })
      return
    }

    if (key === 'mechanics') {
      // Pages under /mechanics in mechanics/_meta.js order
      Object.keys(mechanicsMeta).forEach((slug) => {
        files.push(`/mechanics/${slug}.md`)
      })
      return
    }

    if (key === 'tokenomics') {
      // Pages under /tokenomics in tokenomics/_meta.js order
      Object.keys(tokenomicsMeta).forEach((slug) => {
        files.push(`/tokenomics/${slug}.md`)
      })
      return
    }

    if (key === 'roadmap') {
      // Single top-level roadmap page, appears last as in rootMeta
      files.push('/roadmap.md')
      return
    }

    // Everything else (website, twitter, telegram, github, etc.) is ignored
  })

  return files
}

const ALL_PAGE_FILES = buildAllPageFiles()

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

        const texts = await Promise.all(
          ALL_PAGE_FILES.map(async (filePath) => {
            const rawUrl = `${RAW_BASE}${filePath}`
            const res = await fetch(rawUrl)
            if (!res.ok) {
              throw new Error(`Failed to fetch ${rawUrl}`)
            }
            return res.text()
          })
        )

        const combined = texts.join('\n\n---\n\n')

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
      {/* Single button: main action + inline caret */}
      <button
        type="button"
        onClick={handleCopyPageClick}
        disabled={busy}
        title="Copy this page's markdown"
        className="_inline-flex _items-center _gap-2 _rounded-md _border _border-white/10 _bg-black/40 _px-3 _py-1.5 _text-sm _font-medium _text-white/90 hover:_bg-white/10 focus:_outline-none focus:_ring-2 focus:_ring-white/50 disabled:_opacity-60"
      >
        <span aria-live="polite" className="_mr-1">
          {label}
        </span>
        <span
          role="button"
          aria-label="Copy options"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          onClick={handleArrowClick}
          className="_inline-flex _items-center _justify-center _px-1.5 _py-0.5 _text-xs _text-white/70 hover:_bg-white/10 _rounded-sm"
        >
          ▾
        </span>
      </button>

      {menuOpen && (
        <div className="_absolute _right-0 _z-20 _mt-1 _w-44 _overflow-hidden _rounded-md _border _border-white/10 _bg-black/90 _shadow-lg">
          <button
            type="button"
            onClick={handleCopyPageClick}
            disabled={busy}
            className="_block _w-full _px-3 _py-2 _text-left _text-sm _text-white/90 hover:_bg-white/10 disabled:_opacity-60"
          >
            Copy this page
          </button>
          <button
            type="button"
            onClick={handleCopyAllClick}
            disabled={busy}
            className="_block _w-full _px-3 _py-2 _text-left _text-sm _text-white/90 hover:_bg-white/10 disabled:_opacity-60"
          >
            Copy all pages
          </button>
        </div>
      )}
    </div>
  )
}