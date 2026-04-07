const itemTitle = (label) => (
  <span className="sidebar-label sidebar-label--item">{label}</span>
)

const sidebar = {
  'for-apps-daos-and-builders': {
    title: itemTitle('Agent builders & apps')
  },
  'for-creators-devs-and-ctos': {
    title: itemTitle('Revenue today')
  },
  'for-launchpads-and-incubators': {
    title: itemTitle('Launchpads & incubators')
  },
  'partner-managed-creator-fee-integration': {
    title: itemTitle('Creator-fee integration')
  },
  'for-liquidity-providers': {
    title: itemTitle('Liquidity providers')
  },
  'for-cards-and-commerce-partners': {
    title: itemTitle('Cards & commerce')
  }
}

export default sidebar
