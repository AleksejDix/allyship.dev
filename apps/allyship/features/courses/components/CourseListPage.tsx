import { ArrowRight } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'

interface CoursePreview {
  id: string
  title: string
  description: string
  imageUrl: string
  tags: string[]
  lessons: number
  duration: string
  level: string
  comingSoon: boolean
}

export function CourseListPage() {
  const courses: CoursePreview[] = [
    {
      id: 'web-a11y-101',
      title: 'Web Accessibility 101',
      description:
        'Master the fundamentals of web accessibility and learn how to create inclusive digital experiences for all users.',
      imageUrl: '/images/courses/web-a11y-101.jpg',
      tags: ['Accessibility', 'Web Development', 'WCAG'],
      lessons: 8,
      duration: '4 hours',
      level: 'Beginner',
      comingSoon: true,
    },
    {
      id: 'advanced-a11y',
      title: 'Advanced Accessibility Techniques',
      description:
        'Take your accessibility skills to the next level with advanced techniques, patterns, and best practices.',
      imageUrl: '/images/courses/advanced-a11y.jpg',
      tags: ['Accessibility', 'Advanced', 'ARIA'],
      lessons: 10,
      duration: '6 hours',
      level: 'Advanced',
      comingSoon: true,
    },
  ]

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {courses.map(course => (
        <Card key={course.id} className="group relative overflow-hidden">
          <CardHeader className="border-b p-0">
            <div className="aspect-video relative bg-gradient-to-br from-primary/10 to-primary/5">
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                Course preview coming soon
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-2.5 p-4">
            <Badge variant="secondary" className="w-fit">
              {course.comingSoon ? 'Coming Soon' : course.level}
            </Badge>
            <h3 className="text-xl font-semibold tracking-tight">
              {course.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {course.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {course.tags.map(tag => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Button
              variant="outline"
              className="w-full"
              disabled={course.comingSoon}
            >
              {course.comingSoon ? 'Coming Soon' : 'Start Learning'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
