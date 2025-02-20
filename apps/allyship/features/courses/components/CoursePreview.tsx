import Image from 'next/image'
import { BarChart2, BookOpen, Clock } from 'lucide-react'
import { generateImage } from '@/lib/generate-image'

import { Badge } from '@workspace/ui/components/badge'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@workspace/ui/components/card'

const levelColorMap: Record<Course['level'], string> = {
  Beginner: 'bg-green-100 text-green-800',
  Intermediate: 'bg-yellow-100 text-yellow-800',
  Advanced: 'bg-red-100 text-red-800',
}

type CoursePreviewProps = {
  course: Course
}

export const CoursePreview: React.FC<CoursePreviewProps> = ({ course }) => {
  return (
    <Card className="group overflow-hidden transition-shadow hover:shadow-lg">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          <Image
            src={generateImage(course.title) || '/placeholder.svg'}
            alt={course.title}
            layout="fill"
            objectFit="cover"
            className="transition-transform group-hover:scale-105"
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-4 p-6">
        <h3 className="text-2xl font-bold leading-tight text-primary">
          {course.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {course.description}
        </p>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4 p-6 pt-0">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {course.duration}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {course.lessons > 0
                ? `${course.lessons} lesson${course.lessons !== 1 ? 's' : ''}`
                : 'N/A'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <BarChart2 className="h-4 w-4 text-muted-foreground" />
          <Badge
            variant="secondary"
            className={`px-2 py-1 ${levelColorMap[course.level] || ''}`}
          >
            {course.level}
          </Badge>
        </div>
      </CardFooter>
    </Card>
  )
}
