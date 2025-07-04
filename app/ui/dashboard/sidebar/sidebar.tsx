import {
  MdDashboard,
  MdSupervisedUserCircle,
  MdAnalytics,
  MdPeople,
  MdOutlineSettings,
  MdLogout,
} from "react-icons/md";
import styles from "./sidebar.module.css";
import { MenuSection } from '@/app/types/menu';
import MenuLink from './menuLink/menuLink';
import { useAuth } from '@/app/hooks/useAuth'

const menuItems: MenuSection[] = [
  {
    title: "Secciones",
    list: [
      {
        title: "Panel",
        path: "/dashboard",
        icon: <MdDashboard />,
      },
      {
        title: "Usuarios",
        path: "/dashboard/users",
        icon: <MdSupervisedUserCircle />,
      },
    ],
  },
  {
    title: "Analytics",
    list: [
      {
        title: "Reportes",
        path: "/dashboard/reports",
        icon: <MdAnalytics />,
      },
      {
        title: "Equipos",
        path: "/dashboard/teams",
        icon: <MdPeople />,
      },
    ],
  },
  {
    title: "Usuario",
    list: [
      {
        title: "Configuración",
        path: "/dashboard/settings",
        icon: <MdOutlineSettings />,
      },
    ],
  },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  if (!user) return null;

  return (
    <div className={styles.sidebar}>
      <div className={styles.containerLogo}>
        <img src="/logo2.png" className={styles.imgLogo} alt="Logo" />
        <div className={styles.titles}>
          <h2>Portal RRH</h2>
          <span>Sistema de gestion</span>
        </div>
      </div>
      <div className={styles.containerSections}>
        <div className={styles.sectionMenu}>
          <ul className={styles.list}>
            {menuItems.map((cat) => (
              <li key={cat.title}>
                <span className={styles.cat}>{cat.title}</span>
                {cat.list.map((item) => (
                  <MenuLink item={item} key={item.title} />
                ))}
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.sectionLogout}>
          <form>
            <button className={styles.logout} onClick={logout}>
              <MdLogout />
              <span>Cerrar Sesión</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}