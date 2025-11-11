import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import Loader from '@/components/Loader'

interface LandingGuardProps {
  children: React.ReactNode
}

export function LandingGuard({ children }: LandingGuardProps) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader />
      </div>
    )
  }

  // If user is logged in, redirect to home page
  if (user) {
    return <Navigate to="/home" replace />
  }

  return <>{children}</>
}
