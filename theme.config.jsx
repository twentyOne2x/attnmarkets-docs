/**
 * Nextra docs theme configuration for attn.markets docs.
 * See: https://nextra.site/docs/docs-theme/theme-configuration
 */

const config = {
  logo: <span>attn.markets docs</span>,

  project: {
    link: 'https://github.com/twentyOne2x/attnmarkets-docs'
  },

  // Used for "Edit this page" / "Feedback" links in the UI
  // Point it at the root of your docs pages in the repo.
  docsRepositoryBase: 'https://github.com/twentyOne2x/attnmarkets-docs/tree/main/pages',

  // Default SEO title formatting
  useNextSeoProps() {
    return {
      titleTemplate: '%s – attn.markets docs'
    }
  },

  // Dark mode + theme behavior
  darkMode: true,
  nextThemes: {
    defaultTheme: 'dark',        // dark by default
    storageKey: 'attn-docs-theme'
    // enableSystem: false      // uncomment to ignore OS theme
  },

  primaryHue: 210, // blue-ish accent, tweak later if you like

  // Basic nav items (you can customize later)
  // These map to top navbar links.
  nav: {
    title: 'attn.markets docs'
  },

  // Sidebar & TOC behavior
  sidebar: {
    defaultMenuCollapseLevel: 3 // keep all nested sections expanded
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
