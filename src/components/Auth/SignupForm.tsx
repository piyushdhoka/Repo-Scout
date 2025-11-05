import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/hooks/useAuth'
import { Loader2, Mail, Github, CheckCircle2, XCircle } from 'lucide-react'

const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  confirmPassword: z.string(),
  terms: z.boolean().refine((val) => val === true, 'You must accept the terms and conditions')
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type SignupFormData = z.infer<typeof signupSchema>

interface SignupFormProps {
  onTabChange: (tab: string) => void
}

interface PasswordStrength {
  score: number
  feedback: string[]
  color: string
}

function getPasswordStrength(password: string): PasswordStrength {
  let score = 0
  const feedback: string[] = []

  if (password.length >= 8) {
    score += 1
  } else {
    feedback.push('At least 8 characters')
  }

  if (/[a-z]/.test(password)) {
    score += 1
  } else {
    feedback.push('One lowercase letter')
  }

  if (/[A-Z]/.test(password)) {
    score += 1
  } else {
    feedback.push('One uppercase letter')
  }

  if (/\d/.test(password)) {
    score += 1
  } else {
    feedback.push('One number')
  }

  if (/[^a-zA-Z\d]/.test(password)) {
    score += 1
  } else {
    feedback.push('One special character (optional)')
  }

  const colors = ['text-red-500', 'text-orange-500', 'text-yellow-500', 'text-blue-500', 'text-green-500']

  return {
    score,
    feedback,
    color: colors[Math.min(score, 4)]
  }
}

export function SignupForm({ onTabChange }: SignupFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { signup, loginWithGoogle, loginWithGithub } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema)
  })

  const password = watch('password')
  const confirmPassword = watch('confirmPassword')
  const passwordStrength = getPasswordStrength(password || '')

  const onSubmit = async (data: SignupFormData) => {
    try {
      setIsLoading(true)
      await signup(data.email, data.password)
    } catch (error: any) {
      // Error is already handled by useAuth hook
      console.error('Signup error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignup = async () => {
    try {
      setIsLoading(true)
      await loginWithGoogle()
    } catch (error: any) {
      // Error is already handled by useAuth hook
      console.error('Google signup error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGithubSignup = async () => {
    try {
      setIsLoading(true)
      await loginWithGithub()
    } catch (error: any) {
      // Error is already handled by useAuth hook
      console.error('GitHub signup error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md border-gray-800 bg-black">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-white">Create an account</CardTitle>
        <CardDescription className="text-gray-400">
          Join Repo Scout to find your next open source contribution
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={handleGoogleSignup}
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
          <Button
            variant="outline"
            onClick={handleGithubSignup}
            disabled={isLoading}
            className="border-gray-700 bg-gray-900 text-white hover:bg-gray-800"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Github className="h-4 w-4 mr-2" />
            )}
            GitHub
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-300">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              {...register('email')}
              className="border-gray-700 bg-gray-900 text-white placeholder-gray-500"
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-sm text-red-400">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-300">Password</Label>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a strong password"
              {...register('password')}
              className="border-gray-700 bg-gray-900 text-white placeholder-gray-500"
              disabled={isLoading}
            />
            {errors.password && (
              <p className="text-sm text-red-400">{errors.password.message}</p>
            )}

            {password && (
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <div className="flex-1 bg-gray-800 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        passwordStrength.score === 0 ? 'bg-red-500' :
                        passwordStrength.score === 1 ? 'bg-orange-500' :
                        passwordStrength.score === 2 ? 'bg-yellow-500' :
                        passwordStrength.score === 3 ? 'bg-blue-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                    />
                  </div>
                  <span className={`text-xs ${passwordStrength.color}`}>
                    {passwordStrength.score === 0 ? 'Weak' :
                     passwordStrength.score === 1 ? 'Fair' :
                     passwordStrength.score === 2 ? 'Good' :
                     passwordStrength.score === 3 ? 'Strong' :
                     'Very Strong'}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-gray-300">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              {...register('confirmPassword')}
              className="border-gray-700 bg-gray-900 text-white placeholder-gray-500"
              disabled={isLoading}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-400">{errors.confirmPassword.message}</p>
            )}
            {confirmPassword && password && confirmPassword !== password && (
              <div className="flex items-center gap-1 text-sm text-red-400">
                <XCircle className="h-3 w-3" />
                Passwords don't match
              </div>
            )}
            {confirmPassword && password && confirmPassword === password && (
              <div className="flex items-center gap-1 text-sm text-green-400">
                <CheckCircle2 className="h-3 w-3" />
                Passwords match
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms"
              {...register('terms')}
              className="border-gray-600 data-[state=checked]:bg-blue-600"
              disabled={isLoading}
            />
            <Label
              htmlFor="terms"
              className="text-sm text-gray-300 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I agree to the{' '}
              <a href="#" className="text-blue-400 hover:text-blue-300 hover:underline">
                terms of service
              </a>{' '}
              and{' '}
              <a href="#" className="text-blue-400 hover:text-blue-300 hover:underline">
                privacy policy
              </a>
            </Label>
          </div>
          {errors.terms && (
            <p className="text-sm text-red-400">{errors.terms.message}</p>
          )}

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Create Account
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <div className="text-sm text-gray-400">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => onTabChange('login')}
            className="text-blue-400 hover:text-blue-300 hover:underline"
          >
            Sign in
          </button>
        </div>
      </CardFooter>
    </Card>
  )
}