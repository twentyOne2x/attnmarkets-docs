import nextra from 'nextra'

const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.jsx',
  // You can tweak these later if you want:
  // defaultShowCopyCode: true,
  // latex: true,
  // flexsearch: { codeblocks: false },
})

const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/attn-1-pager',
        destination: '/1-pager',
        permanent: true,
      },
    ]
  },
}

export default withNextra(nextConfig)
