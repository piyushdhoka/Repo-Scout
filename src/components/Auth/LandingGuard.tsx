import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

interface LandingGuardProps {
  children: React.ReactNode
}

export function LandingGuard({ children }: LandingGuardProps) {
  const { user, loading } = useAuth()

  if (loading) {
    
    return null
  }

  if (user) {
    return <Navigate to="/home" replace />
  }

  return <>{children}</>
}
