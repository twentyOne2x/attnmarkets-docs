const itemTitle = (label) => (
  <span className="sidebar-label sidebar-label--item">{label}</span>
)

const sidebar = {
  'for-apps-daos-and-builders': {
    title: itemTitle('Apps & DAOs')
  },
  'for-creators-devs-and-ctos': {
    title: itemTitle('Creators & CTOs')
  },
  'for-launchpads-and-incubators': {
    title: itemTitle('Launchpads')
  },
  'for-liquidity-providers': {
    title: itemTitle('Liquidity providers')
  }
}

export default sidebar
