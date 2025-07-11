'use client'

import { useState } from 'react'
import styles from './login.module.css'
import "../../app/globals.css";
import { useAuth } from '@/hooks/useAuth';
import Spinner from '@/components/ui/spinner';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { loading, login, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await login({ email, password })
    } catch (err) {
      console.error('Error en login:', err)
    }
    finally {
    }
  }

  return (
    <div className={styles['page-wrapper']}>
      <div className={styles['bg-login']}>
        <img className={styles.imgBg} src="/fondo2.jpg" alt="Fondo de login" />
      </div>
      <div className={styles['container-login']}>
        <div className={styles.box}>
          <div className={styles.login}>
            <form className={styles.loginBx} onSubmit={handleSubmit}>
              <img src="/logo.png" className={styles.imgLogo} alt="Logo" />
              <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <input type="submit" value="Ingresar" />
              {error && <p className="error-message">{error}</p>}

            </form>
          </div>
        </div>
      </div>
      {loading && <div className="spinnerOverlay"><Spinner /></div>}
    </div>
  )
}