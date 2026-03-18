const itemTitle = (label) => (
  <span className="sidebar-label sidebar-label--item">{label}</span>
)

const sidebar = {
  index: {
    title: itemTitle('Overview')
  },
  'artemis-agentic-commerce-index': {
    title: itemTitle('Artemis Commerce Index')
  },
  'colossus-docs-index': {
    title: itemTitle('Colossus Docs Index')
  }
}

export default sidebar
