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

  docsRepositoryBase:
    'https://github.com/twentyOne2x/attnmarkets-docs/tree/main/pages',

  head() {
    const { asPath } = useRouter()
    const { frontMatter, title: pageTitle } = useConfig()

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

  darkMode: true,
  nextThemes: {
    defaultTheme: 'dark',
    storageKey: 'attn-docs-theme'
  },

  primaryHue: 210,

  // Sidebar & TOC behavior
  sidebar: {
    defaultMenuCollapseLevel: 3,
    // Disable any CSS "capitalize" applied by the theme
    titleComponent({ title }) {
      return <span style={{ textTransform: 'none' }}>{title}</span>
    }
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

  search: {
    placeholder: 'Search attn docs…'
  }
}

export default config