'use client'

import { loginUser } from '@/app/services/auth'
import { LoginFormValues } from '@/app/types/login'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Cookies from 'js-cookie'

export function useAuth() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)  // <- Empieza en true
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<{ email: string, token: string } | null>(null)

  const login = async (data: LoginFormValues) => {
    try {
      setLoading(true)
      setError(null)
      const res = await loginUser(data)
      if (res) {
        Cookies.set('token', res.token, { expires: 1 })
        localStorage.setItem('user', JSON.stringify(res.user))
        setUser({ ...res.user, token: res.token })
        await new Promise(resolve => setTimeout(resolve, 2000));
        router.replace('/dashboard')
      }
    } catch (err: any) {
      setError(err.message || 'Error en el login')
      throw err
    } finally {
  setTimeout(() => {
    setLoading(false);
  }, 1000);
}
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    Cookies.remove('token')
    setUser(null)
    router.push('/login')
  }

  // Verificar autenticación al cargar
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      console.log('Stored user:', storedUser);

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      setUser(null);
    } finally {
      setLoading(false)  // <- importante
    }
  }, [])

  return { user, login, logout, loading, error }
}
