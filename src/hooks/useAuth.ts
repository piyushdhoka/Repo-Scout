import { useState, useEffect, useCallback } from 'react'
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth'
import { auth, googleProvider } from '@/lib/firebase'

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
      console.error('Authentication error:', error.message)
    })

    return unsubscribe
  }, [])

  // Email/Password registration
  const signup = useCallback(async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }))

      const result = await createUserWithEmailAndPassword(auth, email, password)

      return result.user
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to create account'
      setAuthState(prev => ({ ...prev, error: errorMessage, loading: false }))
      console.error('Registration failed:', errorMessage)

      throw error
    }
  }, [])

  // Email/Password login
  const login = useCallback(async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }))

      const result = await signInWithEmailAndPassword(auth, email, password)

      return result.user
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to login'
      setAuthState(prev => ({ ...prev, error: errorMessage, loading: false }))
      console.error('Login failed:', errorMessage)

      throw error
    }
  }, [])

  // Google OAuth login
  const loginWithGoogle = useCallback(async () => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }))

      const result = await signInWithPopup(auth, googleProvider)

      return result.user
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to login with Google'
      setAuthState(prev => ({ ...prev, error: errorMessage, loading: false }))
      console.error('Google login failed:', errorMessage)

      throw error
    }
  }, [])

  // Password reset
  const resetPassword = useCallback(async (email: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }))

      await sendPasswordResetEmail(auth, email)

    } catch (error: any) {
      const errorMessage = error.message || 'Failed to send password reset email'
      setAuthState(prev => ({ ...prev, error: errorMessage, loading: false }))
      console.error('Password reset failed:', errorMessage)

      throw error
    }
  }, [])

  // Logout
  const logout = useCallback(async () => {
    try {
      await signOut(auth)
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to logout'
      console.error('Logout failed:', errorMessage)

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
    resetPassword,
    logout
  }
}