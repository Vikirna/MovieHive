import React from 'react'
import ReactDOM from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import App from './App.jsx'
import './index.css'
import { ThemeProvider } from './context/ThemeContext'
import { LibraryProvider } from './context/LibraryContext'
import { CLERK_PUBLISHABLE_KEY, CLERK_ENABLED } from './lib/clerk'

if (!CLERK_ENABLED) {
  console.warn(
    'VITE_CLERK_PUBLISHABLE_KEY is missing or still a placeholder — running without login/signup. Add a real key from your Clerk dashboard to .env and restart the dev server.'
  )
}

const appTree = (
  <React.StrictMode>
    <ThemeProvider>
      <LibraryProvider>
        <App />
      </LibraryProvider>
    </ThemeProvider>
  </React.StrictMode>
)

ReactDOM.createRoot(document.getElementById('root')).render(
  CLERK_ENABLED ? (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY} afterSignOutUrl="/">
      {appTree}
    </ClerkProvider>
  ) : (
    appTree
  )
)
