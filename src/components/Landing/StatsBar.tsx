import React, { useEffect, useState, useRef } from 'react'
import { useInView } from 'react-intersection-observer'

interface Stat {
  value: string
  label: string
  prefix?: string
  suffix?: string
  duration?: number
}

interface StatsBarProps {
  stats: Stat[]
  className?: string
}

function AnimatedCounter({
  value,
  prefix = '',
  suffix = '',
  duration = 2000
}: {
  value: number
  prefix?: string
  suffix?: string
  duration?: number
}) {
  const [displayValue, setDisplayValue] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)
  const startTimeRef = useRef<number>()
  const animationFrameRef = useRef<number>()

  useEffect(() => {
    if (!hasStarted) return

    const animate = (currentTime: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = currentTime
      }

      const elapsed = currentTime - startTimeRef.current
      const progress = Math.min(elapsed / duration, 1)

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const currentValue = Math.floor(value * easeOutQuart)

      setDisplayValue(currentValue)

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate)
      }
    }

    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [value, duration, hasStarted])

  useEffect(() => {
    setHasStarted(true)
    return () => setHasStarted(false)
  }, [])

  return (
    <span className="text-blue-400 font-bold">
      {prefix}
      {displayValue.toLocaleString()}
      {suffix}
    </span>
  )
}

export function StatsBar({ stats, className = '' }: StatsBarProps) {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

  const getNumericValue = (value: string): number => {
    // Extract numeric value from string like "10K+" -> 10000
    const match = value.match(/(\d+)([KMB]?\+?)/)
    if (!match) return 0

    const num = parseInt(match[1])
    const suffix = match[2]

    if (suffix.includes('K')) return num * 1000
    if (suffix.includes('M')) return num * 1000000
    if (suffix.includes('B')) return num * 1000000000
    return num
  }

  const getDisplayParts = (value: string) => {
    const match = value.match(/(\d+)([KMB]?\+?)/)
    if (!match) return { num: 0, prefix: '', suffix: '' }

    const num = parseInt(match[1])
    const suffix = match[2]

    return {
      num: getNumericValue(value),
      suffix: suffix,
      prefix: ''
    }
  }

  return (
    <div ref={ref} className={`bg-gradient-to-r from-gray-900 to-black border-y border-gray-800 ${className}`}>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const { num, suffix } = getDisplayParts(stat.value)

            return (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2">
                  {inView ? (
                    <AnimatedCounter
                      value={num}
                      suffix={suffix}
                      duration={stat.duration || 2000}
                    />
                  ) : (
                    <span className="text-gray-600">0{suffix}</span>
                  )}
                </div>
                <p className="text-gray-400 text-sm md:text-base">{stat.label}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}