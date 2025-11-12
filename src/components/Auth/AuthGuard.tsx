import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

interface AuthGuardProps {
  children: React.ReactNode
  redirectTo?: string
}

export function AuthGuard({ children, redirectTo = '/auth' }: AuthGuardProps) {
  const { user, loading } = useAuth()

  if (loading) {
    return null
  }

  if (!user) {
    return <Navigate to={redirectTo} replace />
  }

  return <>{children}</>
}