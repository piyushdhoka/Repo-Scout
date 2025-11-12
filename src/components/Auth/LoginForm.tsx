import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/hooks/useAuth'
import { Loader2, Mail, Github, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
})

type LoginFormData = z.infer<typeof loginSchema>

interface LoginFormProps {
  onTabChange: (tab: string) => void
}

export function LoginForm({ onTabChange }: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [loginSuccess, setLoginSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { login, loginWithGoogle } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange'
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true)
      await login(data.email, data.password)
    } catch (error: any) {
      // Error is already handled by useAuth hook
      console.error('Login error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true)
      await loginWithGoogle()
    } catch (error: any) {

      console.error('Google login error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md border-gray-800 bg-black">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-white">Welcome back</CardTitle>
        <CardDescription className="text-gray-400">
          Sign in to your account to continue
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-3">
          <Button
            variant="outline"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="border-gray-700 bg-gray-900 text-white hover:bg-gray-800"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Mail className="h-4 w-4 mr-2" />
            )}
            Google
          </Button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full border-gray-700" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-black px-2 text-gray-500">Or continue with email</span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                disabled={isLoading}
                className="w-full"
                {...register('email')}
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                disabled={isLoading}
                className="w-full"
                {...register('password')}
              />
              {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            disabled={isLoading || isSubmitting}
          >
            {isLoading || isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In to Your Account'
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <div className="text-sm text-gray-400">
          <button
            type="button"
            onClick={() => onTabChange('reset')}
            className="text-blue-400 hover:text-blue-300 hover:underline"
          >
            Forgot your password?
          </button>
        </div>
        <div className="text-sm text-gray-400">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={() => onTabChange('signup')}
            className="text-blue-400 hover:text-blue-300 hover:underline"
          >
            Sign up
          </button>
        </div>
      </CardFooter>
    </Card>
  )
}