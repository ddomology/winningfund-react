import { StrictMode, createElement } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import App from './app/App.js'
import './styles/reset.css'
import './styles/brand-foundation.css'
import './styles/app-shell.css'
import './styles/page-transition.css'
import './styles/navigation.css'
import './styles/shared-primitives.css'
import './styles/home.css'
import './styles/about.css'
import './styles/members.css'
import './styles/activities.css'
import './styles/recruitment.css'
import './styles/route-hero-effects.css'
import './styles/placeholders.css'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('WinningFund application root #root was not found.')
}

createRoot(rootElement).render(
  createElement(
    StrictMode,
    null,
    createElement(
      BrowserRouter,
      {
        basename: import.meta.env.BASE_URL,
      },
      createElement(App),
    ),
  ),
)

