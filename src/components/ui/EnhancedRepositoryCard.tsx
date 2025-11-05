import React, { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { InteractiveButton } from '@/components/ui/InteractiveButton'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import {
  Star,
  GitFork,
  Users,
  Eye,
  Code,
  Calendar,
  ExternalLink,
  Heart,
  MessageSquare,
  Zap,
  TrendingUp,
  Award,
  Clock
} from 'lucide-react'

interface RepositoryData {
  id: string
  name: string
  fullName: string
  description: string
  language: string
  stars: number
  forks: number
  watchers: number
  openIssues: number
  createdAt: string
  updatedAt: string
  owner: {
    login: string
    avatarUrl: string
    type: string
  }
  topics: string[]
  license?: string
  isPrivate: boolean
  size: number
}

interface EnhancedRepositoryCardProps {
  repository: RepositoryData
  className?: string
  showFullDescription?: boolean
  variant?: 'default' | 'compact' | 'featured'
  onCardClick?: (repo: RepositoryData) => void
}

const languageColors: Record<string, string> = {
  JavaScript: 'bg-yellow-500',
  TypeScript: 'bg-blue-500',
  Python: 'bg-blue-600',
  Java: 'bg-orange-500',
  Go: 'bg-cyan-500',
  Rust: 'bg-orange-700',
  Cpp: 'bg-blue-600',
  'C++': 'bg-blue-600',
  PHP: 'bg-purple-500',
  Ruby: 'bg-red-500',
  Swift: 'bg-orange-500',
  Kotlin: 'bg-purple-600',
  Dart: 'bg-blue-400',
  Vue: 'bg-green-500',
  React: 'bg-cyan-400',
  Angular: 'bg-red-600',
  HTML: 'bg-orange-600',
  CSS: 'bg-blue-400',
  'C#': 'bg-purple-600',
  Scala: 'bg-red-500',
  Shell: 'bg-green-600'
}

const getPopularityLevel = (stars: number) => {
  if (stars >= 50000) return { level: 'Legendary', color: 'from-yellow-400 to-orange-500', textColor: 'text-yellow-400' }
  if (stars >= 20000) return { level: 'Famous', color: 'from-purple-400 to-pink-500', textColor: 'text-purple-400' }
  if (stars >= 5000) return { level: 'Popular', color: 'from-green-400 to-emerald-500', textColor: 'text-green-400' }
  if (stars >= 1000) return { level: 'Trending', color: 'from-blue-400 to-cyan-500', textColor: 'text-blue-400' }
  return { level: 'Growing', color: 'from-gray-400 to-gray-500', textColor: 'text-gray-400' }
}

const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`
  return num.toString()
}

const getRelativeTime = (date: string): string => {
  const now = new Date()
  const past = new Date(date)
  const diffMs = now.getTime() - past.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
  return `${Math.floor(diffDays / 365)} years ago`
}

export function EnhancedRepositoryCard({
  repository,
  className = '',
  showFullDescription = false,
  variant = 'default',
  onCardClick
}: EnhancedRepositoryCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isLiked, setIsLiked] = useState(false)

  const popularity = getPopularityLevel(repository.stars)
  const languageColor = languageColors[repository.language] || 'bg-gray-500'

  const handleCardClick = () => {
    onCardClick?.(repository)
  }

  const isCompact = variant === 'compact'
  const isFeatured = variant === 'featured'

  return (
    <Card
      className={cn(
        'group relative overflow-hidden transition-all duration-300 cursor-pointer',
        'border-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900',
        isHovered && 'transform -translate-y-1 shadow-2xl',
        isFeatured && 'ring-2 ring-blue-500/20 shadow-xl',
        isCompact ? 'p-4' : 'p-6',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* Animated gradient background */}
      <div
        className={cn(
          'absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500',
          popularity.color.replace('from-', 'from-').replace(' to-', ' to-')
        )}
      />

      {/* Header with avatar and basic info */}
      <div className={cn(
        'flex items-start gap-4 relative z-10',
        isCompact ? 'gap-3' : 'gap-4'
      )}>
        <div className="relative">
          <Avatar className={cn(
            isCompact ? 'h-12 w-12' : 'h-16 w-16',
            'ring-2 ring-gray-700 group-hover:ring-blue-500/50 transition-all duration-300'
          )}>
            <AvatarImage
              src={repository.owner.avatarUrl}
              alt={repository.owner.login}
              className="object-cover"
            />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold">
              {repository.owner.login.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          {/* Activity indicator */}
          {isHovered && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900 animate-pulse" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          {/* Repository name and owner */}
          <div className="flex items-center gap-2 mb-1">
            <h3 className={cn(
              'font-bold text-white truncate group-hover:text-blue-400 transition-colors',
              isCompact ? 'text-sm' : 'text-lg'
            )}>
              {repository.name}
            </h3>
            {repository.isPrivate && (
              <Badge variant="secondary" className="text-xs bg-gray-700 text-gray-300">
                Private
              </Badge>
            )}
          </div>

          <p className="text-xs text-gray-400 truncate mb-2">
            by {repository.owner.login}
          </p>

          {/* Description */}
          {!isCompact && (
            <p className={cn(
              'text-gray-300 mb-3 leading-relaxed',
              showFullDescription ? 'line-clamp-none' : 'line-clamp-2'
            )}>
              {repository.description || 'No description available'}
            </p>
          )}

          {/* Topics/Tags */}
          {!isCompact && repository.topics.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {repository.topics.slice(0, 3).map((topic) => (
                <Badge
                  key={topic}
                  variant="secondary"
                  className="text-xs bg-gray-800/50 text-gray-300 border-gray-700 hover:bg-gray-700/50"
                >
                  {topic}
                </Badge>
              ))}
              {repository.topics.length > 3 && (
                <Badge
                  variant="secondary"
                  className="text-xs bg-gray-800/50 text-gray-400 border-gray-700"
                >
                  +{repository.topics.length - 3}
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Popularity Badge */}
        <div className="flex flex-col items-end gap-2">
          <Badge
            className={cn(
              'text-xs font-medium px-2 py-1',
              `bg-gradient-to-r ${popularity.color} text-white`
            )}
          >
            {popularity.level}
          </Badge>

          {/* Like button */}
          <InteractiveButton
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              setIsLiked(!isLiked)
            }}
            className={cn(
              'p-1 h-8 w-8',
              isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-400'
            )}
          >
            <Heart className={cn('h-4 w-4', isLiked && 'fill-current')} />
          </InteractiveButton>
        </div>
      </div>

      {/* Stats Row */}
      <div className={cn(
        'flex items-center justify-between mt-4 pt-4 border-t border-gray-800 relative z-10',
        isCompact && 'mt-2 pt-2'
      )}>
        <div className="flex items-center gap-4 text-sm text-gray-400">
          {/* Language */}
          <div className="flex items-center gap-1.5">
            <div className={cn('w-3 h-3 rounded-full', languageColor)} />
            <span className="text-xs">{repository.language || 'Unknown'}</span>
          </div>

          {/* Stars */}
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3" />
            <span className="text-xs">{formatNumber(repository.stars)}</span>
          </div>

          {/* Forks */}
          {!isCompact && (
            <div className="flex items-center gap-1">
              <GitFork className="h-3 w-3" />
              <span className="text-xs">{formatNumber(repository.forks)}</span>
            </div>
          )}

          {/* Updated time */}
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span className="text-xs">{getRelativeTime(repository.updatedAt)}</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {isHovered && !isCompact && (
            <>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-gray-400 hover:text-blue-400"
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  View Issues
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-gray-400 hover:text-green-400"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  View on GitHub
                </TooltipContent>
              </Tooltip>
            </>
          )}
        </div>
      </div>

      {/* Hover overlay with additional info */}
      {isHovered && !isCompact && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-gray-400">Watchers</span>
              <p className="text-white font-medium">{formatNumber(repository.watchers)}</p>
            </div>
            <div>
              <span className="text-gray-400">Open Issues</span>
              <p className="text-white font-medium">{repository.openIssues}</p>
            </div>
            <div>
              <span className="text-gray-400">Size</span>
              <p className="text-white font-medium">{formatNumber(repository.size)} KB</p>
            </div>
            <div>
              <span className="text-gray-400">Created</span>
              <p className="text-white font-medium">{new Date(repository.createdAt).getFullYear()}</p>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}

// Skeleton loader for repository cards
export function RepositoryCardSkeleton({ variant = 'default' }: { variant?: 'default' | 'compact' | 'featured' }) {
  const isCompact = variant === 'compact'

  return (
    <Card className={cn(
      'group relative overflow-hidden border-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900',
      isCompact ? 'p-4' : 'p-6'
    )}>
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 bg-gray-800 rounded-full animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-5 bg-gray-800 rounded animate-pulse w-3/4" />
          <div className="h-4 bg-gray-800 rounded animate-pulse w-1/2" />
          <div className="h-3 bg-gray-800 rounded animate-pulse w-full" />
        </div>
      </div>
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-800">
        <div className="flex items-center gap-4">
          <div className="h-4 bg-gray-800 rounded animate-pulse w-16" />
          <div className="h-4 bg-gray-800 rounded animate-pulse w-12" />
          <div className="h-4 bg-gray-800 rounded animate-pulse w-12" />
        </div>
      </div>
    </Card>
  )
}