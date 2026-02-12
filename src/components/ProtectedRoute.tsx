'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase-client'
import LoginForm from './LoginForm'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: 'admin' | 'user'
}

export default function ProtectedRoute({ children, requiredRole = 'user' }: ProtectedRouteProps) {
  const supabase = createClient()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function checkAuth() {
      try {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
          setError('Требуется авторизация')
          setLoading(false)
          return
        }

        // Check admin role if required
        if (requiredRole === 'admin') {
          const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || process.env.ADMIN_EMAIL
          if (user.email !== adminEmail) {
            setError('Доступ только для администратора')
            setLoading(false)
            return
          }
        }

        setIsAuthorized(true)
        setLoading(false)
      } catch (err) {
        console.error('Auth check error:', err)
        setError('Ошибка при проверке авторизации')
        setLoading(false)
      }
    }

    checkAuth()
  }, [supabase, requiredRole])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <p className="text-lg">Проверка авторизации...</p>
      </div>
    )
  }

  if (error || !isAuthorized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <div className="w-96">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            {error === 'Требуется авторизация' ? 'Войдите в аккаунт' : 'Доступ запрещен'}
          </h2>
          
          {error === 'Требуется авторизация' ? (
            <>
              <p className="text-gray-600 text-center mb-6">
                Для доступа необходимо авторизоваться
              </p>
              <LoginForm />
            </>
          ) : (
            <p className="text-red-600 text-center font-semibold">{error}</p>
          )}
        </div>
      </div>
    )
  }

  return <>{children}</>
}
