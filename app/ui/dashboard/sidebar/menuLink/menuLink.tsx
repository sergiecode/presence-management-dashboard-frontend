"use client"

import { NextPage } from 'next'
import Link from 'next/link'
import styles from './menuLink.module.css'
import { usePathname } from 'next/navigation'
import { MenuItem } from '@/app/types/menu'

interface Props {
  item: MenuItem
}

const MenuLink: NextPage<Props> = ({ item }) => {
  const pathname = usePathname()

  return (
    <Link
      href={item.path}
      className={`${styles.container} ${pathname === item.path ? styles.active : ''}`}
    >
      {item.icon}
      {item.title}
    </Link>
  )
}

export default MenuLink
