import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

interface LandingGuardProps {
  children: React.ReactNode
}

export function LandingGuard({ children }: LandingGuardProps) {
  const { user, loading } = useAuth()

  if (loading) {
    // No loader: render nothing while auth state resolves.
    return null
  }

  // If user is logged in, redirect to home page
  if (user) {
    return <Navigate to="/home" replace />
  }

  return <>{children}</>
}
