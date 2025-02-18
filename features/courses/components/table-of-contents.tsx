import { CheckCircle } from "lucide-react"

import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Lesson = {
  id: string
  title: string
}

type TableOfContentsProps = {
  lessons: Lesson[]
  currentLessonId: string
}

export function TableOfContents({
  lessons,
  currentLessonId,
}: TableOfContentsProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-8">
      {/* Course Introduction */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Master Modern Web Development</h1>
        <p className="text-xl text-muted-foreground">
          Learn to build professional, scalable web applications from scratch
          using cutting-edge technologies and best practices.
        </p>
      </div>

      {/* Key Features */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle>What You'll Learn</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              "Full-stack Development with Next.js",
              "Modern UI Design with Tailwind CSS",
              "Authentication and Authorization",
              "API Development and Integration",
              "Deployment and DevOps Basics",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span>{item}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle>Course Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              "40+ Hours of Video Content",
              "Hands-on Projects",
              "Downloadable Resources",
              "Certificate of Completion",
              "Lifetime Access",
              "Community Support",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span>{item}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Course Content */}
      <Card className="border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle>Course Content</CardTitle>
          <p className="text-sm text-muted-foreground">
            {lessons.length} comprehensive lessons to take you from beginner to
            professional
          </p>
        </CardHeader>
        <CardContent className="grid gap-2">
          {lessons.map((lesson) => (
            <div
              key={lesson.id}
              className={cn(
                "flex items-center rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent/50 cursor-pointer",
                currentLessonId === lesson.id && "bg-accent"
              )}
            >
              <div className="flex flex-col flex-1">
                <span className="font-medium">{lesson.title}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
