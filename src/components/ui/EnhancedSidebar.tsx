import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { InteractiveButton } from '@/components/ui/InteractiveButton'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import {
  Search,
  Home,
  History,
  Flame,
  TrendingUp,
  Code,
  Users,
  Settings,
  Star,
  Bug,
  Twitter,
  Github,
  Mail,
  ChevronLeft,
  ChevronRight,
  Zap,
  Award,
  Target,
  BarChart3,
  BookOpen,
  HelpCircle
} from 'lucide-react'

interface SidebarItem {
  id: string
  label: string
  icon: React.ReactNode
  href?: string
  badge?: string
  color?: string
  gradient?: string
  description?: string
  onClick?: () => void
}

interface EnhancedSidebarProps {
  user?: any
  isCollapsed?: boolean
  onToggleCollapse?: () => void
  className?: string
}

const sidebarItems: SidebarItem[] = [
  {
    id: 'home',
    label: 'Home',
    icon: <Home className="h-5 w-5" />,
    href: '/',
    color: 'text-blue-400',
    gradient: 'from-blue-500 to-cyan-500',
    description: 'Back to landing page'
  },
  {
    id: 'search',
    label: 'Search',
    icon: <Search className="h-5 w-5" />,
    color: 'text-purple-400',
    gradient: 'from-purple-500 to-pink-500',
    description: 'Find open source issues'
  },
  {
    id: 'history',
    label: 'My History',
    icon: <History className="h-5 w-5" />,
    color: 'text-green-400',
    gradient: 'from-green-500 to-emerald-500',
    description: 'View your contributions',
    badge: 'New'
  },
  {
    id: 'trending',
    label: 'Trending',
    icon: <Flame className="h-5 w-5" />,
    color: 'text-orange-400',
    gradient: 'from-orange-500 to-red-500',
    description: 'Popular repositories'
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: <BarChart3 className="h-5 w-5" />,
    color: 'text-indigo-400',
    gradient: 'from-indigo-500 to-blue-500',
    description: 'View your statistics'
  }
]

const discoveryItems: SidebarItem[] = [
  {
    id: 'featured',
    label: 'Featured',
    icon: <Star className="h-4 w-4" />,
    color: 'text-yellow-400',
    gradient: 'from-yellow-500 to-orange-500',
    description: 'Curated projects'
  },
  {
    id: 'languages',
    label: 'Languages',
    icon: <Code className="h-4 w-4" />,
    color: 'text-cyan-400',
    gradient: 'from-cyan-500 to-blue-500',
    description: 'Filter by language'
  },
  {
    id: 'yc-startups',
    label: 'Y Combinator',
    icon: <Zap className="h-4 w-4" />,
    color: 'text-purple-400',
    gradient: 'from-purple-500 to-pink-500',
    description: 'YC startup projects'
  }
]

const communityItems: SidebarItem[] = [
  {
    id: 'contributors',
    label: 'Contributors',
    icon: <Users className="h-4 w-4" />,
    color: 'text-green-400',
    gradient: 'from-green-500 to-teal-500',
    description: 'Top contributors'
  },
  {
    id: 'documentation',
    label: 'Docs',
    icon: <BookOpen className="h-4 w-4" />,
    color: 'text-blue-400',
    gradient: 'from-blue-500 to-indigo-500',
    description: 'Read the docs'
  }
]

const socialItems: SidebarItem[] = [
  {
    id: 'twitter',
    label: 'Twitter',
    icon: <Twitter className="h-4 w-4" />,
    color: 'text-sky-400',
    href: 'https://twitter.com',
    description: 'Follow us on Twitter'
  },
  {
    id: 'github',
    label: 'GitHub',
    icon: <Github className="h-4 w-4" />,
    color: 'text-gray-400',
    href: 'https://github.com/vivekd16/Repo-Scout',
    description: 'View on GitHub'
  },
  {
    id: 'support',
    label: 'Support',
    icon: <HelpCircle className="h-4 w-4" />,
    color: 'text-purple-400',
    description: 'Get help'
  }
]

export function EnhancedSidebar({
  user,
  isCollapsed = false,
  onToggleCollapse,
  className = ''
}: EnhancedSidebarProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const location = useLocation()

  const isActive = (href?: string) => {
    if (!href) return false
    return location.pathname === href
  }

  const getGradientClasses = (gradient?: string) => {
    if (!gradient) return ''
    const gradients: Record<string, string> = {
      'from-blue-500 to-cyan-500': 'hover:from-blue-600 hover:to-cyan-600',
      'from-purple-500 to-pink-500': 'hover:from-purple-600 hover:to-pink-600',
      'from-green-500 to-emerald-500': 'hover:from-green-600 hover:to-emerald-600',
      'from-orange-500 to-red-500': 'hover:from-orange-600 hover:to-red-600',
      'from-indigo-500 to-blue-500': 'hover:from-indigo-600 hover:to-blue-600',
      'from-yellow-500 to-orange-500': 'hover:from-yellow-600 hover:to-orange-600',
      'from-cyan-500 to-blue-500': 'hover:from-cyan-600 hover:to-blue-600',
      'from-green-500 to-teal-500': 'hover:from-green-600 hover:to-teal-600'
    }
    return gradients[gradient] || ''
  }

  const renderSidebarItem = (item: SidebarItem, isSecondary = false) => {
    const active = isActive(item.href)
    const isHovered = hoveredItem === item.id

    const content = (
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <button
          onClick={item.onClick}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group relative overflow-hidden',
            isCollapsed ? 'justify-center' : 'justify-start',
            active
              ? 'bg-gradient-to-r text-white shadow-lg'
              : isSecondary
              ? 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
              : 'text-gray-300 hover:bg-gray-800/30 hover:text-white',
            isHovered && !active && 'bg-gray-800/40'
          )}
          style={
            active && item.gradient
              ? {
                  backgroundImage: `linear-gradient(to right, ${item.gradient
                    .replace(/from-\w+-\d+/g, (match) => {
                      const colors: Record<string, string> = {
                        'from-blue-500': '#3b82f6',
                        'to-cyan-500': '#06b6d4',
                        'from-purple-500': '#a855f7',
                        'to-pink-500': '#ec4899',
                        'from-green-500': '#10b981',
                        'to-emerald-500': '#10b981',
                        'from-orange-500': '#f97316',
                        'to-red-500': '#ef4444',
                        'from-indigo-500': '#6366f1',
                        'to-blue-500': '#3b82f6',
                        'from-yellow-500': '#eab308',
                        'to-orange-500': '#f97316',
                        'from-cyan-500': '#06b6d4',
                        'from-teal-500': '#14b8a6'
                      }
                      return colors[match] || match
                    })
                  })`
                }
              : {}
          }
          onMouseEnter={() => setHoveredItem(item.id)}
          onMouseLeave={() => setHoveredItem(null)}
          >
          {/* Animated background effect */}
          <div
            className={cn(
              'absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-20 transition-opacity duration-300',
              getGradientClasses(item.gradient)
            )}
          />

          {/* Icon with gradient */}
          <div
            className={cn(
              'flex items-center justify-center relative z-10',
              active ? 'text-white' : item.color
            )}
          >
            {item.icon}
          </div>

          {/* Label and badge */}
          {!isCollapsed && (
            <div className="flex items-center justify-between flex-1 relative z-10">
              <span className={cn(
                'font-medium truncate',
                active ? 'text-white' : 'text-gray-200'
              )}>
                {item.label}
              </span>
              {item.badge && (
                <Badge
                  variant="secondary"
                  className={cn(
                    'ml-auto text-xs px-1.5 py-0.5',
                    active
                      ? 'bg-white/20 text-white border-white/30'
                      : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                  )}
                >
                  {item.badge}
                </Badge>
              )}
            </div>
          )}

          {/* Hover indicator */}
          {isHovered && !active && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
          )}
          </button>
        </TooltipTrigger>
        <TooltipContent side="right">
          {isCollapsed ? item.label : item.description || ''}
        </TooltipContent>
      </Tooltip>
    )

    if (item.href && !item.onClick) {
      return (
        <Link to={item.href} className="block">
          {content}
        </Link>
      )
    }

    return content
  }

  return (
    <div
      className={cn(
        'h-full bg-gradient-to-b from-gray-900 via-gray-900 to-black border-r border-gray-800/50 transition-all duration-300 flex flex-col relative',
        isCollapsed ? 'w-20' : 'w-72',
        className
      )}
    >
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 p-4 border-b border-gray-800/50">
        <div className="flex items-center justify-between mb-4">
          <div className={cn(
            'flex items-center gap-3',
            isCollapsed && 'justify-center'
          )}>
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Target className="h-5 w-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900" />
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Repo Scout
                </h1>
                <p className="text-xs text-gray-500">Find Issues</p>
              </div>
            )}
          </div>

          <InteractiveButton
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="text-gray-400 hover:text-white p-2"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </InteractiveButton>
        </div>

        {/* User Profile */}
        {user && !isCollapsed && (
          <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/20">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.photoURL} alt={user.displayName} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                {user.displayName?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'}
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
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-6 relative z-10">
        {/* Main Navigation */}
        <div>
          {!isCollapsed && (
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Main
            </h3>
          )}
          <div className="space-y-2">
            {sidebarItems.map((item) => (
              <div key={item.id}>
                {renderSidebarItem(item)}
              </div>
            ))}
          </div>
        </div>

        {/* Discovery */}
        <div>
          {!isCollapsed && (
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Discovery
            </h3>
          )}
          <div className="space-y-2">
            {discoveryItems.map((item) => (
              <div key={item.id}>
                {renderSidebarItem(item, true)}
              </div>
            ))}
          </div>
        </div>

        {/* Community */}
        {user && (
          <div>
            {!isCollapsed && (
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Community
              </h3>
            )}
            <div className="space-y-2">
              {communityItems.map((item) => (
                <div key={item.id}>
                  {renderSidebarItem(item, true)}
                </div>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Footer */}
      <div className="relative z-10 p-4 border-t border-gray-800/50">
        {!isCollapsed && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Award className="h-3 w-3" />
              <span>Premium Features</span>
            </div>
            <InteractiveButton
              variant="outline"
              size="sm"
              className="w-full text-transparent bg-gradient-to-r from-blue-500/10 to-purple-500/10 hover:from-blue-500/20 hover:to-purple-500/20"
            >
              Upgrade Pro
            </InteractiveButton>
          </div>
        )}

        {/* Social Links */}
        <div className={cn(
          'flex gap-2 mt-4',
          isCollapsed ? 'flex-col' : 'justify-center'
        )}>
          {socialItems.slice(0, isCollapsed ? 3 : socialItems.length).map((item) => (
            <Tooltip key={item.id}>
              <TooltipTrigger asChild>
                {item.href ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      'p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50 transition-all duration-200',
                      isCollapsed ? 'mx-auto' : ''
                    )}
                  >
                    {item.icon}
                  </a>
                ) : (
                  <button
                    className={cn(
                      'p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50 transition-all duration-200',
                      isCollapsed ? 'mx-auto' : ''
                    )}
                  >
                    {item.icon}
                  </button>
                )}
              </TooltipTrigger>
              <TooltipContent>
                {item.label}
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>
    </div>
  )
}