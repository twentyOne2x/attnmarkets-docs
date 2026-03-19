const itemTitle = (label) => (
  <span className="sidebar-label sidebar-label--item">{label}</span>
)

const sidebar = {
  index: {
    title: itemTitle('Audience overview')
  },
  'for-apps-daos-and-builders': {
    title: itemTitle('Agents & Apps')
  },
  'for-creators-devs-and-ctos': {
    title: itemTitle('Devs, Creators & CTOs')
  },
  'for-launchpads-and-incubators': {
    title: itemTitle('Launchpads')
  },
  'for-liquidity-providers': {
    title: itemTitle('Liquidity providers')
  },
  'for-cards-and-commerce-partners': {
    title: itemTitle('Cards & Commerce')
  }
}

export default sidebar
