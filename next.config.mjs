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
      {
        source: '/introduction',
        destination: '/introduction/the-missing-layer-for-onchain-revenues',
        permanent: false,
      },
      {
        source: '/users',
        destination: '/users/for-apps-daos-and-builders',
        permanent: false,
      },
      {
        source: '/mechanics',
        destination: '/mechanics/how-it-works-nontechnical',
        permanent: false,
      },
      {
        source: '/tokenomics',
        destination: '/tokenomics/tokenomics-overview',
        permanent: false,
      },
      {
        source: '/introduction/where-attn-sits-next-to-avici-and-pye',
        destination: '/introduction/attn-in-context',
        permanent: true,
      },
    ]
  },
}

export default withNextra(nextConfig)
