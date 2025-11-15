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
