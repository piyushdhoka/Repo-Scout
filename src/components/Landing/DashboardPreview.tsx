import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search, Code, GitBranch, Star, Users, ExternalLink, ChevronRight } from 'lucide-react'

const mockIssues = [
  {
    id: 1,
    title: "Add dark mode support to documentation",
    repository: "awesome-project/docs",
    language: "JavaScript",
    stars: 1250,
    labels: ["enhancement", "good first issue"],
    difficulty: "Easy"
  },
  {
    id: 2,
    title: "Fix memory leak in data processing module",
    repository: "datacorp/analytics",
    language: "Python",
    stars: 3400,
    labels: ["bug", "performance"],
    difficulty: "Medium"
  },
  {
    id: 3,
    title: "Implement REST API endpoints for user management",
    repository: "techstartup/backend",
    language: "TypeScript",
    stars: 890,
    labels: ["feature", "api"],
    difficulty: "Hard"
  }
]

const languages = [
  { name: "All", icon: Code },
  { name: "JavaScript", icon: Code },
  { name: "Python", icon: Code },
  { name: "TypeScript", icon: Code },
  { name: "Go", icon: Code }
]

const difficulties = ["All", "Easy", "Medium", "Hard"]

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "Easy":
      return "bg-green-900/30 text-green-400 border-green-700"
    case "Medium":
      return "bg-yellow-900/30 text-yellow-400 border-yellow-700"
    case "Hard":
      return "bg-red-900/30 text-red-400 border-red-700"
    default:
      return "bg-gray-900/30 text-gray-400 border-gray-700"
  }
}

export function DashboardPreview() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLanguage, setSelectedLanguage] = useState("All")
  const [selectedDifficulty, setSelectedDifficulty] = useState("All")
  const [currentIssueIndex, setCurrentIssueIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentIssueIndex((prev) => (prev + 1) % mockIssues.length)
        setIsAnimating(false)
      }, 300)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  const currentIssue = mockIssues[currentIssueIndex]

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10 rounded-lg animate-pulse" />

      <Card className="relative border-gray-800 bg-black/90 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-white flex items-center gap-2">
            <Search className="h-5 w-5 text-blue-400" />
            Issue Search Preview
          </CardTitle>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search issues..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-gray-700 bg-gray-900 text-white placeholder-gray-500"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="px-3 py-2 border border-gray-700 bg-gray-900 text-white rounded-md text-sm"
              >
                {languages.map((lang) => (
                  <option key={lang.name} value={lang.name}>
                    {lang.name}
                  </option>
                ))}
              </select>

              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-3 py-2 border border-gray-700 bg-gray-900 text-white rounded-md text-sm"
              >
                {difficulties.map((diff) => (
                  <option key={diff} value={diff}>
                    {diff}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Search Results */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Found 3 issues matching your criteria</span>
              <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300">
                Try Demo <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </div>

            <div
              className={`transition-all duration-300 ${
                isAnimating ? 'opacity-0 transform -translate-y-2' : 'opacity-100 transform translate-y-0'
              }`}
            >
              <Card className="border-gray-800 bg-gray-950 hover:bg-gray-900 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h3 className="font-semibold text-white hover:text-blue-400 transition-colors cursor-pointer flex-1">
                      {currentIssue.title}
                    </h3>
                    <Badge className={getDifficultyColor(currentIssue.difficulty)}>
                      {currentIssue.difficulty}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                    <span className="flex items-center gap-1">
                      <Code className="h-3 w-3" />
                      {currentIssue.repository}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      {currentIssue.stars.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      {currentIssue.labels.map((label) => (
                        <Badge key={label} variant="secondary" className="text-xs">
                          {label}
                        </Badge>
                      ))}
                    </div>
                    <Button size="sm" variant="outline" className="border-gray-700 bg-gray-800 text-white hover:bg-gray-700">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      View Issue
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Features Preview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-800">
            <div className="text-center">
              <div className="h-8 w-8 bg-blue-600/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Search className="h-4 w-4 text-blue-400" />
              </div>
              <p className="text-xs text-gray-400">Smart Search</p>
            </div>
            <div className="text-center">
              <div className="h-8 w-8 bg-green-600/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                <GitBranch className="h-4 w-4 text-green-400" />
              </div>
              <p className="text-xs text-gray-400">Track Progress</p>
            </div>
            <div className="text-center">
              <div className="h-8 w-8 bg-purple-600/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Users className="h-4 w-4 text-purple-400" />
              </div>
              <p className="text-xs text-gray-400">Save History</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}