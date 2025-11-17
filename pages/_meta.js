const sectionTitle = (label) => (
  <span className="sidebar-label sidebar-label--section">{label}</span>
)

const overviewTitle = (label) => (
  <span className="sidebar-label sidebar-label--overview">{label}</span>
)

const sidebar = {
  index: {
    title: overviewTitle('Overview')
  },
  introduction: {
    title: sectionTitle('Introduction')
  },
  users: {
    title: sectionTitle('Users')
  },
  mechanics: {
    title: sectionTitle('Mechanics')
  },
  tokenomics: {
    title: sectionTitle('Tokenomics')
  },
  roadmap: {
    title: sectionTitle('Roadmap')
  }
}

export default sidebar
