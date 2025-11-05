import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  className?: string
}

export function FeatureCard({ icon: Icon, title, description, className = '' }: FeatureCardProps) {
  return (
    <Card className={`border-gray-800 bg-black hover:bg-gray-950 transition-all duration-300 hover:border-blue-800 group ${className}`}>
      <CardHeader className="text-center">
        <div className="mx-auto h-12 w-12 bg-blue-600/10 rounded-lg flex items-center justify-center group-hover:bg-blue-600/20 transition-colors">
          <Icon className="h-6 w-6 text-blue-400" />
        </div>
        <CardTitle className="text-white">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-gray-400 text-center">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  )
}