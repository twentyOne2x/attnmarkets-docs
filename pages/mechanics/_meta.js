const itemTitle = (label) => (
  <span className="sidebar-label sidebar-label--item">{label}</span>
)

const sidebar = {
  index: {
    title: itemTitle('System overview')
  },
  'how-it-works-nontechnical': {
    title: itemTitle('How it works')
  },
  'architecture-overview': {
    title: itemTitle('Architecture')
  },
  'revenue-accounts-and-signing-model': {
    title: itemTitle('Revenue accounts')
  },
  'pt-yt-attnusd': {
    title: itemTitle('attn Credit engine')
  },
  'risk-and-limits': {
    title: itemTitle('Risk & limits')
  },
  'pricing-and-parameters': {
    title: itemTitle('Pricing & params')
  }
}

export default sidebar
