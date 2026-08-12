import { createElement } from 'react'
import RoutePlaceholder from '../components/RoutePlaceholder.js'

export default function MembersPage() {
  return createElement(RoutePlaceholder, {
    index: '03',
    title: 'MEMBERS',
    pathname: '/members',
  })
}
