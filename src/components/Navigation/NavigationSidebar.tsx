import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuth } from '@/hooks/useAuth'
import { useSidebar } from '@/contexts/SidebarContext'
import {
  X,
  Home,
  TrendingUp,
  Lightbulb,
  LogOut
} from 'lucide-react'

export function NavigationSidebar() {
  const { user, logout } = useAuth()
  const { isOpen, closeSidebar } = useSidebar()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const getUserInitials = (user: any) => {
    if (user?.displayName) {
      return user.displayName
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }
    if (user?.email) {
      return user.email.slice(0, 2).toUpperCase()
    }
    return 'U'
  }

  const handleNavigation = (path: string) => {
    navigate(path)
    closeSidebar()
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
        onClick={closeSidebar}
      />

      {/* Sidebar */}
      <div className="navigation-sidebar fixed top-16 left-0 h-[calc(100vh-4rem)] w-80 bg-black border-r border-gray-800 z-40 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-lg font-semibold text-white font-instrument">Navigation</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={closeSidebar}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 p-4 space-y-2">
          <Button
            variant="ghost"
            onClick={() => handleNavigation('/')}
            className="nav-button w-full justify-start gap-3 text-gray-300 hover:text-white hover:bg-gray-900"
          >
            <Home className="h-5 w-5" />
            Home
          </Button>

          <Button
            variant="ghost"
            onClick={() => handleNavigation('/home')}
            className="nav-button w-full justify-start gap-3 text-gray-300 hover:text-white hover:bg-gray-900"
          >
            <TrendingUp className="h-5 w-5" />
            Trending
          </Button>

          <Button
            variant="ghost"
            onClick={() => handleNavigation('/suggest')}
            className="nav-button w-full justify-start gap-3 text-gray-300 hover:text-white hover:bg-gray-900"
          >
            <Lightbulb className="h-5 w-5" />
            Suggest Feature
          </Button>
        </nav>

        {/* User Section - Fixed at bottom */}
        {user && (
          <div className="border-t border-gray-800 p-4 space-y-4">
            {/* User Profile Info */}
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  {getUserInitials(user)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user.displayName || 'User'}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {user.email}
                </p>
              </div>
            </div>

            {/* Sign Out Button */}
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="w-full justify-start gap-3 text-red-400 hover:text-red-300 hover:bg-red-900/20 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              Sign Out
            </Button>
          </div>
        )}
      </div>
    </>
  )
}