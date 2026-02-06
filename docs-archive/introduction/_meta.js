const itemTitle = (label) => (
  <span className="sidebar-label sidebar-label--item">{label}</span>
)

const sidebar = {
  'the-missing-layer-for-onchain-revenues': {
    title: itemTitle('Missing layer')
  },
  'banking-the-internet-of-revenue': {
    title: itemTitle('Banking revenue')
  },
  'vision-attn': {
    title: itemTitle('Vision')
  },
  'attn-in-context': {
    title: itemTitle('attn in context')
  },
  'who-attn-is-for': {
    title: itemTitle("Who it's for")
  }
}

export default sidebar
