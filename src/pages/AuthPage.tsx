import { useState } from 'react'
import { LoginForm } from '@/components/Auth/LoginForm'
import { SignupForm } from '@/components/Auth/SignupForm'
import { PasswordResetForm } from '@/components/Auth/PasswordResetForm'

type AuthView = 'login' | 'signup' | 'reset'

export function AuthPage() {
  const [currentView, setCurrentView] = useState<AuthView>('login')

  const handleViewChange = (view: string) => {
    setCurrentView(view as AuthView)
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Repo Scout</h1>
          <p className="text-gray-400">Find your next open source contribution</p>
        </div>

        <div className="w-full">
          {currentView === 'login' && <LoginForm onTabChange={handleViewChange} />}
          {currentView === 'signup' && <SignupForm onTabChange={handleViewChange} />}
          {currentView === 'reset' && <PasswordResetForm onTabChange={handleViewChange} />}
        </div>
      </div>
    </div>
  )
}

export default AuthPage