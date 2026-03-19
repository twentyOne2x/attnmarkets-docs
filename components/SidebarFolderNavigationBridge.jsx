import { useEffect } from 'react'
function normalizePath(path) {
  return path.split('#')[0].split('?')[0].replace(/\/+$/, '') || '/'
}

function isPlainPrimaryClick(event) {
  return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.altKey && !event.shiftKey
}

export default function SidebarFolderNavigationBridge() {
  useEffect(() => {
    function handleClick(event) {
      if (!isPlainPrimaryClick(event)) return
      if (!(event.target instanceof Element)) return

      const button = event.target.closest('.nextra-sidebar-container button[data-href]')
      if (!button) return

      // Preserve the built-in expand/collapse behavior when the chevron itself is clicked.
      if (event.target.closest('svg, path')) return

      const href = button.getAttribute('data-href')
      if (!href) return

      const currentPath = normalizePath(window.location.pathname)
      const nextPath = normalizePath(href)
      if (currentPath === nextPath) return

      event.preventDefault()
      event.stopPropagation()
      window.location.assign(href)
    }

    document.addEventListener('click', handleClick, true)
    return () => {
      document.removeEventListener('click', handleClick, true)
    }
  }, [])

  return null
}
