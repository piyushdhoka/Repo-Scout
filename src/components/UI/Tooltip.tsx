import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'

interface TooltipProps {
  children: React.ReactNode
  content: React.ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
  delay?: number
  className?: string
  arrowClassName?: string
  disableHover?: boolean
  show?: boolean
  onShow?: () => void
  onHide?: () => void
}

export function Tooltip({
  children,
  content,
  position = 'top',
  delay = 300,
  className = '',
  arrowClassName = '',
  disableHover = false,
  show: controlledShow,
  onShow,
  onHide
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [coords, setCoords] = useState({ x: 0, y: 0 })
  const [arrowPosition, setArrowPosition] = useState({ x: 0, y: 0 })
  const timeoutRef = useRef<NodeJS.Timeout>()
  const containerRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)

  const calculatePosition = (element: HTMLElement, tooltip: HTMLElement) => {
    const rect = element.getBoundingClientRect()
    const tooltipRect = tooltip.getBoundingClientRect()
    const scrollX = window.scrollX
    const scrollY = window.scrollY

    let x = 0
    let y = 0
    let arrowX = 0
    let arrowY = 0

    switch (position) {
      case 'top':
        x = rect.left + rect.width / 2 - tooltipRect.width / 2 + scrollX
        y = rect.top - tooltipRect.height - 10 + scrollY
        arrowX = tooltipRect.width / 2 - 6
        arrowY = tooltipRect.height - 4
        break
      case 'bottom':
        x = rect.left + rect.width / 2 - tooltipRect.width / 2 + scrollX
        y = rect.bottom + 10 + scrollY
        arrowX = tooltipRect.width / 2 - 6
        arrowY = -4
        break
      case 'left':
        x = rect.left - tooltipRect.width - 10 + scrollX
        y = rect.top + rect.height / 2 - tooltipRect.height / 2 + scrollY
        arrowX = tooltipRect.width - 4
        arrowY = tooltipRect.height / 2 - 6
        break
      case 'right':
        x = rect.right + 10 + scrollX
        y = rect.top + rect.height / 2 - tooltipRect.height / 2 + scrollY
        arrowX = -4
        arrowY = tooltipRect.height / 2 - 6
        break
    }

    // Keep tooltip within viewport bounds
    const padding = 10
    if (x < padding) {
      x = padding
      arrowX = rect.left + rect.width / 2 - padding - 6 + scrollX
    }
    if (x + tooltipRect.width > window.innerWidth - padding) {
      x = window.innerWidth - tooltipRect.width - padding
      arrowX = rect.left + rect.width / 2 - (window.innerWidth - tooltipRect.width - padding) - 6 + scrollX
    }
    if (y < padding) {
      y = padding
    }
    if (y + tooltipRect.height > window.innerHeight - padding) {
      y = window.innerHeight - tooltipRect.height - padding
    }

    return { x, y, arrowX, arrowY }
  }

  const showTooltip = () => {
    if (tooltipRef.current && containerRef.current) {
      const { x, y, arrowX, arrowY } = calculatePosition(containerRef.current, tooltipRef.current)
      setCoords({ x, y })
      setArrowPosition({ x: arrowX, y: arrowY })
      setIsVisible(true)
      onShow?.()
    }
  }

  const hideTooltip = () => {
    setIsVisible(false)
    onHide?.()
  }

  const handleMouseEnter = () => {
    if (disableHover) return
    clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      showTooltip()
    }, delay)
  }

  const handleMouseLeave = () => {
    clearTimeout(timeoutRef.current)
    hideTooltip()
  }

  useEffect(() => {
    if (controlledShow !== undefined) {
      if (controlledShow) {
        showTooltip()
      } else {
        hideTooltip()
      }
    }
  }, [controlledShow])

  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current)
    }
  }, [])

  const isControlled = controlledShow !== undefined
  const shouldShow = isControlled ? controlledShow : isVisible

  const tooltipContent = shouldShow && (
    <div
      ref={tooltipRef}
      className={cn(
        'fixed z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg border border-gray-700 max-w-xs animate-fade-in',
        className
      )}
      style={{
        left: coords.x,
        top: coords.y,
      }}
    >
      <div className="relative">
        {content}
        <div
          className={cn(
            'absolute w-3 h-3 bg-gray-900 border border-gray-700 rotate-45',
            {
              'top-full left-1/2 -translate-x-1/2 -mt-1 border-b-0 border-r-0': position === 'top',
              'bottom-full left-1/2 -translate-x-1/2 -mb-1 border-t-0 border-l-0': position === 'bottom',
              'right-full top-1/2 -translate-y-1/2 -mr-1 border-r-0 border-b-0': position === 'left',
              'left-full top-1/2 -translate-y-1/2 -ml-1 border-l-0 border-t-0': position === 'right',
            },
            arrowClassName
          )}
          style={{
            left: position === 'left' || position === 'right' ? arrowPosition.x : '50%',
            top: position === 'top' || position === 'bottom' ? arrowPosition.y : '50%',
          }}
        />
      </div>
    </div>
  )

  return (
    <>
      <div
        ref={containerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="inline-block"
      >
        {children}
      </div>
      {tooltipContent && createPortal(tooltipContent, document.body)}
    </>
  )
}