import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { IconBrandGoogle } from '@tabler/icons-react'
import { Loader2 } from 'lucide-react'
import { SEO } from '@/components/SEO'

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  )
}

export function AuthPage() {
  const [isLoading, setIsLoading] = useState(false)
  const { loginWithGoogle } = useAuth()
  const navigate = useNavigate()

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true)
      await loginWithGoogle()
      navigate('/home')
    } catch (error: any) {
      console.error('Google login error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <SEO 
        title="Sign In"
        description="Sign in to Repo Scout to discover amazing open source projects and start making meaningful contributions to the community."
        keywords="sign in, login, GitHub authentication, open source login"
      />
      
      <div className="shadow-input mx-auto w-full max-w-md rounded-2xl bg-black p-8 border border-gray-800">
        {/* Logo and Title */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <img src="/repo_logo.png" alt="Repo Scout logo" className="h-12 w-12 rounded-full object-cover shadow" />
        </div>
        
        <h2 className="text-3xl font-bold text-center text-white font-instrument mb-2">
          Welcome to Repo Scout
        </h2>
        <p className="mt-2 max-w-sm text-center text-sm text-gray-400 mx-auto mb-8">
          Sign in to discover amazing open source projects and start contributing
        </p>

        <div className="flex flex-col space-y-4">
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="group/btn shadow-input relative flex h-12 w-full items-center justify-center space-x-2 rounded-md bg-zinc-900 px-4 font-medium text-white shadow-[0px_0px_1px_1px_#262626] hover:shadow-[0px_0px_1px_1px_#404040] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            type="button"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin text-gray-300" />
            ) : (
              <IconBrandGoogle className="h-5 w-5 text-gray-300" />
            )}
            <span className="text-sm text-gray-300">
              Continue with Google
            </span>
            <BottomGradient />
          </button>
        </div>

        <p className="text-xs text-center text-gray-500 mt-8">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}

export default AuthPage