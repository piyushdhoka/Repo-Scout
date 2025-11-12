import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useAuth } from '@/hooks/useAuth'
import { useSidebar } from '@/contexts/SidebarContext'
import {
  Menu,
  X,
  Search,
  User,
  LogOut,
  Settings,
  History,
  Github,
  Home,
  TrendingUp,
  Lightbulb,
  Star
} from 'lucide-react'

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const { isOpen, toggleSidebar } = useSidebar()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== '/') {
      navigate(`/#${sectionId}`)
    } else {
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
    setIsMobileMenuOpen(false)
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

  const isActivePath = (path: string) => {
    return location.pathname === path
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-black/90 backdrop-blur-lg border-b border-gray-800'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Logo and Hamburger */}
          <div className="flex items-center gap-4">
            {/* Desktop Sidebar Toggle - Left side */}
            {user && (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="hidden md:flex text-gray-300 hover:text-white transition-colors"
                title={isOpen ? "Close sidebar" : "Open sidebar"}
              >
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            )}

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <img
                src="/repo_logo.png"
                alt="Repo Scout logo"
                className="h-8 w-8 rounded-full object-cover shadow-sm"
              />
              <span className="text-lg sm:text-xl font-bold text-white font-instrument">Repo Scout</span>
            </Link>
          </div>

          {/* Center - Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 font-instrument">
            {user && (
              <Link
                to="/home"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Search
              </Link>
            )}
          </nav>

          {/* Right side - Empty for desktop, Mobile menu for mobile */}
          <div className="hidden md:flex items-center gap-2 lg:gap-4">
            {!user && (
              <Button
                onClick={() => navigate('/auth')}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm auth-button"
              >
                Get Started
              </Button>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="text-white">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-black border-gray-800">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2">
                    <img
                      src="/repo_logo.png"
                      alt="Repo Scout logo"
                      className="h-8 w-8 rounded-full object-cover shadow-sm"
                    />
                    <span className="text-xl font-bold text-white font-instrument">Repo Scout</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-white"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <nav className="flex-1 space-y-4">
                  {user && (
                    <>
                      <Link
                        to="/"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-900 rounded-lg transition-colors"
                      >
                        <Home className="h-5 w-5" />
                        Home
                      </Link>
                      <Link
                        to="/home"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-900 rounded-lg transition-colors"
                      >
                        <Search className="h-5 w-5" />
                        Search
                      </Link>
                      <Link
                        to="/home"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-900 rounded-lg transition-colors"
                      >
                        <TrendingUp className="h-5 w-5" />
                        Trending
                      </Link>
                      <Link
                        to="/suggest"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-900 rounded-lg transition-colors"
                      >
                        <Lightbulb className="h-5 w-5" />
                        Suggest Feature
                      </Link>
                    </>
                  )}
                </nav>

                <div className="border-t border-gray-800 pt-4 space-y-4">
                  {user ? (
                    <>
                      <div className="flex items-center gap-3 px-4">
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

                      <div className="space-y-2">
                        <Button
                          variant="ghost"
                          onClick={() => {
                            navigate('/home')
                            setIsMobileMenuOpen(false)
                          }}
                          className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-900"
                        >
                          <Search className="mr-2 h-4 w-4" />
                          Search Repositories
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-900"
                        >
                          <History className="mr-2 h-4 w-4" />
                          My Contributions
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-900"
                        >
                          <Settings className="mr-2 h-4 w-4" />
                          Settings
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={handleLogout}
                          className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-900"
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Log out
                        </Button>
                      </div>
                    </>
                  ) : (
                    <Button
                      onClick={() => {
                        navigate('/auth')
                        setIsMobileMenuOpen(false)
                      }}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Get Started
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}