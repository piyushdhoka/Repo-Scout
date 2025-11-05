import { useEffect, useState, useRef } from 'react'
import { useInView } from 'react-intersection-observer'

interface AnimationOptions {
  threshold?: number
  triggerOnce?: boolean
  rootMargin?: string
  delay?: number
  duration?: number
}

interface ScrollAnimationResult {
  ref: (node?: Element | null) => void
  inView: boolean
  animated: boolean
  animationClasses: string
}

export function useScrollAnimation(options: AnimationOptions = {}): ScrollAnimationResult {
  const {
    threshold = 0.1,
    triggerOnce = true,
    rootMargin = '0px',
    delay = 0,
    duration = 1000
  } = options

  const [hasAnimated, setHasAnimated] = useState(false)
  const [animationClasses, setAnimationClasses] = useState('')

  const { ref, inView } = useInView({
    threshold,
    triggerOnce,
    rootMargin
  })

  useEffect(() => {
    if (inView && !hasAnimated) {
      if (delay > 0) {
        const timer = setTimeout(() => {
          setAnimationClasses('animate-fade-in-up')
          setHasAnimated(true)
        }, delay)
        return () => clearTimeout(timer)
      } else {
        setAnimationClasses('animate-fade-in-up')
        setHasAnimated(true)
      }
    }
  }, [inView, hasAnimated, delay])

  return {
    ref,
    inView,
    animated: hasAnimated,
    animationClasses
  }
}

interface CounterAnimationOptions extends AnimationOptions {
  endValue: number
  duration?: number
  startValue?: number
  prefix?: string
  suffix?: string
}

interface CounterResult extends ScrollAnimationResult {
  value: string
}

export function useCounterAnimation(options: CounterAnimationOptions): CounterResult {
  const {
    endValue,
    duration = 2000,
    startValue = 0,
    prefix = '',
    suffix = '',
    ...animationOptions
  } = options

  const [currentValue, setCurrentValue] = useState(startValue)
  const [isAnimating, setIsAnimating] = useState(false)
  const animationRef = useRef<number>()
  const startTimeRef = useRef<number>()

  const { ref, inView, animated, animationClasses } = useScrollAnimation(animationOptions)

  useEffect(() => {
    if (inView && !isAnimating && !animated) {
      setIsAnimating(true)
      startTimeRef.current = performance.now()

      const animate = (currentTime: number) => {
        if (!startTimeRef.current) {
          startTimeRef.current = currentTime
        }

        const elapsed = currentTime - startTimeRef.current
        const progress = Math.min(elapsed / duration, 1)

        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4)
        const value = Math.floor(startValue + (endValue - startValue) * easeOutQuart)

        setCurrentValue(value)

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate)
        } else {
          setIsAnimating(false)
        }
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [inView, isAnimating, animated, endValue, duration, startValue])

  return {
    ref,
    inView,
    animated,
    animationClasses,
    value: `${prefix}${currentValue.toLocaleString()}${suffix}`
  }
}

interface StaggerAnimationOptions {
  staggerDelay?: number
  itemCount: number
  baseOptions?: AnimationOptions
}

export function useStaggerAnimation({
  staggerDelay = 100,
  itemCount,
  baseOptions = {}
}: StaggerAnimationOptions) {
  const [animatedItems, setAnimatedItems] = useState<Set<number>>(new Set())

  const { ref, inView } = useInView({
    threshold: baseOptions.threshold || 0.1,
    triggerOnce: baseOptions.triggerOnce !== false,
    rootMargin: baseOptions.rootMargin || '0px'
  })

  useEffect(() => {
    if (inView && animatedItems.size === 0) {
      const timers: NodeJS.Timeout[] = []

      for (let i = 0; i < itemCount; i++) {
        const timer = setTimeout(() => {
          setAnimatedItems(prev => new Set(prev).add(i))
        }, i * staggerDelay)
        timers.push(timer)
      }

      return () => {
        timers.forEach(clearTimeout)
      }
    }
  }, [inView, animatedItems.size, itemCount, staggerDelay])

  const getItemProps = (index: number) => ({
    ref: index === 0 ? ref : undefined,
    className: `transition-all duration-700 ${
      animatedItems.has(index)
        ? 'opacity-100 translate-y-0'
        : 'opacity-0 translate-y-8'
    }`
  })

  return {
    ref,
    inView,
    getItemProps,
    allAnimated: animatedItems.size === itemCount
  }
}

export function useParallax(speed: number = 0.5) {
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setOffset(window.scrollY * speed)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [speed])

  return {
    transform: `translateY(${offset}px)`,
    style: {
      transform: `translateY(${offset}px)`
    }
  }
}