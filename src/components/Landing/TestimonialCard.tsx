import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Star, Quote } from 'lucide-react'

interface TestimonialCardProps {
  quote: string
  author: string
  title: string
  avatar: string
  rating?: number
  className?: string
}

export function TestimonialCard({
  quote,
  author,
  title,
  avatar,
  rating = 5,
  className = ''
}: TestimonialCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <Card className={`border-gray-800 bg-black hover:bg-gray-950 transition-all duration-300 ${className}`}>
      <CardContent className="p-6">
        <Quote className="h-8 w-8 text-blue-400/20 mb-4" />

        <blockquote className="text-gray-300 mb-6 leading-relaxed">
          "{quote}"
        </blockquote>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
              {avatar || getInitials(author)}
            </div>
            <div>
              <p className="text-white font-medium">{author}</p>
              <p className="text-gray-500 text-sm">{title}</p>
            </div>
          </div>

          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-700'
                }`}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}