import { createElement } from 'react'
import RoutePlaceholder from '../components/RoutePlaceholder.js'

export default function RecruitmentPage() {
  return createElement(RoutePlaceholder, {
    index: '05',
    title: 'RECRUITMENT',
    pathname: '/recruitment',
  })
}
