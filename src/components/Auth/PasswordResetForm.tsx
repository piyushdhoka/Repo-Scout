import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useAuth } from '@/hooks/useAuth'
import { Loader2, Mail, ArrowLeft, CheckCircle } from 'lucide-react'

const resetSchema = z.object({
  email: z.string().email('Invalid email address')
})

type ResetFormData = z.infer<typeof resetSchema>

interface PasswordResetFormProps {
  onTabChange: (tab: string) => void
}

export function PasswordResetForm({ onTabChange }: PasswordResetFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const { resetPassword } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema)
  })

  const onSubmit = async (data: ResetFormData) => {
    try {
      setIsLoading(true)
      await resetPassword(data.email)
      setIsSuccess(true)
    } catch (error: any) {
      // Error is already handled by useAuth hook
      console.error('Password reset error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToLogin = () => {
    setIsSuccess(false)
    onTabChange('login')
  }

  if (isSuccess) {
    return (
      <Card className="w-full max-w-md border-gray-800 bg-black">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
            <CheckCircle className="h-6 w-6 text-green-500" />
            Check your email
          </CardTitle>
          <CardDescription className="text-gray-400">
            We've sent you instructions to reset your password
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="border-green-900 bg-green-950 text-green-100">
            <Mail className="h-4 w-4" />
            <AlertDescription>
              Password reset instructions have been sent to your email address.
              Please check your inbox and follow the link to reset your password.
            </AlertDescription>
          </Alert>

          <div className="text-sm text-gray-400 space-y-2">
            <p>Didn't receive the email?</p>
            <ul className="list-disc list-inside space-y-1 text-gray-500">
              <li>Check your spam folder</li>
              <li>Make sure the email address is correct</li>
              <li>Wait a few minutes for delivery</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleBackToLogin}
            variant="outline"
            className="w-full border-gray-700 bg-gray-900 text-white hover:bg-gray-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Login
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md border-gray-800 bg-black">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-white">Reset your password</CardTitle>
        <CardDescription className="text-gray-400">
          Enter your email address and we'll send you instructions to reset your password
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-300">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email address"
              {...register('email')}
              className="border-gray-700 bg-gray-900 text-white placeholder-gray-500"
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-sm text-red-400">{errors.email.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Mail className="h-4 w-4 mr-2" />
            )}
            Send Reset Instructions
          </Button>
        </form>

        <div className="text-sm text-gray-400">
          Remember your password?{' '}
          <button
            type="button"
            onClick={() => onTabChange('login')}
            className="text-blue-400 hover:text-blue-300 hover:underline"
          >
            Sign in
          </button>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          type="button"
          onClick={() => onTabChange('login')}
          variant="ghost"
          className="text-gray-400 hover:text-white hover:bg-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Login
        </Button>
      </CardFooter>
    </Card>
  )
}