const sectionTitle = (label) => (
  <span className="sidebar-label sidebar-label--section">{label}</span>
);

const overviewTitle = (label) => (
  <span className="sidebar-label sidebar-label--overview">{label}</span>
);

const socialLinkTitle = (icon, label) => (
  <span className="sidebar-social-link">
    <span className="sidebar-social-link__icon" aria-hidden="true">
      {icon}
    </span>
    <span className="sidebar-social-link__label">{label}</span>
  </span>
);

const GlobeIcon = (
  <svg viewBox="0 0 20 20" fill="none" width="16" height="16">
    <path
      d="M10 18.333A8.333 8.333 0 1 0 10 1.667a8.333 8.333 0 0 0 0 16.666Z"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M10 1.667c-2.084 2.5-3.125 5.417-3.125 8.75s1.041 6.25 3.125 8.75m0-17.5c2.083 2.5 3.125 5.417 3.125 8.75s-1.042 6.25-3.125 8.75M1.667 10h16.666"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const XIcon = (
  <svg viewBox="0 0 20 20" fill="none" width="16" height="16">
    <path
      d="m4.5 4.5 11 11m-11 0 11-11"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const TelegramIcon = (
  <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
    <path
      d="M21.5 3.5 2.5 10.2c-.7.25-.66 1.26.06 1.44l4.83 1.22a1 1 0 0 0 .96-.26L13 8l-3.37 4.3a.75.75 0 0 0 .2 1.1l6.2 3.6c.6.35 1.36-.02 1.49-.7l2.13-11.58c.16-.86-.64-1.56-1.35-1.22Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const GitHubIcon = (
  <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
    <path
      d="M12 2.5c-5.25 0-9.5 4.35-9.5 9.72 0 4.3 2.72 7.94 6.5 9.23.48.09.66-.21.66-.47 0-.23-.01-.99-.01-1.8-2.46.55-2.98-1.08-2.98-1.08-.44-1.15-1.08-1.45-1.08-1.45-.88-.62.07-.61.07-.61.97.07 1.48 1.03 1.48 1.03.86 1.5 2.24 1.07 2.79.82.09-.64.34-1.07.62-1.31-1.96-.23-4.01-1.01-4.01-4.51 0-.99.34-1.8.92-2.43-.09-.24-.4-1.2.09-2.5 0 0 .74-.24 2.43.94A8.16 8.16 0 0 1 12 7.54c.75.01 1.5.1 2.2.3 1.68-1.19 2.42-.94 2.42-.94.5 1.3.19 2.26.1 2.5.58.63.92 1.44.92 2.43 0 3.51-2.06 4.27-4.03 4.5.35.31.67.92.67 1.86 0 1.34-.01 2.42-.01 2.75 0 .26.17.57.66.47 3.77-1.29 6.5-4.93 6.5-9.23C21.5 6.85 17.25 2.5 12 2.5Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const sidebar = {
  website: {
    title: socialLinkTitle(GlobeIcon, 'Website'),
    href: 'https://attn.markets',
    newWindow: true,
    type: 'page'
  },
  twitter: {
    title: socialLinkTitle(XIcon, 'X (Twitter)'),
    href: 'https://x.com/attndotmarkets',
    newWindow: true,
    type: 'page'
  },
  telegram: {
    title: socialLinkTitle(TelegramIcon, 'Telegram'),
    href: 'https://t.me/twentyOne2x',
    newWindow: true,
    type: 'page'
  },
  github: {
    title: socialLinkTitle(GitHubIcon, 'GitHub'),
    href: 'https://github.com/twentyOne2x/attnmarket',
    newWindow: true,
    type: 'page'
  },
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
};

export default sidebar;
