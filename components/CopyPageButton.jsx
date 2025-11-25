'use client'

import { useRouter } from 'next/router'
import { useCallback, useState } from 'react'

const RAW_BASE =
  'https://raw.githubusercontent.com/twentyOne2x/attnmarkets-docs/main/pages'
const DEFAULT_LABEL = 'Copy page'

// Explicit list of all markdown files under /pages
const ALL_PAGE_FILES = [
  '/index.md',
  '/roadmap.md',

  // introduction
  '/introduction/banking-the-internet-of-revenue.md',
  '/introduction/the-missing-layer-for-onchain-revenues.md',
  '/introduction/vision-attn.md',
  '/introduction/where-attn-sits-next-to-avici-and-pye.md',
  '/introduction/who-attn-is-for.md',

  // mechanics
  '/mechanics/architecture-overview.md',
  '/mechanics/how-it-works-nontechnical.md',
  '/mechanics/pricing-and-parameters.md',
  '/mechanics/pt-yt-attnusd.md',
  '/mechanics/revenue-accounts-and-signing-model.md',
  '/mechanics/risk-and-limits.md',

  // tokenomics
  '/tokenomics/tokenomics-overview.md',

  // users
  '/users/for-apps-daos-and-builders.md',
  '/users/for-cards-and-commerce-partners.md',
  '/users/for-creators-devs-and-ctos.md',
  '/users/for-launchpads-and-incubators.md',
  '/users/for-liquidity-providers.md'
]

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
      {/* Single button: whole surface is one button, arrow is a sub-area */}
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
