import nextra from 'nextra'

const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.jsx',
  // defaultShowCopyCode, latex, flexsearch, etc. can be added later
})

const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/1-pager',
        permanent: false,
      },
      {
        source: '/attn-1-pager',
        destination: '/1-pager',
        permanent: true,
      },
    ]
  },
}

export default withNextra(nextConfig)
