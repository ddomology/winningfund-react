import { createElement } from 'react'
import RoutePlaceholder from '../components/RoutePlaceholder.js'

export default function AboutPage() {
  return createElement(RoutePlaceholder, {
    index: '02',
    title: 'ABOUT',
    pathname: '/about',
  })
}
