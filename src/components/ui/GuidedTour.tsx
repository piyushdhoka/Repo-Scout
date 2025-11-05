import React, { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { X, ChevronLeft, ChevronRight, Lightbulb, Target, Search, Code, Users } from 'lucide-react'

interface TourStep {
  id: string
  selector: string
  title: string
  content: string
  position?: 'top' | 'bottom' | 'left' | 'right'
  icon?: React.ReactNode
  action?: () => void
  skip?: boolean
}

interface GuidedTourProps {
  steps: TourStep[]
  isOpen: boolean
  onClose: () => void
  onComplete?: () => void
  showSkip?: boolean
  autoStart?: boolean
  localStorageKey?: string
}

const defaultSteps: TourStep[] = [
  {
    id: 'welcome',
    selector: '.hero-section',
    title: 'Welcome to Repo Scout! 🎯',
    content: 'Let\'s take a quick tour to help you discover amazing open source contributions. I\'ll show you the key features to get you started.',
    position: 'bottom',
    icon: <Lightbulb className="h-5 w-5 text-blue-400" />
  },
  {
    id: 'search',
    selector: '.search-bar',
    title: 'Smart Search 🔍',
    content: 'Use our intelligent search to find issues that match your skills. Filter by language, labels, or specific projects to discover the perfect contribution opportunity.',
    position: 'bottom',
    icon: <Search className="h-5 w-5 text-green-400" />
  },
  {
    id: 'features',
    selector: '.features-section',
    title: 'Powerful Features ⚡',
    content: 'Explore our curated projects, real-time updates, and progress tracking. Everything you need to build your open source portfolio.',
    position: 'bottom',
    icon: <Code className="h-5 w-5 text-purple-400" />
  },
  {
    id: 'auth',
    selector: '.auth-button',
    title: 'Join the Community 🚀',
    content: 'Sign up to save your preferences, track your contributions, and get personalized recommendations. It\'s completely free!',
    position: 'left',
    icon: <Users className="h-5 w-5 text-orange-400" />
  }
]

export function GuidedTour({
  steps = defaultSteps,
  isOpen,
  onClose,
  onComplete,
  showSkip = true,
  autoStart = false,
  localStorageKey = 'reposcout-tour-completed'
}: GuidedTourProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [element, setElement] = useState<HTMLElement | null>(null)
  const [highlightStyle, setHighlightStyle] = useState({})
  const [cardPosition, setCardPosition] = useState({ top: 0, left: 0 })
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (localStorageKey && localStorage.getItem(localStorageKey) === 'true') {
      return
    }

    if (autoStart && !isOpen) {
      setTimeout(() => {
        // Auto-start tour after 2 seconds
      }, 2000)
    }
  }, [autoStart, isOpen, localStorageKey])

  useEffect(() => {
    if (!isOpen || currentStep >= steps.length) return

    const targetElement = document.querySelector(steps[currentStep].selector) as HTMLElement
    setElement(targetElement)

    if (targetElement) {
      const rect = targetElement.getBoundingClientRect()
      const scrollX = window.scrollX
      const scrollY = window.scrollY

      // Calculate highlight area
      const padding = 8
      setHighlightStyle({
        top: rect.top + scrollY - padding,
        left: rect.left + scrollX - padding,
        width: rect.width + padding * 2,
        height: rect.height + padding * 2,
        borderRadius: '8px'
      })

      // Calculate card position
      const cardWidth = 400
      const cardHeight = 200
      const cardPadding = 20
      let cardLeft = rect.left + rect.width / 2 - cardWidth / 2
      let cardTop = rect.bottom + cardPadding

      // Adjust position based on available space
      if (cardLeft < cardPadding) {
        cardLeft = cardPadding
      } else if (cardLeft + cardWidth > window.innerWidth - cardPadding) {
        cardLeft = window.innerWidth - cardWidth - cardPadding
      }

      if (cardTop + cardHeight > window.innerHeight - cardPadding) {
        cardTop = rect.top - cardHeight - cardPadding
      }

      setCardPosition({
        top: cardTop + scrollY,
        left: cardLeft + scrollX
      })

      // Scroll element into view if needed
      if (
        rect.top < 100 ||
        rect.bottom > window.innerHeight - 100
      ) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        })
      }
    }
  }, [isOpen, currentStep, steps])

  const handleNext = () => {
    const step = steps[currentStep]
    step.action?.()

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    if (localStorageKey) {
      localStorage.setItem(localStorageKey, 'true')
    }
    onComplete?.()
    onClose()
  }

  const handleSkip = () => {
    if (localStorageKey) {
      localStorage.setItem(localStorageKey, 'true')
    }
    onClose()
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      // Only close if clicking outside the highlighted area
      const rect = element?.getBoundingClientRect()
      if (rect) {
        const x = e.clientX
        const y = e.clientY
        if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
          return // Don't close when clicking outside highlight
        }
      }
    }
  }

  if (!isOpen || currentStep >= steps.length) return null

  const step = steps[currentStep]
  const isLastStep = currentStep === steps.length - 1
  const isFirstStep = currentStep === 0

  const tourContent = createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 pointer-events-none"
      style={{ pointerEvents: 'auto' }}
      onClick={handleOverlayClick}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Highlight */}
      {element && (
        <div
          className="absolute bg-white/10 backdrop-blur-sm border-2 border-blue-400 shadow-2xl animate-pulse pointer-events-none"
          style={highlightStyle}
        />
      )}

      {/* Tour Card */}
      <Card
        className="fixed w-[400px] max-w-[90vw] shadow-2xl border-blue-400 bg-black text-white pointer-events-auto animate-fade-in-up"
        style={{
          top: Math.max(cardPosition.top, 20),
          left: Math.max(cardPosition.left, 20)
        }}
      >
        <CardContent className="p-6">
          {/* Progress */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {step.icon}
              <span className="text-sm text-gray-400">
                Step {currentStep + 1} of {steps.length}
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-800 rounded-full h-1 mb-4">
            <div
              className="bg-blue-500 h-1 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>

          {/* Content */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
            <p className="text-gray-300 text-sm leading-relaxed">{step.content}</p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {!isFirstStep && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevious}
                  className="border-gray-700 bg-gray-900 text-white hover:bg-gray-800"
                >
                  <ChevronLeft className="h-3 w-3 mr-1" />
                  Previous
                </Button>
              )}
            </div>

            <div className="flex gap-2">
              {showSkip && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSkip}
                  className="text-gray-400 hover:text-white"
                >
                  Skip Tour
                </Button>
              )}

              <Button
                size="sm"
                onClick={handleNext}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isLastStep ? 'Get Started' : 'Next'}
                {!isLastStep && <ChevronRight className="h-3 w-3 ml-1" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>,
    document.body
  )

  return tourContent
}

// Hook to trigger guided tour
export function useGuidedTour(steps?: TourStep[], localStorageKey?: string) {
  const [isOpen, setIsOpen] = useState(false)

  const startTour = () => {
    if (localStorageKey && localStorage.getItem(localStorageKey) === 'true') {
      return false
    }
    setIsOpen(true)
    return true
  }

  const closeTour = () => setIsOpen(false)

  const TourComponent = () => (
    <GuidedTour
      steps={steps}
      isOpen={isOpen}
      onClose={closeTour}
      localStorageKey={localStorageKey}
    />
  )

  return { startTour, closeTour, TourComponent, isOpen }
}