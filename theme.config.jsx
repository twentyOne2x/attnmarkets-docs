/**
 * Nextra docs theme configuration for attn.markets docs.
 * See: https://nextra.site/docs/docs-theme/theme-configuration
 */

import { useRouter } from 'next/router'
import { useConfig } from 'nextra-theme-docs'
import CopyPageButton from './components/CopyPageButton.jsx'

const config = {
  logo: <span>attn.markets docs</span>,

  project: {
    link: 'https://github.com/twentyOne2x/attnmarkets-docs'
  },

  // Used for "Edit this page" / "Feedback" links in the UI
  // Point it at the root of your docs pages in the repo.
  docsRepositoryBase:
    'https://github.com/twentyOne2x/attnmarkets-docs/tree/main/pages',

  // Custom <head> – this fully controls <title>, so we drop the " - Nextra" suffix
  head() {
    const { asPath } = useRouter()
    const { frontMatter, title: pageTitle } = useConfig()

    // Page title: front matter > computed page title > fallback
    const title =
      frontMatter?.title || pageTitle || 'attn.markets docs'

    const url = 'https://docs.attn.markets' + asPath
    const description =
      frontMatter?.description ||
      'attn turns onchain revenues into cash advances, credit lines, and attnUSD. attn.markets documentation.'

    return (
      <>
        <title>{title}</title>
        <meta property="og:title" content={title} />
        <meta property="og:url" content={url} />
        <meta name="description" content={description} />
        <meta property="og:description" content={description} />
      </>
    )
  },

  // Dark mode + theme behavior
  darkMode: true,
  nextThemes: {
    defaultTheme: 'dark',        // dark by default
    storageKey: 'attn-docs-theme'
    // enableSystem: false      // uncomment to ignore OS theme
  },

  primaryHue: 210, // blue-ish accent, tweak later if you like

  // Sidebar & TOC behavior
  sidebar: {
    defaultMenuCollapseLevel: 3 // keep all nested sections expanded
  },

  main({ children }) {
    return (
      <div className="attn-page-shell">
        <div className="attn-copy-row">
          <CopyPageButton />
        </div>
        {children}
      </div>
    )
  },

  toc: {
    float: true
  },

  footer: {
    text: 'attn.markets – revenues, tokenised.'
  },

  // Search placeholder text
  search: {
    placeholder: 'Search attn docs…'
  }
}

export default config
