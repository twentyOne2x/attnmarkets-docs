const itemTitle = (label) => (
  <span className="sidebar-label sidebar-label--item">{label}</span>
)

const sidebar = {
  index: {
    title: itemTitle('Tokenomics overview')
  },
  'tokenomics-overview': {
    title: itemTitle('Directional')
  }
}

export default sidebar
