import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Loader2, Check, ChevronRight } from 'lucide-react'

interface InteractiveButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  loading?: boolean
  success?: boolean
  successMessage?: string
  showSuccessIcon?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  ripple?: boolean
  glow?: boolean
  children: React.ReactNode
}

export function InteractiveButton({
  variant = 'default',
  size = 'default',
  loading = false,
  success = false,
  successMessage = 'Success!',
  showSuccessIcon = true,
  icon,
  iconPosition = 'left',
  ripple = true,
  glow = false,
  children,
  className = '',
  disabled,
  onClick,
  ...props
}: InteractiveButtonProps) {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([])

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (ripple && !loading && !success) {
      const button = e.currentTarget
      const rect = button.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const newRipple = {
        id: Date.now(),
        x,
        y
      }

      setRipples(prev => [...prev, newRipple])

      // Remove ripple after animation
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== newRipple.id))
      }, 600)
    }

    onClick?.(e)
  }

  const getVariantClasses = () => {
    const baseClasses = "relative overflow-hidden transition-all duration-300"

    const variantClasses = {
      default: cn(
        baseClasses,
        "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-blue-500/25",
        glow && "hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]"
      ),
      destructive: cn(
        baseClasses,
        "bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-red-500/25",
        glow && "hover:shadow-[0_0_20px_rgba(239,68,68,0.5)]"
      ),
      outline: cn(
        baseClasses,
        "border-2 border-gray-700 bg-gray-900 text-white hover:bg-gray-800 hover:border-blue-500",
        glow && "hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]"
      ),
      secondary: cn(
        baseClasses,
        "bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white",
        glow && "hover:shadow-[0_0_15px_rgba(156,163,175,0.3)]"
      ),
      ghost: cn(
        baseClasses,
        "text-gray-400 hover:text-white hover:bg-gray-800",
        glow && "hover:shadow-[0_0_10px_rgba(156,163,175,0.2)]"
      ),
      link: cn(
        baseClasses,
        "text-blue-400 hover:text-blue-300 underline-offset-4 hover:underline",
        glow && "hover:shadow-[0_0_10px_rgba(59,130,246,0.2)]"
      )
    }

    return variantClasses[variant] || variantClasses.default
  }

  const renderContent = () => {
    if (loading) {
      return (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Loading...</span>
        </>
      )
    }

    if (success) {
      return (
        <>
          {showSuccessIcon && <Check className="h-4 w-4" />}
          <span>{successMessage}</span>
        </>
      )
    }

    const leftIcon = iconPosition === 'left' ? icon : null
    const rightIcon = iconPosition === 'right' ? icon : null

    return (
      <>
        {leftIcon}
        <span>{children}</span>
        {rightIcon}
      </>
    )
  }

  return (
    <Button
      className={cn(
        getVariantClasses(),
        "group",
        (loading || success) && "cursor-not-allowed opacity-90",
        className
      )}
      size={size}
      disabled={disabled || loading || success}
      onClick={handleClick}
      {...props}
    >
      {/* Ripple effects */}
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="absolute bg-white/20 rounded-full animate-ping"
          style={{
            left: ripple.x - 10,
            top: ripple.y - 10,
            width: 20,
            height: 20,
            animation: 'ripple 0.6s ease-out'
          }}
        />
      ))}

      {/* Button content */}
      <span className="relative z-10 flex items-center gap-2">
        {renderContent()}
      </span>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
    </Button>
  )
}

// Ripple animation keyframes
const rippleStyle = `
  @keyframes ripple {
    0% {
      transform: scale(0);
      opacity: 1;
    }
    100% {
      transform: scale(4);
      opacity: 0;
    }
  }
`

// Add styles to document head
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style')
  styleElement.textContent = rippleStyle
  document.head.appendChild(styleElement)
}