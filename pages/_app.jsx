import 'nextra-theme-docs/style.css'
import { Analytics } from '@vercel/analytics/react'
import SidebarFolderNavigationBridge from '../components/SidebarFolderNavigationBridge.jsx'
import '../styles/sidebar.css'

// Custom App required by Nextra v3 to include the theme styles
export default function App({ Component, pageProps }) {
  return (
    <>
      <SidebarFolderNavigationBridge />
      <Component {...pageProps} />
      <Analytics />
    </>
  )
}
