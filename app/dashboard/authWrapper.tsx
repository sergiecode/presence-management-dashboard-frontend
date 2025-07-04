'use client'

import Navbar from "../ui/dashboard/navbar/navbar";
import Sidebar from "../ui/dashboard/sidebar/sidebar";
import styles from "../ui/dashboard/dashboard.module.css"
import { useAuth } from "../hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Si ya cargó y no hay usuario, redirige al login
    if (!loading && !user) {
      router.replace('/login')
    }
  }, [loading, user, router])

  return (
    <div className={styles.container}>
      <div className={styles.bgDashboard}>
        <img className={styles.imgBgDash} src="/fondo2.jpg" alt="Fondo de dashboard" />
      </div>
      <div className={styles.menu}>
        <Sidebar />
      </div>
      <div className={styles.content}>
        <div className={styles.box1}>
          <Navbar />
        </div>
        <div className={styles.box2}>
          {children}
        </div>
      </div>
    </div>
  );
}
