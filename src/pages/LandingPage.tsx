import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { DashboardPreview } from '@/components/Landing/DashboardPreview'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useScrollAnimation } from '@/hooks/useScrollAnimations'
import { SEO } from '@/components/SEO'
import {
  Search,
  Zap,
  ArrowRight,
  Github,
  Star,
  CheckCircle,
  Sparkles,
  Target,
  Rocket
} from 'lucide-react'

// Removed old features/testimonials/stats data after design simplification

export function LandingPage() {
  const { ref: heroRef, inView: heroInView, animationClasses: heroAnimation } = useScrollAnimation()

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

  return (
    // keep space for the global sticky header
    <div className="min-h-screen pt-16 bg-black text-white">
      <SEO 
        description="Discover curated GitHub issues from Y Combinator startups and top open source projects. Find your next meaningful contribution with Repo Scout's advanced search and filtering."
        keywords="GitHub issues, open source, contributions, Y Combinator, startups, programming, development, good first issues, beginner friendly"
      />

      {/* Hero Section */}
      <section ref={heroRef} className={`hero-section relative py-20 px-4 ${heroAnimation}`}>
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <img src="/repo_logo.png" alt="Repo Scout logo" className="h-12 w-12 rounded-full object-cover shadow" />
                  <span className="sr-only">Repo Scout</span>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-2 px-3 py-1 bg-blue-600/20 border border-blue-600/30 rounded-full">
                    <Sparkles className="h-4 w-4 text-blue-400" />
                    <span className="text-sm text-blue-400 font-medium">Now Live! 🎉</span>
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300 p-1">
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>See what's new</p>
                    </TooltipContent>
                  </Tooltip>
                </div>

                <h1 className="text-4xl md:text-6xl font-bold text-white font-instrument">
                  Find Your Next Open Source Contribution
                </h1>
                <p className="text-xl text-gray-400 leading-relaxed font-sans">
                  Discover curated GitHub issues from Y Combinator startups and top open source projects.
                  Match your skills with meaningful contributions that matter.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-2 hover:text-gray-300 transition-colors cursor-pointer">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span>No credit card required</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>No hidden fees or subscriptions</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-2 hover:text-gray-300 transition-colors cursor-pointer">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span>Free forever</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Always free for contributors</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-2 hover:text-gray-300 transition-colors cursor-pointer">
                      <Github className="h-4 w-4" />
                      <span>GitHub integrated</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Connect with your GitHub account</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>

            <div className="relative search-preview">
              <DashboardPreview />
              {/* Floating action buttons */}
              <div className="absolute -top-4 -right-4 animate-bounce">
                <div className="bg-blue-600 text-white rounded-full p-3 shadow-lg">
                  <Star className="h-5 w-5" />
                </div>
              </div>
              <div className="absolute -bottom-4 -left-4 animate-pulse">
                <div className="bg-purple-600 text-white rounded-full p-3 shadow-lg">
                  <Target className="h-5 w-5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 bg-black">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-instrument">
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
    </div>
  )
}

export default LandingPage