#!/usr/bin/env bash
set -euo pipefail

# 0) Go to repo root (adjust path if needed)
cd "$(dirname "$0")"

echo "[1/7] Initializing package.json for Next + Nextra"

# This overwrites any existing package.json
cat > package.json << 'JSON'
{
  "name": "attn-docs",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "13.5.6",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "nextra": "^3.0.0",
    "nextra-theme-docs": "^3.0.0"
  }
}
JSON

echo "[2/7] Installing dependencies (this may take a bit)…"
npm install

echo "[3/7] Renaming docs/ -> pages/ for Next.js routing"
if [ -d "pages" ]; then
  echo "ERROR: 'pages' directory already exists. Move or remove it and re-run."
  exit 1
fi

if [ -d "docs" ]; then
  mv docs pages
else
  echo "ERROR: 'docs' directory not found. You should run this from the repo root where ./docs exists."
  exit 1
fi

echo "[4/7] Creating next.config.mjs with Nextra docs theme"

cat > next.config.mjs << 'EOF_NEXT'
import nextra from 'nextra'

const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.jsx',
  // You can tweak these later if you want:
  // defaultShowCopyCode: true,
  // latex: true,
  // flexsearch: { codeblocks: false },
})

export default withNextra({
  reactStrictMode: true
})
EOF_NEXT

echo "[5/7] Creating theme.config.jsx (dark mode default)"

cat > theme.config.jsx << 'EOF_THEME'
/**
 * Nextra docs theme configuration for attn.markets docs.
 * See: https://nextra.site/docs/docs-theme/theme-configuration
 */

const config = {
  logo: <span>attn.markets docs</span>,

  project: {
    // Update this to your actual GitHub repo once it’s live
    link: 'https://github.com/YOUR_GITHUB_ORG/attnmarkets-docs'
  },

  // Used for "Edit this page" / "Feedback" links in the UI
  // Point it at the root of your docs pages in the repo.
  docsRepositoryBase: 'https://github.com/YOUR_GITHUB_ORG/attnmarkets-docs/tree/main/pages',

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
    defaultMenuCollapseLevel: 1
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
EOF_THEME

echo "[6/7] Adding a basic .gitignore (append if exists)"

if [ -f ".gitignore" ]; then
  cat >> .gitignore << 'EOF_GIT'
node_modules
.next
out
.DS_Store
EOF_GIT
else
  cat > .gitignore << 'EOF_GIT'
node_modules
.next
out
.DS_Store
EOF_GIT
fi

echo "[7/7] Quick sanity check: ensure there is a pages/README.md as home"

# If there's a README.md in pages/, use that as index.
if [ -f "pages/README.md" ] && [ ! -f "pages/index.mdx" ] && [ ! -f "pages/index.md" ]; then
  cp pages/README.md pages/index.md
fi

echo
echo "Done. Next steps:"
echo "  1) Run: npm run dev"
echo "  2) Open: http://localhost:3000"
echo "You should see your docs with a sidebar, search, and dark mode by default."
