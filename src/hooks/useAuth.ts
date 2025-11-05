import { useState, useEffect, useCallback } from 'react'
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider
} from 'firebase/auth'
import { auth, googleProvider, githubProvider } from '@/lib/firebase'
import { toast } from '@/hooks/use-toast'

interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null
  })

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setAuthState({
        user,
        loading: false,
        error: null
      })
    }, (error) => {
      setAuthState({
        user: null,
        loading: false,
        error: error.message
      })
      toast({
        title: "Authentication Error",
        description: error.message,
        variant: "destructive"
      })
    })

    return unsubscribe
  }, [])

  // Email/Password registration
  const signup = useCallback(async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }))

      const result = await createUserWithEmailAndPassword(auth, email, password)

      toast({
        title: "Account created successfully",
        description: "Welcome to Repo Scout!"
      })

      return result.user
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to create account'
      setAuthState(prev => ({ ...prev, error: errorMessage, loading: false }))

      toast({
        title: "Registration failed",
        description: errorMessage,
        variant: "destructive"
      })

      throw error
    }
  }, [])

  // Email/Password login
  const login = useCallback(async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }))

      const result = await signInWithEmailAndPassword(auth, email, password)

      toast({
        title: "Login successful",
        description: "Welcome back to Repo Scout!"
      })

      return result.user
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to login'
      setAuthState(prev => ({ ...prev, error: errorMessage, loading: false }))

      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive"
      })

      throw error
    }
  }, [])

  // Google OAuth login
  const loginWithGoogle = useCallback(async () => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }))

      const result = await signInWithPopup(auth, googleProvider)

      toast({
        title: "Login successful",
        description: "Welcome to Repo Scout!"
      })

      return result.user
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to login with Google'
      setAuthState(prev => ({ ...prev, error: errorMessage, loading: false }))

      toast({
        title: "Google login failed",
        description: errorMessage,
        variant: "destructive"
      })

      throw error
    }
  }, [])

  // GitHub OAuth login
  const loginWithGithub = useCallback(async () => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }))

      const result = await signInWithPopup(auth, githubProvider)

      toast({
        title: "Login successful",
        description: "Welcome to Repo Scout!"
      })

      return result.user
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to login with GitHub'
      setAuthState(prev => ({ ...prev, error: errorMessage, loading: false }))

      toast({
        title: "GitHub login failed",
        description: errorMessage,
        variant: "destructive"
      })

      throw error
    }
  }, [])

  // Password reset
  const resetPassword = useCallback(async (email: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }))

      await sendPasswordResetEmail(auth, email)

      toast({
        title: "Password reset email sent",
        description: "Check your email for password reset instructions"
      })
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to send password reset email'
      setAuthState(prev => ({ ...prev, error: errorMessage, loading: false }))

      toast({
        title: "Password reset failed",
        description: errorMessage,
        variant: "destructive"
      })

      throw error
    }
  }, [])

  // Logout
  const logout = useCallback(async () => {
    try {
      await signOut(auth)

      toast({
        title: "Logged out successfully",
        description: "See you again soon!"
      })
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to logout'

      toast({
        title: "Logout failed",
        description: errorMessage,
        variant: "destructive"
      })

      throw error
    }
  }, [])

  return {
    user: authState.user,
    loading: authState.loading,
    error: authState.error,
    signup,
    login,
    loginWithGoogle,
    loginWithGithub,
    resetPassword,
    logout
  }
}