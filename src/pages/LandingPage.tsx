import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { FeatureCard } from '@/components/Landing/FeatureCard'
import { TestimonialCard } from '@/components/Landing/TestimonialCard'
import { StatsBar } from '@/components/Landing/StatsBar'
import { DashboardPreview } from '@/components/Landing/DashboardPreview'
import { InteractiveButton } from '@/components/UI/InteractiveButton'
import { Tooltip } from '@/components/UI/Tooltip'
import { useGuidedTour } from '@/components/UI/GuidedTour'
import { useScrollAnimation } from '@/hooks/useScrollAnimations'
import {
  Search,
  Code,
  TrendingUp,
  Zap,
  Users,
  Award,
  ArrowRight,
  Github,
  Star,
  CheckCircle,
  Play,
  Sparkles,
  Target,
  Rocket
} from 'lucide-react'

const statsData = [
  { value: "10K+", label: "Available Issues", duration: 2000 },
  { value: "500+", label: "Projects", duration: 2500 },
  { value: "50+", label: "Languages", duration: 3000 },
  { value: "24/7", label: "Real-time Updates", duration: 3500 }
]

const features = [
  {
    icon: Search,
    title: "Smart Search",
    description: "Find exactly what you're looking for with advanced filtering and intelligent matching algorithms."
  },
  {
    icon: Code,
    title: "Curated Projects",
    description: "Discover issues from Y Combinator startups and top open source projects that matter."
  },
  {
    icon: TrendingUp,
    title: "Track Progress",
    description: "Monitor your contributions and build a portfolio of your open source work."
  },
  {
    icon: Zap,
    title: "Real-time Updates",
    description: "Get instant notifications when new issues match your skills and interests."
  },
  {
    icon: Users,
    title: "Community Driven",
    description: "Join a community of developers contributing to meaningful projects worldwide."
  },
  {
    icon: Award,
    title: "Skill Matching",
    description: "Get personalized recommendations based on your expertise and learning goals."
  }
]

const testimonials = [
  {
    quote: "Repo Scout helped me find my first open source contribution. The curated issues made it easy to get started!",
    author: "Sarah Chen",
    title: "Frontend Developer at TechCorp",
    avatar: "SC",
    rating: 5
  },
  {
    quote: "I've contributed to 5 different projects through Repo Scout. It's been amazing for building my portfolio.",
    author: "Marcus Rodriguez",
    title: "Full Stack Developer",
    avatar: "MR",
    rating: 5
  },
  {
    quote: "The smart search feature is incredible. I can find issues that perfectly match my skill level and interests.",
    author: "Emily Watson",
    title: "Open Source Enthusiast",
    avatar: "EW",
    rating: 5
  },
  {
    quote: "As a maintainer, I love how Repo Scout brings quality contributors to my projects. Great community!",
    author: "David Kim",
    title: "Project Maintainer",
    avatar: "DK",
    rating: 5
  }
]

export function LandingPage() {
  const [showTour, setShowTour] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)

  const { ref: heroRef, inView: heroInView, animationClasses: heroAnimation } = useScrollAnimation()
  const { ref: featuresRef, inView: featuresInView, animationClasses: featuresAnimation } = useScrollAnimation()
  const { ref: statsRef, inView: statsInView } = useScrollAnimation()
  const { ref: ctaRef, inView: ctaInView, animationClasses: ctaAnimation } = useScrollAnimation()

  // Guided tour configuration
  const tourSteps = [
    {
      id: 'welcome',
      selector: '.hero-section',
      title: 'Welcome to Repo Scout! 🎯',
      content: 'Let\'s take a quick tour to help you discover amazing open source contributions. I\'ll show you the key features to get you started.',
      position: 'bottom' as const,
      icon: <Sparkles className="h-5 w-5 text-blue-400" />
    },
    {
      id: 'search',
      selector: '.search-preview',
      title: 'Smart Search 🔍',
      content: 'Use our intelligent search to find issues that match your skills. Filter by language, labels, or specific projects to discover the perfect contribution opportunity.',
      position: 'bottom' as const,
      icon: <Search className="h-5 w-5 text-green-400" />
    },
    {
      id: 'features',
      selector: '.features-section',
      title: 'Powerful Features ⚡',
      content: 'Explore our curated projects, real-time updates, and progress tracking. Everything you need to build your open source portfolio.',
      position: 'bottom' as const,
      icon: <Zap className="h-5 w-5 text-purple-400" />
    },
    {
      id: 'cta',
      selector: '.auth-button',
      title: 'Join the Community 🚀',
      content: 'Sign up to save your preferences, track your contributions, and get personalized recommendations. It\'s completely free!',
      position: 'left' as const,
      icon: <Rocket className="h-5 w-5 text-orange-400" />
    }
  ]

  const { startTour, closeTour, TourComponent } = useGuidedTour(tourSteps, 'reposcout-landing-tour')

  useEffect(() => {
    // Auto-start tour after 3 seconds for first-time visitors
    const timer = setTimeout(() => {
      const hasSeenTour = localStorage.getItem('reposcout-landing-tour')
      if (!hasSeenTour) {
        startTour()
      }
    }, 3000)

    return () => clearTimeout(timer)
  }, [startTour])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-lg border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Search className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-bold">Repo Scout</span>
            </div>

            <nav className="hidden md:flex items-center gap-6">
              <button
                onClick={() => scrollToSection('features')}
                className="text-gray-300 hover:text-white transition-colors"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection('how-it-works')}
                className="text-gray-300 hover:text-white transition-colors"
              >
                How It Works
              </button>
              <button
                onClick={() => scrollToSection('testimonials')}
                className="text-gray-300 hover:text-white transition-colors"
              >
                Testimonials
              </button>
            </nav>

            <div className="flex items-center gap-4">
              <Tooltip content="Sign in to your existing account">
                <InteractiveButton
                  variant="outline"
                  onClick={() => window.location.href = '/auth'}
                  className="border-gray-700 bg-gray-900 text-white hover:bg-gray-800"
                >
                  Sign In
                </InteractiveButton>
              </Tooltip>

              <Tooltip content="Start your open source journey">
                <InteractiveButton
                  onClick={() => window.location.href = '/auth'}
                  className="auth-button bg-blue-600 hover:bg-blue-700 text-white"
                  glow
                  ripple
                >
                  Get Started
                  <Rocket className="ml-2 h-4 w-4" />
                </InteractiveButton>
              </Tooltip>

              <Tooltip content="Take a quick tour of Repo Scout">
                <Button
                  variant="ghost"
                  onClick={startTour}
                  className="text-gray-400 hover:text-white p-2"
                >
                  <Target className="h-5 w-5" />
                </Button>
              </Tooltip>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  Find Your Next Open Source Contribution
                </h1>
                <p className="text-xl text-gray-400 leading-relaxed">
                  Discover curated GitHub issues from Y Combinator startups and top open source projects.
                  Match your skills with meaningful contributions that matter.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  onClick={() => window.location.href = '/auth'}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-3"
                >
                  Start Searching
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => scrollToSection('features')}
                  className="border-gray-700 bg-gray-900 text-white hover:bg-gray-800 text-lg px-8 py-3"
                >
                  Learn More
                </Button>
              </div>

              <div className="flex items-center gap-8 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span>Free forever</span>
                </div>
                <div className="flex items-center gap-2">
                  <Github className="h-4 w-4" />
                  <span>GitHub integrated</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <DashboardPreview />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <StatsBar stats={statsData} />

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Powerful Features for Contributors
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Everything you need to find, track, and contribute to meaningful open source projects
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 bg-gray-950">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              How Repo Scout Works
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Get started contributing to open source in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-gray-800 bg-black text-center">
              <CardContent className="p-8">
                <div className="h-16 w-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-blue-400">1</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">Create Your Profile</h3>
                <p className="text-gray-400">
                  Sign up and tell us about your skills, interests, and preferred programming languages.
                </p>
              </CardContent>
            </Card>

            <Card className="border-gray-800 bg-black text-center">
              <CardContent className="p-8">
                <div className="h-16 w-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-blue-400">2</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">Discover Issues</h3>
                <p className="text-gray-400">
                  Browse curated issues from top projects, filtered by your skills and difficulty preferences.
                </p>
              </CardContent>
            </Card>

            <Card className="border-gray-800 bg-black text-center">
              <CardContent className="p-8">
                <div className="h-16 w-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-blue-400">3</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">Start Contributing</h3>
                <p className="text-gray-400">
                  Make your first contribution, track your progress, and build your open source portfolio.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 bg-gradient-to-br from-gray-900 to-black">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Loved by Contributors Worldwide
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              See what developers are saying about their Repo Scout experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={index}
                quote={testimonial.quote}
                author={testimonial.author}
                title={testimonial.title}
                avatar={testimonial.avatar}
                rating={testimonial.rating}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-900 to-purple-900">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Contributing?
          </h2>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Join thousands of developers who are already making meaningful contributions to open source projects.
          </p>
          <Button
            size="lg"
            onClick={() => window.location.href = '/auth'}
            className="bg-white text-blue-900 hover:bg-gray-100 text-lg px-8 py-3"
          >
            Get Started Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-black border-t border-gray-800">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Search className="h-4 w-4 text-white" />
                </div>
                <span className="text-xl font-bold">Repo Scout</span>
              </div>
              <p className="text-gray-400">
                Find your next open source contribution with Repo Scout.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button className="hover:text-white transition-colors">Features</button></li>
                <li><button className="hover:text-white transition-colors">Pricing</button></li>
                <li><button className="hover:text-white transition-colors">API</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button className="hover:text-white transition-colors">Documentation</button></li>
                <li><button className="hover:text-white transition-colors">Blog</button></li>
                <li><button className="hover:text-white transition-colors">Community</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button className="hover:text-white transition-colors">About</button></li>
                <li><button className="hover:text-white transition-colors">Contact</button></li>
                <li><button className="hover:text-white transition-colors">Privacy</button></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Repo Scout. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage