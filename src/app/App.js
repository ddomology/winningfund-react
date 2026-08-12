import { createElement } from 'react'
import { Route, Routes } from 'react-router'
import AppShell from './AppShell.js'
import HomePage from '../pages/HomePage.js'
import AboutPage from '../pages/AboutPage.js'
import MembersPage from '../pages/MembersPage.js'
import ActivitiesPage from '../pages/ActivitiesPage.js'
import RecruitmentPage from '../pages/RecruitmentPage.js'
import NotFoundPage from '../pages/NotFoundPage.js'

export default function App() {
  return createElement(
    Routes,
    null,
    createElement(
      Route,
      { element: createElement(AppShell) },
      createElement(Route, {
        index: true,
        element: createElement(HomePage),
      }),
      createElement(Route, {
        path: 'about',
        element: createElement(AboutPage),
      }),
      createElement(Route, {
        path: 'members',
        element: createElement(MembersPage),
      }),
      createElement(Route, {
        path: 'activities',
        element: createElement(ActivitiesPage),
      }),
      createElement(Route, {
        path: 'recruitment',
        element: createElement(RecruitmentPage),
      }),
      createElement(Route, {
        path: '*',
        element: createElement(NotFoundPage),
      }),
    ),
  )
}
