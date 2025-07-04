import { ReactNode } from 'react'

export type MenuItem = {
  title: string
  path: string
  icon: ReactNode
}

export type MenuSection = {
  title: string
  list: MenuItem[]
}
