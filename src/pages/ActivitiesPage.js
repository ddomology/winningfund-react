import { createElement } from 'react'
import RoutePlaceholder from '../components/RoutePlaceholder.js'

export default function ActivitiesPage() {
  return createElement(RoutePlaceholder, {
    index: '04',
    title: 'ACTIVITIES',
    pathname: '/activities',
  })
}
