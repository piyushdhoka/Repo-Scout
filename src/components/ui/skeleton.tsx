import React from 'react'
import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded'
  width?: string | number
  height?: string | number
  lines?: number
  animated?: boolean
  style?: React.CSSProperties
}

export function Skeleton({
  className = '',
  variant = 'text',
  width,
  height,
  lines = 1,
  animated = true
}: SkeletonProps) {
  const baseClasses = "bg-gray-800 rounded"
  const animationClass = animated ? "animate-pulse" : ""

  const getVariantClasses = () => {
    switch (variant) {
      case 'circular':
        return "rounded-full"
      case 'rectangular':
        return "rounded-none"
      case 'rounded':
        return "rounded-lg"
      case 'text':
      default:
        return "rounded-sm h-4"
    }
  }

  const style: React.CSSProperties = {}
  if (width) style.width = typeof width === 'number' ? `${width}px` : width
  if (height && variant !== 'text') style.height = typeof height === 'number' ? `${height}px` : height

  if (variant === 'text' && lines > 1) {
    return (
      <div className={cn("space-y-2", className)}>
        {[...Array(lines)].map((_, i) => (
          <div
            key={i}
            className={cn(
              baseClasses,
              getVariantClasses(),
              animationClass,
              i === lines - 1 ? "w-3/4" : "w-full"
            )}
            style={style}
          />
        ))}
      </div>
    )
  }

  return (
    <div
      className={cn(
        baseClasses,
        getVariantClasses(),
        animationClass,
        className
      )}
      style={style}
    />
  )
}

// Skeleton card for issue items
export function IssueCardSkeleton() {
  return (
    <div className="border border-gray-800 bg-black rounded-lg p-6 animate-pulse">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1 space-y-2">
          <Skeleton width="70%" height={20} />
          <Skeleton width="40%" height={16} />
        </div>
        <Skeleton width={80} height={24} variant="rounded" />
      </div>

      <div className="flex items-center gap-4 text-sm mb-3">
        <Skeleton width={120} height={16} />
        <Skeleton width={60} height={16} />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Skeleton width={60} height={20} variant="rounded" />
          <Skeleton width={80} height={20} variant="rounded" />
        </div>
        <Skeleton width={100} height={32} variant="rounded" />
      </div>
    </div>
  )
}

// Skeleton for search results
export function SearchResultsSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <IssueCardSkeleton key={i} />
      ))}
    </div>
  )
}

// Skeleton for user profile
export function UserProfileSkeleton() {
  return (
    <div className="flex items-center gap-3 p-4 border border-gray-800 bg-black rounded-lg">
      <Skeleton width={40} height={40} variant="circular" />
      <div className="flex-1 space-y-2">
        <Skeleton width={150} height={16} />
        <Skeleton width={200} height={14} />
      </div>
    </div>
  )
}

// Skeleton for stats
export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="text-center">
          <Skeleton width={80} height={32} className="mx-auto mb-2" />
          <Skeleton width={100} height={16} className="mx-auto" />
        </div>
      ))}
    </div>
  )
}

// Skeleton for feature cards
export function FeatureCardSkeleton() {
  return (
    <div className="border border-gray-800 bg-black rounded-lg p-6 animate-pulse">
      <div className="flex flex-col items-center text-center space-y-4">
        <Skeleton width={48} height={48} variant="circular" />
        <Skeleton width={150} height={20} />
        <Skeleton lines={3} width="100%" />
      </div>
    </div>
  )
}

// Skeleton for landing page hero section
export function HeroSkeleton() {
  return (
    <div className="grid lg:grid-cols-2 gap-12 items-center">
      <div className="space-y-8">
        <div className="space-y-4">
          <Skeleton width="90%" height={48} />
          <Skeleton lines={3} width="100%" />
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Skeleton width={150} height={48} variant="rounded" />
          <Skeleton width={120} height={48} variant="rounded" />
        </div>

        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <Skeleton width={16} height={16} variant="circular" />
            <Skeleton width={140} height={14} />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton width={16} height={16} variant="circular" />
            <Skeleton width={100} height={14} />
          </div>
        </div>
      </div>

      <div className="relative">
        <Skeleton width={600} height={400} variant="rounded" />
      </div>
    </div>
  )
}

// Loading spinner with different variants
export function LoadingSpinner({
  size = 'md',
  className = ''
}: {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  }

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-gray-700 border-t-blue-500',
        sizeClasses[size],
        className
      )}
    />
  )
}

// Animated loading dots
export function LoadingDots({ className = '' }: { className?: string }) {
  return (
    <div className={cn('flex space-x-1', className)}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
          style={{
            animationDelay: `${i * 0.1}s`,
            animationDuration: '1s'
          }}
        />
      ))}
    </div>
  )
}

// Full page loading overlay
export function LoadingOverlay({
  message = 'Loading...',
  showLogo = true
}: {
  message?: string
  showLogo?: boolean
}) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center space-y-4">
        {showLogo && (
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto animate-pulse">
            <span className="text-white font-bold text-xl">RS</span>
          </div>
        )}
        <LoadingSpinner size="lg" />
        <p className="text-gray-400 animate-pulse">{message}</p>
      </div>
    </div>
  )
}