'use client'

import { useRouter } from 'next/router'
import { useCallback, useState } from 'react'

const RAW_BASE = 'https://raw.githubusercontent.com/twentyOne2x/attnmarkets-docs/main/pages'
const DEFAULT_LABEL = 'Copy page'

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

  const copyPage = useCallback(async () => {
    if (busy) return
    const currentPath = router.asPath?.split('#')[0].split('?')[0] || '/'
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
  }, [busy, router.asPath])

  return (
    <button
      type="button"
      onClick={copyPage}
      disabled={busy}
      title="Copy this page's markdown"
      className="_inline-flex _items-center _gap-2 _rounded-md _border _border-white/10 _px-3 _py-1.5 _text-sm _font-medium _text-white/90 hover:_border-white/30 hover:_text-white focus:_outline-none focus:_ring-2 focus:_ring-white/50 disabled:_opacity-60"
    >
      <span aria-live="polite">{label}</span>
    </button>
  )
}
